# Easy guides

Small, friendly one-page guides in Hebrew, published with GitHub Pages at
`https://yonatan-ilani.github.io/mookie-guide/<guide>/`. The repo and the site are public.

## Layout

| Path | What |
| --- | --- |
| `mookie/` | Dog-sitter guide for Mookie. Skill: `mookie-guide`. |
| `home/` | House onboarding for first-time guests. Skill: `home-guide`. |
| `shared/guide.css` | The shared look (RTL, sticker style, cards, checklists, copy buttons). |
| `shared/secrets.js` | Decrypts a guide's `secrets.enc` with the `#k=` key from the link. |
| `scripts/encrypt-secrets.py` | Encrypts a private JSON + photos into `<guide>/secrets.enc`. |
| `index.html`, `lior.html`, `noa-yuval.html` | Redirect stubs for links shared before the move to `mookie/`. Keep them. |

## A new guide

Make a folder with an `index.html` that links `../shared/guide.css`, reuse the existing
classes (`hero`, `quickbar`, `sec-title`, `card`, `mini`, `twocol`, `wifi`, `exit`, `pill`),
and add a skill in `.claude/skills/<guide>/`. Anything secret goes through
`scripts/encrypt-secrets.py` and the `#secrets` block, never into plain page text.

## Rules

- Commit straight to `main`; the user approved this.
- Never commit plaintext passwords, codes, keys, or someone's street address. Private inputs
  stay outside the repo (`.gitignore` blocks `*secrets*.json` as a backstop).
- Strip EXIF/GPS from every photo before committing it.
- Before pushing: render the changed page in Playwright Chromium at 390px (no page errors,
  no horizontal scroll), then poll the live URL until it shows the change.
