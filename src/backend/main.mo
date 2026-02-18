import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

// Apply migration on upgrade
(with migration = Migration.run)
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Invoice = {
    id : Nat;
    projectName : Text;
    amountDue : Float;
    dueDate : Text;
    status : Text;
    clientName : Text;
    payerSource : Text;
    owner : ?Principal;
    invoiceDate : ?Text;
    transactionDate : ?Text;
    socDate : ?Text;
    dischargeDate : ?Text;
  };

  type Inquiry = {
    id : Nat;
    details : Text;
    isInvoiced : Bool;
    owner : Principal;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    company : Text;
  };

  public type LOCInquiry = {
    client : Text;
    mrNumber : Text;
    statementPeriod : Text;
    payer : Text;
    amount : Float;
    socDate : ?Text;
    dischargeDate : ?Text;
  };

  public type InvoiceRequest = {
    projectName : Text;
    amountDue : Float;
    dueDate : Text;
    clientName : Text;
    payerSource : Text;
    invoiceDate : ?Text;
    transactionDate : ?Text;
    socDate : ?Text;
    dischargeDate : ?Text;
  };

  var nextInvoiceId = 0;
  var nextInquiryId = 0;

  let invoices = Map.empty<Nat, Invoice>();
  let inquiries = Map.empty<Nat, Inquiry>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Flag to track if the sample inquiry is available for creating NEW invoices
  var isLOCSampleAvailable = true;

  // Anonymous principal constant for comparison
  let anonymousPrincipal = Principal.fromText("2vxsx-fae");

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  /// --- Invoice Management

  /// Create invoice (can be anonymous for LOC, otherwise must be logged in)
  public shared ({ caller }) func createInvoice(invoiceRequest : InvoiceRequest) : async Nat {
    // Check if this is a LOC invoice based on specific criteria
    let isLOCInvoice = invoiceRequest.projectName == "LOC Inquiry" and invoiceRequest.clientName == "PhilipTest" and invoiceRequest.amountDue == 3100.0 and invoiceRequest.socDate == ?("2026-01-02");

    // Check if caller is anonymous
    let isAnonymous = caller == anonymousPrincipal;

    // Authorization: Allow anonymous users ONLY for LOC invoices
    // For all other invoices, require authenticated user
    if (not isLOCInvoice and not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create invoices");
    };

    let invoice : Invoice = {
      id = nextInvoiceId;
      projectName = invoiceRequest.projectName;
      amountDue = invoiceRequest.amountDue;
      dueDate = invoiceRequest.dueDate;
      status = "pending";
      clientName = invoiceRequest.clientName;
      payerSource = invoiceRequest.payerSource;
      owner = if (isLOCInvoice and isAnonymous) { null } else { ?caller };
      invoiceDate = invoiceRequest.invoiceDate;
      transactionDate = invoiceRequest.transactionDate;
      socDate = invoiceRequest.socDate;
      dischargeDate = invoiceRequest.dischargeDate;
    };
    invoices.add(nextInvoiceId, invoice);

    // Update LOC sample availability state when creating the LOC sample invoice
    if (isLOCInvoice) {
      isLOCSampleAvailable := false;
    };

    nextInvoiceId += 1;
    invoice.id;
  };

  public shared ({ caller }) func markInvoiceAsPaid(invoiceId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark invoices as paid");
    };

    switch (invoices.get(invoiceId)) {
      case (null) { false };
      case (?invoice) {
        // Check ownership or admin rights
        if (invoice.owner != ?caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only modify your own invoices");
        };

        let updatedInvoice : Invoice = {
          id = invoiceId;
          projectName = invoice.projectName;
          amountDue = invoice.amountDue;
          dueDate = invoice.dueDate;
          clientName = invoice.clientName;
          status = "paid";
          payerSource = invoice.payerSource;
          owner = invoice.owner;
          invoiceDate = invoice.invoiceDate;
          transactionDate = invoice.transactionDate;
          socDate = invoice.socDate;
          dischargeDate = invoice.dischargeDate;
        };
        invoices.add(invoiceId, updatedInvoice);
        true;
      };
    };
  };

  public query ({ caller }) func getInvoice(invoiceId : Nat) : async ?Invoice {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view invoices");
    };

    switch (invoices.get(invoiceId)) {
      case (null) { null };
      case (?invoice) {
        // Check ownership or admin rights
        if (invoice.owner != ?caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own invoices");
        };
        ?invoice;
      };
    };
  };

  public query ({ caller }) func getAllInvoices() : async [Invoice] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view invoices");
    };

    // Admins see all invoices, users see only their own
    if (AccessControl.isAdmin(accessControlState, caller)) {
      invoices.values().toArray();
    } else {
      let filtered = invoices.values().filter(func(invoice) { invoice.owner == ?caller });
      filtered.toArray();
    };
  };

  public query ({ caller }) func getInvoicesByStatus(status : Text) : async [Invoice] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view invoices");
    };

    let filtered = if (AccessControl.isAdmin(accessControlState, caller)) {
      invoices.values().filter(func(invoice) { invoice.status == status });
    } else {
      invoices.values().filter(func(invoice) { invoice.status == status and invoice.owner == ?caller });
    };
    filtered.toArray();
  };

  public query ({ caller }) func getInvoicesByClient(clientName : Text) : async [Invoice] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view invoices");
    };

    let filtered = if (AccessControl.isAdmin(accessControlState, caller)) {
      invoices.values().filter(func(invoice) { invoice.clientName == clientName });
    } else {
      invoices.values().filter(func(invoice) { invoice.clientName == clientName and invoice.owner == ?caller });
    };
    filtered.toArray();
  };

  // LOC Receivables are accessible to all users including anonymous (guests)
  // This allows the LOC workflow to function for both anonymous and authenticated users
  // Anonymous users can view LOC receivables to see if their invoice was created
  // Authenticated users can view LOC receivables as part of the billing workflow
  public query ({ caller }) func getLOCReceivables() : async [Invoice] {
    // No authorization check - accessible to everyone including anonymous users (guests)
    // This is intentional for the LOC billing workflow where anonymous users
    // need to verify their invoice creation
    invoices.values().filter(
      func(invoice) {
        invoice.projectName == "LOC Inquiry" and invoice.status == "pending";
      }
    ).toArray();
  };

  /// Delete Invoice - allows guest (anonymous) deletion for LOC sample
  public shared ({ caller }) func deleteInvoice(invoiceId : Nat) : async Bool {
    let invoiceOpt = invoices.get(invoiceId);
    switch (invoiceOpt) {
      case (null) { false };
      case (?invoice) {
        let isLOCInvoice = invoice.projectName == "LOC Inquiry" and invoice.clientName == "PhilipTest" and invoice.amountDue == 3100.0 and invoice.socDate == ?("2026-01-02");

        // Special handling for LOC sample invoice
        if (isLOCInvoice) {
          // If the invoice has no owner (created by anonymous), allow anyone to delete it
          // If the invoice has an owner, only that owner or admin can delete it
          switch (invoice.owner) {
            case (null) {
              // Anonymous-created LOC invoice - anyone can delete (no auth check needed)
            };
            case (?owner) {
              // Owned LOC invoice - only owner or admin can delete
              if (caller != owner and not AccessControl.isAdmin(accessControlState, caller)) {
                Runtime.trap("Unauthorized: Only the creator or admin can delete this invoice");
              };
            };
          };
        } else {
          // For all non-LOC invoices, require user permissions
          if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Runtime.trap("Unauthorized: Only users can delete invoices");
          };

          // Check ownership or admin rights for regular invoices
          if (invoice.owner != ?caller and not AccessControl.isAdmin(accessControlState, caller)) {
            Runtime.trap("Unauthorized: Can only delete your own invoices");
          };
        };

        // If this is a LOC invoice being deleted, restore availability
        if (isLOCInvoice) {
          isLOCSampleAvailable := true;
        };

        invoices.remove(invoiceId);
        true;
      };
    };
  };

  // Inquiry Management (for future implementation)
  public shared ({ caller }) func createInquiry(details : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create inquiries");
    };

    let inquiry : Inquiry = {
      id = nextInquiryId;
      details;
      isInvoiced = false;
      owner = caller;
    };
    inquiries.add(nextInquiryId, inquiry);
    nextInquiryId += 1;
    inquiry.id;
  };

  public query ({ caller }) func getInquiries() : async [Inquiry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view inquiries");
    };

    if (AccessControl.isAdmin(accessControlState, caller)) {
      inquiries.values().toArray();
    } else {
      let filtered = inquiries.values().filter(func(inquiry) { inquiry.owner == caller });
      filtered.toArray();
    };
  };

  public shared ({ caller }) func markInquiryAsInvoiced(inquiryId : Nat, isInvoiced : Bool) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update inquiries");
    };

    switch (inquiries.get(inquiryId)) {
      case (null) { false };
      case (?inquiry) {
        if (inquiry.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only modify your own inquiries");
        };

        let updatedInquiry : Inquiry = {
          id = inquiryId;
          details = inquiry.details;
          isInvoiced;
          owner = inquiry.owner;
        };
        inquiries.add(inquiryId, updatedInquiry);
        true;
      };
    };
  };

  // Manifest LOC Billing Specific Functions

  // Allow both anonymous and authenticated users to display LOC inquiries only when available
  public query ({ caller }) func displayLOCInquiry() : async ?LOCInquiry {
    // No authorization check - accessible to everyone including anonymous users (guests)
    // This is intentional for the LOC billing workflow
    if (isLOCSampleAvailable) {
      ?{
        client = "PhilipTest";
        mrNumber = "KT99";
        statementPeriod = "1/1/2026-1/31/2026";
        payer = "NGS";
        amount = 3100;
        socDate = ?("2026-01-02");
        dischargeDate = null;
      };
    } else {
      null;
    };
  };
};
