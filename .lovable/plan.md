## Structured Data (JSON-LD) Implementation Plan

I will implement and validate comprehensive JSON-LD structured data for Organization, LocalBusiness, and Service across all key pages to ensure maximum visibility in Google Rich Results.

### 1. Centralize Schema Utilities
- Create a new utility `src/lib/schema.ts` to generate consistent JSON-LD payloads.
- Define a master `ORG_SCHEMA` and `LOCAL_BUSINESS_SCHEMA` that other page-specific schemas (Service, FAQ) will reference via `@id` for proper semantic linking.

### 2. Global Schema Updates (`src/routes/__root.tsx`)
- Enhance the global `LocalBusiness` and `Organization` schemas.
- Add `contactPoint`, `sameAs` (social links), and `openingHoursSpecification`.
- Ensure proper use of `@id` (e.g., `https://sidingdepot.com/#localbusiness`) to allow page-specific services to point back to the business.

### 3. Service Page Enhancements
Update all service routes to include robust `Service` schema using the new utility:
- **Routes:** `siding.tsx`, `painting.tsx`, `windows.tsx`, `doors.tsx`, `gutters.tsx`, `roofing.tsx`, `dumpster-rental.tsx`.
- **Schema Details:** Include `provider`, `areaServed`, `description`, `name`, and where applicable, `brand` (e.g., James Hardie for siding).
- **ServiceLandingPage Component:** Update the `serviceJsonLd` helper in `src/components/site/ServiceLandingPage.tsx` to utilize the new centralized utility.

### 4. Regional Landing Page Enhancements (`src/components/site/SidingLP.tsx`)
- Update `lpHead` to include more detailed `LocalBusiness` and `Service` schema tailored to the specific city (e.g., "James Hardie Siding in Alpharetta").
- Ensure `FAQPage` schema is correctly populated with both regional and general FAQs.

### 5. Validation & Compatibility
- Audit all generated JSON-LD against Schema.org and Google Search Central requirements.
- Ensure all scripts use `type="application/ld+json"`.
- Confirm that images, phone numbers, and addresses are consistently formatted (e.g., E.164 for telephone).

### Technical Details
- **Provider Linking:** Every `Service` schema will include `"provider": { "@id": "https://sidingdepot.com/#localbusiness" }`.
- **Area Served:** Will be populated from the `CITIES` array in `src/data/site.ts`.
- **Logo/Images:** Absolute URLs will be used for all image references to ensure Google can crawl them correctly.
