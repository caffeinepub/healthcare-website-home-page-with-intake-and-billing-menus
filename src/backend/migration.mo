import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
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

  type Actor = {
    nextInvoiceId : Nat;
    nextInquiryId : Nat;
    invoices : Map.Map<Nat, Invoice>;
    inquiries : Map.Map<Nat, {
      id : Nat;
      details : Text;
      isInvoiced : Bool;
      owner : Principal;
    }>;
    userProfiles : Map.Map<Principal, {
      name : Text;
      email : Text;
      company : Text;
    }>;
    isLOCSampleAvailable : Bool;
  };

  public func run(old : Actor) : Actor {
    let updatedInvoices = old.invoices.map<Nat, Invoice, Invoice>(
      func(_id, invoice) {
        if (invoice.projectName == "LOC Inquiry" and invoice.clientName == "PhilipTest" and invoice.amountDue == 3100.0 and invoice.socDate == ?("2026-01-02")) {
          { invoice with dischargeDate = null };
        } else {
          invoice;
        };
      }
    );
    { old with invoices = updatedInvoices };
  };
};
