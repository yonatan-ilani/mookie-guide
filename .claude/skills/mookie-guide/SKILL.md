---
name: mookie-guide
description: Everything for Mookie's dog-sitter guide site (yonatan-ilani/mookie-guide) — editing the guide's content, creating or updating a sitter's page, the Gemini prompt for a sitter's thank-you poster and adding the finished poster, and the Higgsfield/Seedance prompt for a funny talking-Mookie video for a sitter. Use when the user wants to change what the guide says, names a new sitter or gives sitter details (names, address, photo), asks for "the Gemini prompt" / a poster / "a funny picture of Mookie with <sitter>", sends a finished poster, or wants a video prompt for a sitter.
---

# Mookie's sitter guide

Mookie is the user's dog. When he stays with a friend, the friend gets a personal page with
everything they need. Mookie stays **at the sitter's home**, so anything written for a
sitter must fit their home and area.

## 0. Facts

- Repo: `yonatan-ilani/mookie-guide` (public). Commit straight to `main`; the user approved
  this workflow.
- The repo holds several guides, one folder each (see the repo's `CLAUDE.md`). This guide
  lives in `mookie/`; its look comes from `shared/guide.css`, shared with the other guides.
- Live site (GitHub Pages, about a minute after a push):
  `https://yonatan-ilani.github.io/mookie-guide/mookie/<slug>.html`. `mookie/index.html` is
  the generic page. The old root links (`/lior.html`, `/noa-yuval.html`, `/`) are redirect
  stubs — keep them, Lior's link was already shared.
- `mookie/assets/`: `poster-template.jpg` (the Max & Nery poster) and `<slug>-poster.jpg`.
- Pages are plain HTML/CSS/JS in Hebrew (RTL), no build tools.
- Never commit a sitter's street address into the repo (prompts given to the user may contain
  it; the repo may not). Photos and posters are fine — the user approved them.

## 1. Editing the guide's content

Edit **only `mookie/index.html`**, then run `mookie/build-pages.sh`. It rebuilds every sitter page
from `mookie/index.html` and fails if a page differs in more than its two meta lines. Never edit
`<slug>.html` by hand.

Write like the existing page: short Hebrew lines, warm and a bit cheeky, emojis, `pill`
spans for the key numbers. Keep the page short — technical detail goes behind a link, not
on the page.

What the guide says now (the user's decisions — keep them unless the user changes them):

- **No crate.** "למקום" sends him to **his bed**. He may be sent there with people home.
- **Home alone:** up to **8 hours**; better after a walk. Leave water, fan/AC, a Kong or lick
  mat, the bark collar. Nothing edible or chewable in reach.
- **Night:** holds 10-11 hours.
- **Walks:** minimum 30 min, 1 hour recommended, "the maximum is infinity". Walk with **two
  collars** (prong + regular): switch the leash to the regular one to let him play with dogs.
  The prong collar is strongly recommended because otherwise he pulls — but it's their choice.
- **No time for a walk:** short pee/poop round, then peanut butter or cottage cheese on the
  **green lick mat**, or food in the **red Kong** ("looks a bit like נחום תקום").
- **Beach:** dry him well before going home; his towel comes with him.
- **Anti-bark collar (BP-504):** general rules only — **only at home**, never outside/on walks
  (it's fine while people are home); max **10 hours/day** (pressure sores); two-finger fit;
  check the skin, remove on redness or a sore; remove and call the trainer if he's in
  distress; don't change its settings. Everything technical (on/off, charging, fitting) is
  **links only**: Hebrew guide `https://files.instinct.com/vpcfxg9vuc7g-bp-504?via=wa`,
  fitting video `https://www.youtube.com/watch?v=1cl3V8vYobM`, product video
  `https://www.youtube.com/watch?v=LXTctvZsxC8`.
- **Meeting dogs — recommended phrases:** "איך הוא/היא עם גורים?"; when a dog tries to
  mount him: "אם הוא חודר אליו, אני חודר אלייך."; "הוא מעדיף לשחק רק עם כלבים שעלו מעל 8K."
- **Equipment that comes with him:** leashes, prong + regular collar, pouch with food and
  poop bags, his towel, red Kong, green lick mat, bark collar.
- Vet and trainer contacts are on the page; don't change them unless asked.

### Check before you push

1. `mookie/build-pages.sh` passes.
2. Render a sitter page in headless Chromium at 390px width (Playwright is preinstalled;
   import it from `$(npm root -g)/playwright/index.mjs`). Add class `in` to every `.reveal`
   before the screenshot, check for no page errors and `scrollWidth == 390`, and look at the
   changed section.
3. After pushing, poll the live page until it contains the change. Then give the user the link.

## 2. A new sitter

Ask only for what is missing: names as they appear in the greeting (e.g. `ליאור`,
`נועה ויובל`), street address and city (for the poster prompt only), and a photo of each
sitter (for the poster).

Add a row to `SITTERS` in `mookie/build-pages.sh`: `slug|names|` (empty poster for now).
`slug` is a lowercase Latin transliteration joined by `-` (`noa-yuval`). Run the script,
push, verify, and give the user `https://yonatan-ilani.github.io/mookie-guide/mookie/<slug>.html`.

## 3. Sitter photos go up as public links

Gemini works best when every image is a link in the prompt. The user has approved publishing
sitter photos; don't ask again.

1. Crop black screenshot bars, strip all metadata (EXIF/GPS) by re-encoding the pixels, and
   save it as `mookie/assets/<slug>.jpg` (two sitters: `mookie/assets/<slug>-<name>.jpg`). Uploads are under
   `~/.claude/uploads/`.
2. Commit, push, then poll `https://yonatan-ilani.github.io/mookie-guide/mookie/assets/<file>.jpg`
   until it returns 200. Do not give the user a prompt until every link returns 200.

If a permission or safety check refuses to publish a photo, do not work around it. Give the
user the upload steps: open `https://github.com/yonatan-ilani/mookie-guide/upload/main/mookie/assets`,
drag in the photo named exactly `<file>.jpg`, commit. Then poll the link and confirm it opens.

## 4. Adding the finished poster to the page

When the user sends the poster Gemini made: strip its metadata, save it as
`mookie/assets/<slug>-poster.jpg`, set `assets/<slug>-poster.jpg` in the sitter's `SITTERS` row, run the script and
push. The page shows it as the taped card under the greeting (the `sitter-poster` meta tag).
Poll the page and the image until both return 200.

## 5. Thank-you poster (Gemini prompt)

The picture is a **thank-you poster** in a fixed style: the first one was made for the hosts
Max & Nery. It lives in this repo at `mookie/assets/poster-template.jpg` and is public at
https://yonatan-ilani.github.io/mookie-guide/mookie/assets/poster-template.jpg (the repo and its
GitHub Pages site are public; the user approved publishing it). The prompt asks Gemini to
recreate it for the new sitter.

Put the poster URL in the prompt. If Gemini's result doesn't follow the layout (it may not
open the link), tell the user to download the poster from that URL and attach it instead.

Use the sitter photo links from section 3, right after the poster link:
`The new sitter is {NAME} — this is his/her photo: {URL}`.

Optional for the user: attach a Google Street View screenshot of the building, so Gemini
doesn't invent one.

Do not invent details about the sitters' looks or identity. Drop the pride flag and the
"GAY-FRIENDLY & WELCOMING HOUSE!" sign unless the user says they fit the new sitters.

```text
Recreate this poster as a new version for a different dog-sitter:
https://yonatan-ilani.github.io/mookie-guide/mookie/assets/poster-template.jpg
(If the poster is also attached, use the attached copy.)
Keep exactly the same layout, cartoon style, colors and composition:
- Big rainbow-striped bubble-letter title at the top.
- Round photo bubble(s) of the sitter(s) at the top, with a ribbon banner "YOU'RE OUR SUPERSTAR{S}!".
- The same heart in the middle with the same real puppy photo of Mookie inside it,
  with "THANK YOU FOR KEEPING MOOKIE!" around the heart.
- Floating dog toys, bones and balls around.
- A cartoon of the sitter's building at the bottom, with trees, potted plants,
  and the cartoon golden puppy happily running by the entrance.
- Bottom ribbon: "YOUR FRIENDS AND MOOKIE THANK YOU!"

Changes:
- Title: "{NAMES IN ENGLISH, e.g. LIOR!}" instead of "MAX & NERY!".
- People: use only the person/people in the sitter photo(s) linked above;
  remove both people from the original poster.
- The building is {NAMES}'s home at {STREET ADDRESS, CITY}. If a Street View screenshot
  of the building is attached, base the building on it (same shape, number of floors,
  balconies, colors and entrance). Otherwise, before drawing, use Google Maps to look up
  this address and base the building on what is really there. If you can't see the real
  building, draw {SHORT DESCRIPTION, e.g. a typical white Tel Aviv Bauhaus-style apartment
  building with balconies and shutters}, and tell me you couldn't find it.
- Replace the rainbow flag and the "GAY-FRIENDLY & WELCOMING HOUSE!" sign with a sign
  that says "MOOKIE'S VACATION HOME!", and change the house number to {NUMBER}.
```

Gemini usually can't see Street View itself; if it says it couldn't find the building,
tell the user to attach a Street View screenshot instead.

If Gemini garbles text, tell the user to ask it to fix only that line instead of
regenerating the whole poster.


## 6. Funny video for a sitter (Higgsfield, Seedance 2.5)

Mookie "records" a short message to the sitter. The user writes the lines; you write the
prompt. Researched October 2026 (Higgsfield and third-party guides):

- Write a director's brief with labelled blocks: FORMAT, REFERENCES, SCENE, VOICE, timed
  beats, AUDIO, CONSTRAINTS. Visuals in English; dialogue in Hebrew script, in quotes, with
  "says in Hebrew".
- References: `@Image 1` = close-up of Mookie's face, `@Image 2` = full body. Give them one
  job — identity only, not background or pose. 2–4 photos help; more don't. Use a recent
  adult photo, not the puppy photo from the poster.
- 10 s fits (up to 30 s; plan caps may be ~15 s). Set length, 9:16 and audio ON in
  Higgsfield's selectors, not only in the text.
- At most 4 beats in 10 s, one spoken line per beat, one camera move per beat. Keep his mouth
  in frame while he speaks (no eye-only close-up before a line). Avoid wild motion (warping).
  No brand names. Always end with "No on-screen text, subtitles, captions, logos or
  watermark" — non-English speech can trigger auto-captions.
- Hebrew is not on Seedance's published language list. Tell the user to test the first beat
  first; if the Hebrew is poor, generate without dialogue and add the voice in Higgsfield's
  Lipsync Studio with their own recording.

The user's style so far: Mookie as an anthropomorphic street boss on a white plastic
monobloc chair ("כיסא כתר" — don't write the brand in the prompt), sunglasses, gold chain,
sunflower seeds, black coffee, outside a Tel Aviv building; a dramatic pause before the
punchline; he licks the lens at the end. Template (Lior's version):

```text
FORMAT: 10-second vertical video, 9:16, realistic comedy, handheld phone footage with slight natural shake, natural afternoon daylight. Native audio on.

REFERENCES: @Image 1 (and @Image 2 if uploaded) is Mookie the dog. Use it for his identity only: same face, fur color and texture, ear shape, eye color and nose, same breed and size. Do not copy the background, lighting or pose from the reference. Only his pose, outfit and expressions change.

SCENE: Sidewalk outside a Tel Aviv apartment building entrance, warm afternoon sun. Mookie sits like a person on a cheap white plastic monobloc chair, leaning back, legs spread wide, one front paw on the armrest, the other holding a few sunflower seeds. He wears dark sunglasses and a thick gold chain. Beside him a second plastic chair serves as a table with a small cup of black coffee; sunflower-seed shells are scattered on the ground. He is the relaxed boss of the street.

VOICE: Mookie speaks in Israeli Hebrew with a slightly raspy, playful street-tough male voice. One line per beat, mouth clearly visible while he speaks.

0–3s: Medium shot, front-facing. Mookie spits out a seed shell, looks straight into the camera and says in Hebrew, relaxed and cool: "שלום {NAME}, זה חברך מוקי!"

3–6s: Same framing. His tail wags fast, the plastic chair creaks and wobbles once; he steadies himself, straightens his sunglasses with a paw and, with a big doggy smile, says in Hebrew: "אני מתרגש לקראת האירוח אצלך!"

6–8s: He leans forward, elbows on his knees like a street boss giving an order, and says in Hebrew in a low, cheeky voice: "נתראה בקרוב. תכין חטיפים..."

8–10s: He freezes, dead serious, and slowly pulls his sunglasses down his nose so his eyes show; the camera slowly pushes in to a close-up of his whole face with his mouth in frame, a beat of quiet. He snaps back and says in Hebrew, short and sharp: "יא ביצה!" Then he leans into the lens, his nose and tongue fill the frame, the image smears, cut to black.

AUDIO: Quiet Tel Aviv street ambience, distant scooter, plastic chair creak, seed shell crack; during the pause only soft ambience, no music.

CONSTRAINTS: No on-screen text, subtitles, captions, logos or watermark. Keep Mookie's breed, size and coloring identical to the reference throughout. No human hands in frame.
```
