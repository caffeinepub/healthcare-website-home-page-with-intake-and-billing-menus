# Specification

## Summary
**Goal:** Present a Billing-only experience by removing all Intake navigation, dashboard content, and route access.

**Planned changes:**
- Remove the top-level “Intake” navigation item from the header so only Billing-focused navigation remains.
- Update the Home (dashboard/landing) page to remove all Intake promotional/marketing content (CTAs, cards/sections, and copy referencing Intake).
- Remove the `/intake` route from the frontend routing so it no longer renders Intake content; direct visits to `/intake` will redirect to a Billing destination (e.g., `/billing`) or show a not-found style outcome.

**User-visible outcome:** Users will no longer see Intake anywhere in the header or Home page, and attempting to visit `/intake` will not display Intake—resulting in a Billing-focused app experience.
