---
name: home-guide
description: Build and update the house onboarding guide for people staying at the user's apartment for the first time (yonatan-ilani/mookie-guide, folder home/) — getting in, the apartment, house rules, the neighborhood, and the secret part (Wi-Fi password, door codes, the photo of where the keys are hidden) that opens only from a private link. Use when the user wants to create or edit the house guide, add a guest's name, change the Wi-Fi password or keys photo, or needs a fresh guest link.
---

# House guide (onboarding for first-time guests)

A page for someone staying at the user's apartment for the first time. It lives in
`home/index.html` of `yonatan-ilani/mookie-guide` and is public at
`https://yonatan-ilani.github.io/mookie-guide/home/` — but its secrets are not.

Read the repo's `CLAUDE.md` first (layout, shared style, publishing rules).

## How the secrets stay secret

- Everything sensitive — Wi-Fi name and password, building/door codes, the photo of where the
  keys are hidden — is encrypted into `home/secrets.enc` (AES-256-GCM).
- The key is **only** in the link's fragment: `.../home/#k=<key>`. Browsers never send the
  fragment to a server, and the repo never holds the key. `shared/secrets.js` decrypts in the
  browser and fills the 🔒 block. Without the key the block says to ask for the full link.
- The inputs live in a private JSON file **outside the repo** (`.gitignore` blocks
  `*secrets*.json` as a backstop):

  ```json
  {
    "items":  [{"icon": "📶", "label": "רשת", "value": "<ssid>"},
               {"icon": "🔑", "label": "סיסמה", "value": "<password>", "copy": true},
               {"icon": "🚪", "label": "קוד לבניין", "value": "<code>", "copy": true}],
    "images": [{"caption": "איפה המפתח מחכה לכם", "path": "/path/to/keys.jpg"}]
  }
  ```
  Write it in the session scratchpad (never in the repo), from what the user sends.
  `copy: true` adds a copy button. `"tel": "9725XXXXXXXX"` (international, no `+`) adds call and WhatsApp buttons, also in the footer `#contact` slot. Write `value` in local format (`050-...`). Photos are resized and stripped of EXIF/GPS by the script.
- Encrypt and get the link:
  ```bash
  scripts/encrypt-secrets.py home <scratchpad>/home-secrets.json              # new key
  scripts/encrypt-secrets.py home <scratchpad>/home-secrets.json --key <key>  # keep links
  ```
  A **new key** invalidates every link already sent — use it after a guest leaves, or when
  rotating the Wi-Fi password. Reuse the current key (`--key`) to just update content. If the
  user doesn't have the current key, a new one is the only option; say so.
- Never print the password, codes or key into a commit message, file, PR, or anywhere but
  your reply to the user. Delete the private JSON from the scratchpad when done.
- The guide's address: the page may say how to reach the door, but the street address goes
  in the secrets (or the user sends it by message) — never in plain page text.

## Building or editing the page

1. Ask for what's missing, one short batch at a time. The page's `[למלא]` placeholders
   (cards with class `todo`) mark what's still unknown:
   - Getting in: building entrance, floor, which door, lock quirks.
   - Secrets: Wi-Fi name + password, door/building codes, keys photo and where it is.
   - The apartment: AC, shower/boiler (דוד), kitchen + coffee, trash and recycling, bedding
     and towels, TV, anything that breaks easily.
   - House requests (shoes, smoking, noise, plants, pets).
   - Neighborhood tips: supermarket, coffee, food, beach/park.
   - Contact: how to reach the user when something breaks.
   - Before leaving: lights, AC, windows, door, where the keys go back.
2. Replace a placeholder with real content and drop its `todo` class. Remove sections the
   user doesn't want. Never invent facts about the apartment.
3. Style: like the Mookie guide — short Hebrew lines, warm and a bit cheeky, emojis, `pill`
   spans for key numbers. Keep it short; long instructions go behind a link.
4. Optional guest name: set `<meta name="guest-names" content="...">`. For several guests at
   once, copy the page per guest the way `mookie/build-pages.sh` does, rather than editing by
   hand.

## Check before you push

1. Encrypt a **test** secrets file (fake values, a generated image) into `home/secrets.enc`,
   serve the repo with `python3 -m http.server` (fetch doesn't work from `file://`), and in
   Playwright Chromium at 390px check: with the key the items and photo appear; without it
   the locked note shows; a wrong key shows the "link is old" note; `scrollWidth == 390`; no
   page errors. Then re-run the script with the real secrets (or delete the test file).
2. Make sure no plaintext secret is in `git diff --cached`:
   `git diff --cached | grep -iF '<password>'` must print nothing.
3. Push to `main`, poll `https://yonatan-ilani.github.io/mookie-guide/home/` and
   `.../home/secrets.enc` until both return 200, then give the user the full `#k=` link.
   Remind them: anyone with the link sees the secrets, so send it privately.
