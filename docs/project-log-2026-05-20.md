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

### Admin image uploads

- Added a reusable admin image upload field that uploads selected files to Supabase Storage bucket `site-images`.
- Uploaded files are stored in the relevant bucket folder, then the public URL is automatically placed into the form field.
- The database still stores only the public image URL, not the image file itself.
- Added a Media Library inside each image field so previously uploaded images can be selected again without copying URLs from Supabase.
- Added a guarded delete action for unused Storage images.
- Upload fields were added for:
  - Home hero image: `site-images/hero/`
  - About page image: `site-images/about/`
  - Product images: `site-images/products/`
- Files updated:
  - `src/components/admin/ImageUploadField.tsx`
  - `src/routes/admin/content.index.tsx`
  - `src/routes/admin/products.new.tsx`
  - `src/routes/admin/products.$id.tsx`

### Collections

- Added two product collections using the existing `sofas.category` field:
  - `Sofa Collection`
  - `Bed Collection`
- Existing products with older category values like `Sofa` are displayed as `Sofa Collection`.
- Added a Collection dropdown to admin add/edit product forms.
- Updated the admin products table to show each product's collection.
- Updated the public `/collection` page to group products under Sofa Collection and Bed Collection.
- Updated product detail pages to show normalized collection names.
- Updated the `/quote` page product dropdown to load live products from Supabase instead of the old static sofa data file.
- Added a phone number field to the `/contact` form and included it in the WhatsApp message.

### Product management

- Improved the admin products table with search by name, slug, collection, price, description, and materials.
- Added collection filtering for Sofa Collection and Bed Collection.
- Added a live product view action from the admin table.
- Added missing data badges for product image, price, description, dimensions, and materials.
- Added a complete badge for products with all expected product data.

### Content editor redesign

- Reorganized the admin content editor into tabs:
  - Home Hero
  - Collection
  - About Page
  - Values
  - Contact/Footer
- Kept the existing `site_settings.site_content` data shape unchanged.
- Moved the home page about summary into the Home Hero tab.
- Added editable Contact/Footer settings for email, display phone, WhatsApp number, hours, and address lines.
- Contact details now save to `site_settings.contact_details`.
- The contact page, quote page WhatsApp target, and footer now load contact details from Supabase with safe defaults.

### Submissions inbox

- Added Supabase submission helpers for contact messages and quote requests.
- Contact and quote forms now attempt to save submissions before opening WhatsApp.
- Added `/admin/submissions` Requests inbox with contact/quote filtering.
- Added request status tracking in admin: `New`, `Contacted`, `Quoted`, `Closed`.
- Added SQL setup file:
  - `docs/supabase-submissions-schema.sql`

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
