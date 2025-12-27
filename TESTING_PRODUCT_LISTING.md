# Testing Product Listing Component

## Quick Start

1. **Start Development Server**

   ```bash
   npm run dev
   ```

2. **Open Products Page**

   - Navigate to: `http://localhost:3000/products`

3. **Open Browser DevTools**
   - Press `F12` or `Ctrl+Shift+I`
   - Switch to **Console** tab for logs
   - Switch to **Network** tab for API calls

---

## Test Checklist

### ✅ 1. Initial Load & API Integration

**What to verify:**

- [ ] Page loads without errors
- [ ] 8 shimmer cards appear briefly during loading
- [ ] 8 products display after loading completes
- [ ] Products have images, titles, prices, badges, and ratings

**Console logs to check:**

```
🚀 Component mounted
📄 Fetching page 1 with filters: {"category":"all","priceRange":"all"}
✅ Received 8 products from page 1
```

**Network tab:**

- [ ] Request to `https://dummyjson.com/products?limit=8&skip=0`
- [ ] Status: `200 OK`
- [ ] Response contains product data

---

### ✅ 2. Lazy Loading (Load More Button)

**Steps:**

1. Scroll to bottom of page
2. Click **"Load More Products"** button
3. Watch shimmer animation appear
4. Verify 8 more products load

**What to verify:**

- [ ] "Load More" button is visible after initial load
- [ ] Shimmer animation shows during loading
- [ ] New products append to existing ones (not replace)
- [ ] Page count increments (Page 1 → Page 2)

**Console logs:**

```
📄 Fetching page 2 with filters: {"category":"all","priceRange":"all"}
✅ Received 8 products from page 2
```

**Network tab:**

- [ ] Request to `https://dummyjoin.com/products?limit=8&skip=8`

---

### ✅ 3. Promo Block Injection

**Steps:**

1. Load first page (8 products)
2. Click "Load More" (16 products total)
3. Scroll through products

**What to verify:**

- [ ] After 16 products, a **promo banner** appears
- [ ] Banner has "Special Offer" tag
- [ ] Banner spans 2 columns on desktop
- [ ] Banner background is gradient (purple/pink)
- [ ] "Shop Now" button is visible

**Visual check:**

- Promo block should appear after every 16 products
- On desktop: spans 2 grid columns
- On mobile: full width

---

### ✅ 4. Responsive Grid Layout

**Desktop (≥1280px):**

1. Browser window full width
2. **Expected:** 4 columns per row
3. Promo blocks span 2 columns

**Tablet (768px - 1279px):**

1. Resize browser to ~1000px width
2. **Expected:** 3 columns per row
3. Promo blocks span 2 columns

**Mobile Portrait (480px - 767px):**

1. Resize browser to ~600px width
2. **Expected:** 2 columns per row
3. Promo blocks span 2 columns

**Mobile Small (<480px):**

1. Resize browser to ~375px width
2. **Expected:** 1 column (stacked)
3. Promo blocks full width

**How to test:**

- Open DevTools → Toggle device toolbar (Ctrl+Shift+M)
- Select different devices (iPhone, iPad, Desktop)
- Verify layout adjusts correctly

---

### ✅ 5. Next.js Image Optimization

**Network tab inspection:**

1. Clear network log (trash icon)
2. Reload products page
3. Filter by `Img` type

**What to verify:**

- [ ] Images load as WebP or AVIF format (not PNG/JPG)
- [ ] Image URLs contain `_next/image?url=...`
- [ ] Images are lazy-loaded (load as you scroll)
- [ ] No `<img>` warnings in console

**Check image response headers:**

- Content-Type: `image/webp` or `image/avif`
- Properly sized (not loading 4000x4000 for 300px display)

---

### ✅ 6. Shimmer Loading Animation

**Steps:**

1. Open Network tab
2. Throttle network to "Slow 3G" (DevTools → Network → Throttling)
3. Click "Load More Products"

**What to verify:**

- [ ] 8 shimmer cards appear immediately
- [ ] Shimmer animation is smooth (pulsing effect)
- [ ] Shimmer cards have same layout as product cards
- [ ] Shimmer disappears when products load

**Visual check:**

- Shimmer should be a smooth gradient animation
- No layout shift when shimmer → real products

---

### ✅ 7. Error Handling & Retry

**Simulate API failure:**

**Option A: Network Offline**

1. Open DevTools → Network tab
2. Select "Offline" from throttling dropdown
3. Click "Load More Products"
4. **Expected:** Error message displays
5. Re-enable network
6. Click "Retry" button
7. **Expected:** Products load successfully

**Option B: Console simulation**

```javascript
// In browser console, temporarily break API:
fetch = () => Promise.reject(new Error('Network error'));
```

**What to verify:**

- [ ] Error message appears with retry button
- [ ] Console shows error logs
- [ ] Retry button makes new API request
- [ ] Service retries 3 times before giving up

**Console logs:**

```
⚠️ Retry attempt 1/3 for products...
⚠️ Retry attempt 2/3 for products...
❌ Failed to fetch products after 3 attempts
```

---

### ✅ 8. Product Card Features

**Check each product card has:**

- [ ] **Image:** Thumbnail at top
- [ ] **Title:** Product name below image
- [ ] **Price:** Formatted with `$` symbol
- [ ] **Stock Status:** Badge showing "In Stock" or "Low Stock"
- [ ] **Rating:** Stars (⭐) and rating number (e.g., "4.5")
- [ ] **Discount Badge:** If discounted (e.g., "15% OFF")
- [ ] **"View Details" button:** Clickable

**Hover effects:**

- [ ] Card shadow increases on hover
- [ ] Image scales slightly (zoom effect)
- [ ] Button changes color

---

### ✅ 9. Performance Checks

**Lighthouse audit:**

1. Open DevTools → Lighthouse tab
2. Select "Desktop" mode
3. Check "Performance" category
4. Click "Analyze page load"

**Target scores:**

- [ ] Performance: ≥90
- [ ] Accessibility: ≥90
- [ ] Best Practices: ≥90

**Manual checks:**

- [ ] No console errors or warnings
- [ ] No memory leaks (load/unload page multiple times)
- [ ] Smooth scrolling (no jank)
- [ ] Fast initial load (<3 seconds)

---

### ✅ 10. Edge Cases

**Test "No More Products" state:**

1. Click "Load More" repeatedly (100 products available)
2. **Expected:** After 100 products, button shows "You've viewed all products"
3. Button becomes disabled (gray, no hover effect)

**Test empty filters (if implemented later):**

- Apply filter with no results
- **Expected:** Empty state message

**Test rapid clicking:**

1. Click "Load More" button 5 times quickly
2. **Expected:** Only one API request per click
3. Button disabled during loading
4. No duplicate products

---

## Common Issues & Solutions

### Issue: No products loading

**Check:**

1. Is dev server running? (`npm run dev`)
2. Console errors? Check import paths
3. Network tab: API request failing? Check CORS/network
4. DummyJSON API down? Try: `https://dummyjson.com/products` in browser

**Solution:**

```bash
# Restart dev server
Ctrl+C
npm run dev
```

---

### Issue: Images not loading

**Check:**

1. Network tab: 404 errors for images?
2. Console: Next.js Image warnings?
3. Image URLs from DummyJSON API valid?

**Solution:**

- Images from DummyJSON use external URLs (cdn.dummyjson.com)
- May need to add to `next.config.ts`:

```typescript
images: {
  domains: ['cdn.dummyjson.com'],
}
```

---

### Issue: Styles not applied

**Check:**

1. CSS file imported? (`import './product-listing.css'`)
2. LESS compiled? Run: `npm run watch:less`
3. Hard refresh: `Ctrl+Shift+R`

**Solution:**

```bash
# Recompile LESS files
npm run watch:less

# Or compile once
npm run build:less
```

---

### Issue: Shimmer animation not smooth

**Check:**

1. Browser GPU acceleration enabled?
2. Too many products on page? (>50)
3. Low-end device?

**Solution:**

- Use `will-change: opacity` in CSS (already included)
- Reduce products per page in `productService.ts`:

```typescript
ITEMS_PER_PAGE: 6; // Instead of 8
```

---

## Testing in Different Browsers

### Chrome/Edge (Recommended)

- ✅ Best DevTools support
- ✅ Full Next.js Image support
- ✅ WebP/AVIF support

### Firefox

- ✅ Good DevTools
- ✅ WebP support
- ⚠️ AVIF support varies

### Safari

- ⚠️ Limited DevTools
- ✅ WebP support (iOS 14+)
- ❌ No AVIF support (fallback to WebP)

---

## Production Testing

Before deploying to production:

1. **Build the app:**

   ```bash
   npm run build
   npm start
   ```

2. **Test production build:**

   - Navigate to `http://localhost:3000/products`
   - Verify all features work in production mode
   - Check bundle size in `.next/` folder

3. **Lighthouse audit (production):**
   - Target: ≥95 performance score
   - Check bundle size optimizations
   - Verify code splitting working

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Compile LESS → CSS
npm run build:less

# Watch LESS files
npm run watch:less

# Run linter
npm run lint
```

---

## Success Criteria

Your product listing component is working correctly when:

✅ All 10 test sections pass
✅ No console errors or warnings
✅ API calls successful (200 status)
✅ Images load and optimize correctly
✅ Responsive on all screen sizes
✅ Smooth animations and interactions
✅ Error handling works (offline test)
✅ Lighthouse score ≥90
✅ No memory leaks or performance issues
✅ Production build works correctly

---

## Next Steps After Testing

Once testing is complete:

1. **Fix any issues found**
2. **Add unit tests** (Jest + React Testing Library)
3. **Add E2E tests** (Playwright/Cypress)
4. **Implement filters** (category, price range)
5. **Add search functionality**
6. **Implement cart integration** (Add to Cart button)
7. **Add product detail page** (View Details button)

---

## Need Help?

If you encounter issues:

1. Check console for error messages
2. Verify Network tab shows API requests
3. Clear browser cache: `Ctrl+Shift+Delete`
4. Restart dev server
5. Check this testing guide for common issues

Good luck with testing! 🚀
