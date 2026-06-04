I will refactor the forms to use `react-hook-form` and `zod`, centralize lead submissions, optimize images for performance, and modernize the UI.

### 1. Form Refactoring & Centralization
- **Created `src/lib/leads.ts`**: A centralized utility to handle lead submissions to both Supabase and the GHL webhook.
- **Created `src/hooks/use-lead-form.ts`**: A custom hook combining `react-hook-form` with the centralized submission logic.
- **Refactor `HeroQuoteForm`**: Update to use `useLeadForm`, improving validation and reducing code duplication.
- **Refactor `SimpleLeadForm`**: Update to use `useLeadForm`.

### 2. Asset & Performance Optimization
- **Image Audit**: Update `Navbar`, `Footer`, and `HeroSection` to include explicit `width` and `height` on images to prevent Layout Shift (CLS).
- **Format**: Ensure all local assets are used via their `.asset.json` pointers which provide optimized CDN URLs.

### 3. UI/UX Modernization
- **Navbar**: Add glassmorphism effects and smoother hover transitions.
- **HeroSection**: Modernize typography and add subtle entrance animations.
- **Forms**: Enhance input focus states, button hover effects, and validation feedback.
- **Accessibility**: Ensure all interactive elements have proper ARIA labels and contrast.

### 4. Security Audit
- **RLS Check**: Verified that `leads` and `ab_events` are `INSERT-only` for public access. No sensitive tables are exposed for unauthenticated writing.

### Technical Details
- Using `react-hook-form` for better performance and form state management.
- Using `zod` for robust schema validation.
- Implementing `shadcn/ui` components for a consistent design system.
