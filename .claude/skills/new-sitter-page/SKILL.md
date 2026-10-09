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

The picture is a **thank-you poster** in a fixed style: the first one was made for the hosts
Max & Nery. The user keeps that poster and attaches it to Gemini as the layout template — it
is not in this repo. The prompt asks Gemini to recreate it for the new sitter.

Tell the user to attach, in this order:
1. The original Max & Nery poster (template).
2. A photo of each sitter.
3. Optional: a Google Street View screenshot of the sitter's building, so Gemini doesn't
   invent one.

Do not invent details about the sitters' looks or identity. Drop the pride flag and the
"GAY-FRIENDLY & WELCOMING HOUSE!" sign unless the user says they fit the new sitters.

```text
Recreate the attached poster (image 1) as a new version for a different dog-sitter.
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
- People: use only the person/people in the attached sitter photo(s) {image 2[, 3]};
  remove both people from the original poster.
- The building is {NAMES}'s home in {CITY}
  (base it on the attached building photo if there is one; otherwise {SHORT DESCRIPTION,
  e.g. a typical white Tel Aviv Bauhaus-style apartment building with balconies}).
- Replace the rainbow flag and the "GAY-FRIENDLY & WELCOMING HOUSE!" sign with a sign
  that says "MOOKIE'S VACATION HOME!", and change the house number to {NUMBER}.
```

If Gemini garbles text, tell the user to ask it to fix only that line instead of
regenerating the whole poster.
