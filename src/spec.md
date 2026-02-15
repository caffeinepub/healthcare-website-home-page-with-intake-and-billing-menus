# Specification

## Summary
**Goal:** Make the Manifest LOC Billing “Display” action always show the required sample inquiry row (PhilipTest / KT99) by automatically resetting/deleting its previously created invoices when it has already been invoiced.

**Planned changes:**
- Backend: add a method to delete invoice(s) tied to the LOC sample record (PhilipTest / KT99) and set the matching inquiry’s `isInvoiced` back to `false`, enforcing existing authorization rules.
- Frontend: update the Manifest LOC Billing page “Display” click flow to, when the sample inquiry is missing among non-invoiced inquiries, call the backend reset method, then re-fetch inquiries and render the restored sample row.
- Ensure the “Display” flow continues to exclude other invoiced inquiries; only the sample record is force-restored.

**User-visible outcome:** Clicking “Display” on the Manifest LOC Billing page reliably shows the sample row with Client=PhilipTest, MR#=KT99, Statement period=1/1/2026–1/31/2026, Payer=NGS, Amount=3100, even if it had been invoiced previously.
