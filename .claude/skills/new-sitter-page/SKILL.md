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

`index.html` is the generic page. Each sitter page is an exact copy with one changed
value — the `sitter-names` meta tag. Never edit sitter pages by hand; edit `index.html`
and regenerate them all.

```bash
sed 's|<meta name="sitter-names" content="">|<meta name="sitter-names" content="NAMES">|' index.html > SLUG.html
```

`SLUG` is a lowercase Latin transliteration, words joined by `-` (`noa-yuval`).
Check with `diff index.html SLUG.html` — only line 11 may differ.

## 3. Write the Gemini prompt

Fill this template in English (image models follow English better) and give it to the
user. Mookie's look comes from a photo of him that the user attaches in Gemini; the rest comes from step 1. Do not invent
details about the sitter's looks — if none were given, describe them only by name and
role and suggest the user attach a photo of them to Gemini.

```text
A funny, warm, cartoon-style illustration of Mookie, the dog in the attached photo,
staying with his dog-sitter{s} {NAMES} at their home in {NEIGHBORHOOD, CITY}.
Setting: {THEIR HOME — e.g. a small Tel Aviv apartment with a sunny balcony and plants}.
Scene: Mookie has taken over the place like he owns it — sprawled across their couch
on his own bed, a red Kong toy in his mouth and a green lick mat nearby, while
{NAMES} {FUNNY ACTION fitting them — e.g. try to work from the floor because the couch
is taken}. Mookie looks proud and very pleased with himself.
{OPTIONAL LOCAL DETAIL — e.g. a view of the sea through the window, a beach towel with
paw prints drying on the balcony}.
Bright, cheerful colors, thick black outlines, sticker-like style, playful mood.
Text at the top in Hebrew: "מוקי אצל {NAMES}".
Keep Mookie looking like the attached photo of him.
{If the user also attaches photos of the sitters: "Base the people on the attached photo(s)."}
```

Tell the user to attach a photo of Mookie (required) and of the sitters (optional, only
if they agree). Gemini often garbles Hebrew text in images — if it does,
drop the text line and add the caption afterwards.
