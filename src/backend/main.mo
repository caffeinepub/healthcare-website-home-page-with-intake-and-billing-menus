import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

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
    owner : ?Principal;
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
  };

  var nextInvoiceId = 0;
  var nextInquiryId = 0;

  let invoices = Map.empty<Nat, Invoice>();
  let inquiries = Map.empty<Nat, Inquiry>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Flag to track if the sample inquiry is available
  var isLOCSampleAvailable = true;

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

  // Invoice Management
  public shared ({ caller }) func createInvoice(projectName : Text, amountDue : Float, dueDate : Text, clientName : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create invoices");
    };

    let invoice : Invoice = {
      id = nextInvoiceId;
      projectName;
      amountDue;
      dueDate;
      status = "pending";
      clientName;
      owner = ?caller;
    };
    invoices.add(nextInvoiceId, invoice);
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
          owner = invoice.owner;
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

  public shared ({ caller }) func deleteInvoice(invoiceId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete invoices");
    };

    switch (invoices.get(invoiceId)) {
      case (null) { false };
      case (?invoice) {
        if (invoice.owner != ?caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own invoices");
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

  public query ({ caller }) func displayLOCInquiry() : async ?LOCInquiry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view inquiries");
    };

    if (isLOCSampleAvailable) {
      ?{
        client = "PhilipTest";
        mrNumber = "KT99";
        statementPeriod = "1/1/2026-1/31/2026";
        payer = "NGS";
        amount = 3100;
      };
    } else {
      null;
    };
  };

  public shared ({ caller }) func deleteLOCInvoice() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete LOC invoices");
    };

    // Reset the sample inquiry availability
    isLOCSampleAvailable := true;
    true;
  };
};
