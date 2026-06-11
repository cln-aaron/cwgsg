# CWG Innovation — Website

Marketing site for CWG Innovation. Static, multi-page, no build step.

The look is dark and modern with a red-to-purple fire theme: a deep background,
warm gradient accents, a flame mark, and a quiet ember animation in the
background. The aim is cutting-edge but clean and easy to read.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — positioning, pillars, a solutions teaser, headline figures |
| `platform.html` | How the product works: connect, set rules, build; routing and trust |
| `solutions.html` | Where teams put it to work, plus how engagements start |
| `about.html` | The company, its story and how it works |
| `contact.html` | Contact form and what to expect after getting in touch |

Shared assets:

```
styles.css   design system, theme tokens, layout, responsive rules
script.js    background embers, scroll reveals, counters, nav, form
```

## Palette

- Red `#ff2d55`, deep red `#e11d48`
- Purple `#a855f7`, deep purple `#7c3aed`
- Ember orange `#ff6b35`, magenta `#d946ef`
- Background `#0b0510`
- Type: Sora (headings), Inter (body)

## Running locally

No tooling required. Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Notes

- Respects `prefers-reduced-motion`: the ember canvas and animations switch off.
- The ember canvas pauses on hidden tabs and caps particle count by screen size.
- The contact form validates and confirms in the page only. Connect the submit
  handler in `script.js` to your email or CRM endpoint to make it live.
