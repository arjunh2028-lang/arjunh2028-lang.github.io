Changelog - recent production hardening and accessibility fixes

2025-12-14

- Removed legacy/unused login code and references across the site (GSI and demo server removed earlier).
- Replaced all <u> markup with `.brand` CSS heading styling and applied in all pages.
- Moved `index.js` <script> into `<head>` with `defer` on all pages.
- Form improvements (`form.html`):
  - Normalized `name` attributes to snake_case (`full_name`, `prn_no`, `campus`, `year`, `branch`, `applying_as`, `video_submission`).
  - Converted "Applying as" checkboxes to a radio group and made it required.
  - Added `aria-required`, `aria-describedby` and accessible success message element.
  - Set `action="#"` and `novalidate` so the site is safe with client-side only flow.
- `index.js` refactor:
  - Modularized form validation and lightbox into named init functions.
  - Replaced `alert()` success with an accessible in-page `.form-success` message.
  - Improved lightbox accessibility: ARIA, Tab-trap, ESC handling, focus restore.
  - Added `configureHeroCTA()` to consolidate hero CTA behavior.
- `index.css` tidy:
  - Removed unused `.button` and `.theme-toggle` styles.
  - Added visible focus outlines for interactive elements and skip-link styles.
  - Retained `.brand` and `.form-success` styles for heading and success UI.
- Accessibility enhancements:
  - Added `role="dialog" aria-modal="true" aria-labelledby` to lightbox containers.
  - Added skip-to-main links on all pages and an accessible focus style.
  - Added ARIA attributes to required inputs and better error focus behavior.
 - Manual polish (content & SEO):
   - Improved many image `alt` attributes and figcaptions for clarity (gallery & about pages).
   - Fixed typo in `about.html` figcaption: "treasrer" → "Treasurer".
   - Added `meta description` and `theme-color` to `index.html`, `form.html`, `about.html`, and `gallery.html`.
   - Added `rel="noopener noreferrer"` to external `target="_blank"` social links for security.

Notes and next steps:
- No server-side submission is configured; if production form handling is required, add a secure server endpoint and server-side validation.
- Consider running an automated aXe or Lighthouse accessibility scan and a W3C HTML validation as next steps.
- Manual QA: test keyboard behavior for the lightbox, and run color contrast checks for key UI elements.

If you'd like, I can now run an automated aXe audit (if you want me to add a small npm dev-dependency and a test script) or produce a short checklist for manual testing on mobile/desktop.
