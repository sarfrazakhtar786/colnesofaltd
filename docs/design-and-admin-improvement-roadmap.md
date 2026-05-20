# Design and Admin Improvement Roadmap

## Goal

Turn Colne Sofa LTD into a stronger premium furniture website with a practical admin panel that supports real day-to-day product and content management.

The design direction should stay premium, clean, and conversion-focused: navy, gold, ivory, strong product imagery, clear calls to action, and simple editing workflows.

## Phase 1 - Admin Dashboard Foundations

### Dashboard improvements

- Replace hardcoded dashboard numbers with live Supabase counts.
- Show real total products from the `sofas` table.
- Show editable content status from `site_settings`.
- Add quick action links:
  - Add new product
  - Edit site content
  - View live website
- Add a small "recent products" section.
- Add warnings for products missing images, dimensions, or descriptions.

### Why this comes first

The admin panel is used repeatedly. Making it useful first will make future content and product updates faster and less error-prone.

## Phase 2 - Product Management

### Product list improvements

- Add search by product name, slug, category, and material.
- Add category filter.
- Add better table actions:
  - Edit
  - View live product
  - Delete with confirmation
- Add missing data indicators:
  - No image
  - No price
  - No dimensions
  - No materials

### Product form improvements

- Keep image URL preview.
- Add recommended product image size: `1600 x 1200 px`.
- Add form sections:
  - Basic info
  - Image
  - Description
  - Dimensions
  - Materials
- Add validation messages instead of browser/default alerts.

## Phase 3 - Image Upload System

### Supabase Storage

- Add Supabase Storage bucket for product and content images.
- Replace manual image URL paste with image upload.
- On upload:
  - Show preview immediately.
  - Save public URL automatically.
  - Allow replacing existing image.

### Recommended image sizes

- Hero images: `2400 x 1350 px`, landscape `16:9`.
- Product images: `1600 x 1200 px`, landscape or square-safe.
- About/content images: `1600 x 1200 px`.
- Navbar logo: transparent PNG or SVG, horizontal format.

### Why this matters

Manual URL entry is fragile. Uploading directly from the admin panel will reduce broken images and make the system easier for non-technical users.

## Phase 4 - Content Editor Redesign

### Current problem

The content editor can become too long and hard to scan as more editable website sections are added.

### Proposed structure

Use tabs or grouped panels:

- Home Hero
- Collection Page
- About Page
- Contact/Footer
- Brand Settings

### Home Hero editor

- Hero title
- Hero subtitle
- Hero image upload/URL
- Image preview
- Recommended size hint: `2400 x 1350 px`
- CTA button text and link

### Brand/contact editor

Move shared static contact details into admin later:

- Email
- Phone
- Address
- Footer note
- Social links

## Phase 5 - Frontend Conversion Improvements

### Homepage

- Add trust points below hero:
  - Made in UK
  - Custom sizes
  - Premium materials
- Keep two clear CTAs:
  - Request a Quote
  - View Collection
- Improve visual hierarchy so product imagery and CTA stay above the fold.

### Product cards

- Use consistent image ratios.
- Add hover state with subtle gold border/shadow.
- Show:
  - Product name
  - Category
  - Short size/material hint
  - View Details action

### Product detail page

- Add gallery structure, even if only one image is available now.
- Split content into clear sections:
  - Overview
  - Dimensions
  - Materials
  - Delivery
- Add sticky quote CTA on desktop/mobile.

### Footer

- Use the logo image instead of text-only logo.
- Keep phone, email, and address as clickable links.
- Add social icons if accounts are available.
- Keep "Based in the UK" positioning.

## Phase 6 - Forms and Submissions

### Contact form

- Save submissions to Supabase.
- Optional: send email notification.
- Add success and error states.
- Add basic spam protection later if needed.

### Quote form

- Save quote requests to Supabase.
- Add admin page to view quote requests.
- Track status:
  - New
  - Contacted
  - Quoted
  - Closed

### Why this matters

The quote form is a business-critical conversion point. It should not only show a success message; it should save the customer request somewhere reliable.

## Phase 7 - Admin Security

### Current state

The admin area is protected by Supabase Auth, but any authenticated user can access admin pages.

### Recommended upgrade

- Add an `admin_users` table or role-based access control.
- Only allow listed admin emails/user IDs.
- Keep Row Level Security enabled.
- Restrict insert/update/delete policies to admin users.

### Suggested table

```sql
create table public.admin_users (
  user_id uuid primary key references auth.users(id),
  email text not null,
  created_at timestamptz not null default now()
);
```

## Suggested Build Order

1. Make dashboard stats real from Supabase.
2. Add product search/filter and better product actions.
3. Add Supabase Storage image upload.
4. Redesign admin content editor into clear sections/tabs.
5. Save contact and quote form submissions.
6. Improve frontend product cards and product detail pages.
7. Add stricter admin authorization.

## Notes

- Always test local build with `npm.cmd run build`.
- Use the production alias for latest live changes:
  - `https://colnesofaltd-pizzaalif.vercel.app`
- Avoid checking old immutable Vercel deployment URLs because they do not update after new commits.
