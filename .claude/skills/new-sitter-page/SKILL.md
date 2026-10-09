---
name: new-sitter-page
description: Create a per-sitter page of Mookie's sitter guide and a Gemini prompt for a funny picture of Mookie with that sitter at their home. Use when the user names a new sitter (or gives sitter details such as names, address, home or neighborhood) and wants a page for them, or asks for "the Gemini prompt" / "a funny picture of Mookie with <sitter>".
---

# New sitter page + Gemini picture prompt

Mookie stays **at the sitter's home** (not at the owner's apartment). Everything the
skill writes must fit the sitter's home and area.

## 1. Collect details

Ask only for what is missing:

- Sitter name(s), as they should appear in the greeting (e.g. `ליאור`, `נועה ויובל`).
- Address or neighborhood and city.
- Anything visual about them or their home: apartment / house, balcony, garden, nearby
  beach or park, style of the place, hobbies, pets, how they look (only if the user offers it).

## 2. Create the page

`index.html` is the generic page. Each sitter page is an exact copy with up to two changed
values in the `<head>`: the `sitter-names` meta tag, and the `sitter-poster` meta tag once
the sitter has a poster. Never edit sitter pages by hand; edit `index.html` and regenerate
them all.

```bash
sed -e 's|<meta name="sitter-names" content="">|<meta name="sitter-names" content="NAMES">|' \
    -e 's|<meta name="sitter-poster" content="">|<meta name="sitter-poster" content="assets/SLUG-poster.jpg">|' \
    index.html > SLUG.html
```

Leave out the second `-e` until the poster exists. `SLUG` is a lowercase Latin
transliteration, words joined by `-` (`noa-yuval`). Check with `diff index.html SLUG.html`:
only those meta lines may differ. When regenerating every page after an `index.html` change,
keep each sitter's existing poster value.

### Adding the finished poster

When the user sends the poster Gemini made, strip its metadata (re-encode the pixels), save it
as `assets/SLUG-poster.jpg`, set `sitter-poster` on that sitter's page, and push. The page
shows it as the taped card under the greeting. Then poll the page and the image URL on
`https://yonatan-ilani.github.io/mookie-guide/` until both return 200.

## 3. Write the Gemini prompt

The picture is a **thank-you poster** in a fixed style: the first one was made for the hosts
Max & Nery. It lives in this repo at `assets/poster-template.jpg` and is public at
https://yonatan-ilani.github.io/mookie-guide/assets/poster-template.jpg (the repo and its
GitHub Pages site are public; the user approved publishing it). The prompt asks Gemini to
recreate it for the new sitter.

Put the poster URL in the prompt. If Gemini's result doesn't follow the layout (it may not
open the link), tell the user to download the poster from that URL and attach it instead.

### Sitter photos go up as public links too

Gemini works best when every image is a link in the prompt. For each sitter photo the user
gives you:

The user has approved publishing sitter photos; don't ask again.

1. Crop black screenshot bars, strip all metadata (EXIF/GPS) by re-encoding the pixels, and
   save it as `assets/<slug>.jpg` (for two sitters: `assets/<slug>-<name>.jpg`). The
   user's upload path is under `~/.claude/uploads/`.
2. Commit, push to `main`, then poll
   `https://yonatan-ilani.github.io/mookie-guide/assets/<file>.jpg` until it returns 200
   (Pages takes about a minute). Do not give the user the prompt until every link returns 200.
3. Put each sitter's photo link in the prompt, right after the poster link:
   `The new sitter is {NAME} — this is his/her photo: {URL}`.

If you can't publish the photo (a permission or safety check refuses it), do not work around
it. Give the user the upload steps instead: open
`https://github.com/yonatan-ilani/mookie-guide/upload/main/assets`, drag in the photo named
exactly `<file>.jpg`, commit. Then poll the link as in step 2 and confirm it opens.

Optional for the user: attach a Google Street View screenshot of the building, so Gemini
doesn't invent one.

Do not invent details about the sitters' looks or identity. Drop the pride flag and the
"GAY-FRIENDLY & WELCOMING HOUSE!" sign unless the user says they fit the new sitters.

```text
Recreate this poster as a new version for a different dog-sitter:
https://yonatan-ilani.github.io/mookie-guide/assets/poster-template.jpg
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
