# Specification

## Summary
**Goal:** Allow anonymous users to cancel/delete LOC sample invoices without an Internet Identity sign-in prompt, and correct the LOC sample inquiry SOC/Discharge date values.

**Planned changes:**
- Fix LOC invoice delete/cancel flows (LOC Receivables grid Delete action and “Cancel Invoice” in Claim details) to work when not signed in, without triggering an authorization/sign-in trap for LOC sample invoices.
- Ensure the LOC Receivables grid updates immediately after successful deletion/cancellation (no manual refresh), and LOC sample inquiry availability is restored after deleting the sample invoice.
- Add clear, English error messaging and prevent stuck loading states when deletion fails for non-auth reasons.
- Update the LOC sample inquiry data so SOC Date is exactly “1/1/2026” and Discharge Date is blank/empty in the Manifest LOC Billing inquiry grid and in any stored invoice data derived from that inquiry, keeping sample-invoice detection logic consistent with the updated values.

**User-visible outcome:** Users can delete/cancel LOC sample invoices anonymously from both the LOC Receivables page and the Claim details dialog, see the grid update immediately, re-run the LOC sample inquiry after deletion, and see SOC Date as “1/1/2026” with a blank Discharge Date throughout the LOC inquiry and invoice details.
