# Project Log - 2026-05-20

## Summary

Today we continued polishing the Colne Sofa LTD website after the Vercel deployment went live. The main focus was brand presentation, contact details, form usability, and confirming which Vercel URL should be used for live checks.

## Changes Completed

### Navbar logo

- Added a real navbar logo asset for the site header.
- Converted the supplied logo into a header-friendly version with transparent background and light wordmark for the navy navbar.
- Updated `src/components/SiteHeader.tsx` to use the logo image instead of the previous text-only brand.
- Final asset added:
  - `public/colne-sofa-logo-navbar-light.png`

### Contact details

- Added a shared contact config so contact details can be updated from one place.
- Updated the contact page and footer to use the shared values.
- Current contact details:
  - Email: `colnesofaltd@gmail.com`
  - Mobile: `07417 556531`
  - Tel link: `+447417556531`
  - Address:
    - `Colne Sofa LTD`
    - `Unit 5 Priverside Mil`
    - `Greenfield Road`
    - `BB8 9PE`
- Files updated:
  - `src/lib/contact.ts`
  - `src/routes/contact.tsx`
  - `src/components/SiteFooter.tsx`

### Contact form styling

- Improved the contact page form fields so inputs are clearly visible.
- Replaced underline-only inputs with white boxed fields.
- Added visible borders, subtle shadows, placeholder text, and gold focus states.
- File updated:
  - `src/routes/contact.tsx`

### Quote form styling

- Matched the `/quote` page form styling with the contact page.
- Updated input fields, dropdown, and textarea to use the same visible boxed style.
- Added helpful placeholders for key fields.
- File updated:
  - `src/routes/quote.tsx`

### Live deployment clarification

- Confirmed GitHub `main` is up to date with the latest commits.
- Confirmed Vercel production deployments are being created successfully.
- Important note: old Vercel deployment URLs like `colnesofaltd-p48ll2y74-pizzaalif.vercel.app` are fixed snapshots and do not update.
- Use the production alias for latest changes:
  - `https://colnesofaltd-pizzaalif.vercel.app`

## Commits Pushed Today

- `341c8911` - add navbar logo asset
- `40ff83ff` - update contact details
- `31674719` - improve contact form fields
- `0ebabf07` - match quote form field styling

## Verification

- `npm.cmd run build` was run after the UI changes and passed.
- Vercel CLI showed latest production deployment as `Ready`.
- Production alias was confirmed to point to the latest deployment.

## Follow-Ups

- Confirm the address spelling: `Priverside Mil` may need to be changed if the intended address is `Riverside Mill`.
- Open the live production alias and hard refresh with `Ctrl + F5` when checking latest UI changes.
- If a custom domain is added later, point users to that domain instead of individual deployment URLs.
