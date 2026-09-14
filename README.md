# EduVerse

**One platform, full package.**

A digital learning platform for P1–S6 General Education students in Rwanda, combining books, practice Q&A, and self-testing quizzes into one place.

## Status: Phase 1 — Landing Page

This is the first piece of the EduVerse MVP: a static landing page with no build step required. Plain HTML, CSS, and JavaScript — open `index.html` in any browser to preview it locally, no installs needed.

## Structure

```
eduverse-web/
├── index.html      → the landing page
├── styles.css      → all styling (brand colors and type are defined at the top as CSS variables)
├── script.js       → mobile menu + placeholder login/register handlers
├── assets/
│   ├── logo.svg
│   └── favicon.svg
└── README.md
```

## Roadmap

- [x] Phase 1 — Landing page
- [ ] Phase 2 — Registration & login (Supabase Auth)
- [ ] Phase 3 — Books & Q&A modules (Supabase database)
- [ ] Phase 4 — Quiz & Challenge engine
- [ ] Phase 5 — Subscriptions & payment review
- [ ] Phase 6 — Admin dashboard
- [ ] Phase 7 — Pilot with real students
- [ ] Phase 8 — AI features

## Deployment

This site is hosted for free on GitHub Pages. Any push to the `main` branch updates the live site automatically once Pages is enabled (Settings → Pages → Source: `main` branch, `/root`).

## Brand

| Token | Value |
|---|---|
| Primary green | `#3F5420` |
| Deep green (hover) | `#2C3B16` |
| Ink | `#000000` |
| Background | `#F7F8F5` |
| Gold (rewards) | `#B8892B` |
| Display font | Fraunces |
| Body font | Work Sans |
