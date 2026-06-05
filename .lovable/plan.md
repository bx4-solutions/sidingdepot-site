I will adjust the Hero section for the Roofing and Decks pages to improve the mobile layout and apply the new design to the Decks page.

### Changes

#### 1. ServiceLandingPage Component
- Optimize the `heroImageSide` layout for mobile devices.
- Ensure that on mobile, the content stacks as: Title -> Intro -> CTA Button -> Image.
- Reduce vertical padding and gaps on mobile to ensure the button remains "logo abaixo do texto" (just below the text) and the image follows naturally.

#### 2. Decks Page
- Update `src/routes/decks.tsx` to use the `heroImageSide` layout pattern.
- Replace the current background image with the new image provided by the user.
- Upload the new deck hero image as an asset.

#### 3. Roofing Page
- The Roofing page already uses `heroImageSide`, so it will automatically benefit from the mobile layout improvements in the shared component.

### Technical Details
- In `ServiceLandingPage.tsx`, I'll adjust the `grid` gap on mobile (currently `gap-10`) to something smaller like `gap-6` or `gap-8` for the mobile breakpoint.
- I'll ensure the `ServiceFormModal` (button) is positioned correctly within the stacking order.
- I'll use `curl` to fetch the new image from the provided Supabase storage link and save it as `src/assets/decks-hero.png.asset.json`.

```tsx
// Proposed change in ServiceLandingPage.tsx
<div className="grid gap-6 lg:gap-10 lg:grid-cols-2 lg:items-center">
  {/* ... text and button ... */}
  {/* ... image ... */}
</div>
```

The user provided this link for the Decks image:
`https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1780623823935-99b5e5cd-4d4b-4eab-baf2-5d3bbe219321.png`
