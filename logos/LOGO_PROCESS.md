# Vantix Logo Creation Process

## Step 1: Generate Concepts (AI Image Gen)

### Gemini Prompts (copy-paste these)

**Core concept:**
```
Professional minimal logo design, letter V constructed from two wooden 2x4 lumber planks nailed together with a single Phillips head screw at the bottom joint, realistic birch wood grain texture, metallic nail detail, white background, clean vector style, no text, no other elements
```

**Variations to try:**
```
Flat design logo, letter V made from two crossed wooden planks held by a rusty iron nail, wood grain visible, slight 3D depth and shadow, white background, minimal, professional brand mark, no text
```

```
Modern tech company logo mark, V shape formed by two wooden boards fastened with a metal bolt, blend of organic wood and industrial metal, clean white background, suitable for app icon, no text
```

```
Isometric 3D logo, wooden V shape built from two lumber planks with visible wood grain, connected by a prominent nail at the base, soft shadow on white background, premium brand aesthetic, no text
```

```
Logo icon, two angled wooden beams forming a V, joined at bottom with a large decorative nail head, mix of craftsmanship and technology, birch wood color, white background, scalable vector style, no text
```

### Midjourney Prompts (if you sign up - $10/mo)
```
/imagine minimal logo design, letter V made from two wooden 2x4 planks with nail holding them together, wood grain texture, white background, vector, clean --style raw --ar 1:1 --v 6
```

### DALL-E / Bing Image Creator (free)
Go to bing.com/images/create and paste:
```
A professional logo of the letter V made from two realistic wooden 2x4 lumber planks held together by a single nail at the bottom, white background, minimal design, no text
```

## Step 2: Pick Top 3-5

Save your favorites to `projects/vantix/logos/concepts/`

## Step 3: Clean Up in Canva

1. Go to canva.com (free account)
2. Create new design → Custom 1024x1024
3. Upload your best AI-generated concept
4. Use Background Remover if needed
5. Trace over it with Canva shapes for cleaner edges
6. Export as PNG (transparent bg) + SVG

## Step 4: Vectorize

If you want a perfect SVG from a PNG:
- vectorizer.ai (free, best quality)
- Or use Figma: Import PNG → Auto-trace

## Step 5: Create All Sizes

Once final logo is chosen, we need:
- `logo-full.svg` — full vector (website header)
- `logo-icon.svg` — just the V mark (favicon, app icon)
- `logo-dark.svg` — inverted for dark backgrounds
- `favicon.ico` — 32x32 and 16x16
- `pwa-192x192.png` — PWA icon
- `pwa-512x512.png` — PWA splash
- `og-logo.png` — 1200x630 for link previews
- `apple-touch-icon.png` — 180x180

I can generate all these sizes automatically once you pick the final design.

## Color Reference
- Wood: #C8974F / #D4A258
- Accent: #B8895A  
- Text: #2D2A26
- Background: #FAFAFA
