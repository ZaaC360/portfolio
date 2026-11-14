---
name: Zaac
description: Personal portfolio of a creative full-stack developer. A black-and-white poster with one yellow dot.
colors:
  yellow: "#ffd632"
  ink: "#000"
  paper: "#fff"
  text-body: "#333"
  text-secondary: "#444"
  text-caption: "#555"
  label: "#666"
  inactive: "#bbb"
  hairline: "#ddd"
  card-ground: "#ececec"
  on-ink: "#e6e6e6"
  on-ink-soft: "#cfcfcf"
  on-ink-muted: "#bdbdbd"
  label-on-ink: "#8a8a8a"
  outline-on-ink: "#3a3a3a"
  hairline-on-ink: "#222"
  invalid: "#ff6b4a"
typography:
  display:
    fontFamily: "MyFont"
    fontSize: "clamp(56px, 9vw, 168px)"
    fontWeight: 500
    lineHeight: 0.9
  headline:
    fontFamily: "MyFont"
    fontSize: "clamp(36px, 4.5vw, 80px)"
    fontWeight: 500
    lineHeight: 0.9
  title:
    fontFamily: "MyFont"
    fontSize: "clamp(32px, 3.4vw, 56px)"
    fontWeight: 500
    lineHeight: 1
  lede:
    fontFamily: "switzer"
    fontSize: "clamp(18px, 1.8vw, 26px)"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "switzer"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  nav:
    fontFamily: "switzer"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1
  label:
    fontFamily: "ui-monospace, Menlo, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "0.2em"
  label-sm:
    fontFamily: "ui-monospace, Menlo, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.12em"
rounded:
  card: "3px"
  nav: "12px"
  frame: "24px"
  section: "40px"
  pill: "999px"
  dot: "50%"
spacing:
  gutter: "8rem"
  gutter-phone: "1rem"
  gap: "2rem"
  section-top: "14vh"
  before-footer: "16vh"
  before-footer-phone: "12vh"
components:
  nav-cta:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.nav}"
    rounded: "{rounded.nav}"
    padding: "12px 18px"
  nav-cta-on-ink:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.nav}"
    padding: "12px 18px"
  button-send:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.55em 1.1em"
  button-send-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  button-footer:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 22px"
  button-footer-hover:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
  button-on-yellow:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.pill}"
    padding: "9px 18px"
  chip-selected:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
  input-blank:
    backgroundColor: "transparent"
    textColor: "{colors.yellow}"
    rounded: "0"
    padding: "0.15em 0 0.2em"
  guide-pill:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  screenshot-card:
    backgroundColor: "{colors.card-ground}"
    rounded: "{rounded.card}"
---

# Design System: Zaac

## Overview

**Creative North Star: "The Poster and the Dot"**

The site is a printed poster that moves. Huge condensed uppercase words in black on white, a self-portrait cut into the type, and one yellow dot that closes the headline like a full stop. Every surface after the home hero repeats that sentence structure: a giant word, a yellow dot after it, a short plain-spoken line beside it, and small monospaced spec text underneath. The mood is confident, graphic and a little playful, never ornamental.

Depth is physical, not painted. Things are objects in one CSS perspective: the hero splits into lifted layers, the stack is a tower of slabs with real thickness, project screenshots are cards that fall and stand back up on a floor line. Where an object was or will be, a dashed phantom outline marks its place. The drafting vocabulary (hairline rules, numbered parts, leader lines, title blocks) carries the detail.

Two grounds exist and they alternate by purpose. White is where the work is shown. Black is where contact happens: the footer and the Let's Talk page, with dithered ASCII hands reaching toward a yellow spark. Motion is part of the identity on every surface, and every surface also ships a still, complete poster for reduced motion and for no JavaScript.

**Key Characteristics:**
- One accent only: yellow on a strict black and white ground, no second hue.
- Condensed uppercase display type at poster scale, set tight (line-height 0.84 to 1).
- The yellow dot as punctuation, cursor, spark, progress tip and selection marker.
- Flat surfaces, hairline rules and dashed phantom outlines instead of shadows.
- Objects in CSS 3D perspective, moved by scroll and hover.
- Monospace uppercase labels for specs, counters and status lines.

## Colors

Black, white and one yellow; everything else is a grey step chosen for a specific text or line role.

### Primary
- **Signal Yellow** (`yellow`): the single accent. It is the dot after a headline, the cursor dot, the spark between the hands, the tip of the timeline, the last slab of the tower, the selected chip, the current part number, typed answers on black, the send button, and the full-screen curtain that opens and closes a page. On white it is always a fill with black on top, never text.

### Neutral
- **Ink** (`ink`): display type and primary text on white; the ground of the footer, the Let's Talk surfaces and the loader; structural rules and 1.5px frames.
- **Paper** (`paper`): the page ground; text and the footer button on black.
- **Body Grey** (`text-body`): ledes and descriptive paragraphs on white.
- **Secondary Grey** (`text-secondary`): smaller supporting paragraphs and fact values on white.
- **Caption Grey** (`text-caption`): 14px captions and years on white.
- **Label Grey** (`label`): monospace labels, rulers, part numbers and the facts and captions on white.
- **Inactive Grey** (`inactive`): timeline entries the scroll has not reached yet.
- **Hairline** (`hairline`): 1px dividers between list rows and fact rows on white.
- **Card Ground** (`card-ground`): the fill behind a screenshot before its image paints.
- **On-Ink Text** (`on-ink`): default text and links on black.
- **On-Ink Soft** (`on-ink-soft`): ledes and the back control on black.
- **On-Ink Muted** (`on-ink-muted`): footer paragraph and form status on black.
- **On-Ink Label** (`label-on-ink`): monospace labels, counters and the sign-off bar on black.
- **On-Ink Outline** (`outline-on-ink`): chip borders and resting blank underlines on black.
- **On-Ink Hairline** (`hairline-on-ink`): footer dividers.

### Tertiary
- **Invalid Coral** (`invalid`): one job only, the underline of a filled, blurred, invalid field on the Let's Talk form.

### Named Rules
**The One Dot Rule.** Yellow is the only colour. It marks one thing at a time: the end of the headline, the thing in hand, the thing selected, the action that sends. If two unrelated things on a screen are yellow, one of them is wrong.

**The Fill-Not-Text Rule.** On white, yellow is a shape with black on it. Yellow text appears only on black.

**The Two Grounds Rule.** White shows work, black makes contact. A black section meets a white page with rounded top corners (`rounded.section`, `rounded.frame` on phones).

## Typography

**Display Font:** NewTitle Variable, self-hosted and registered as `"MyFont"` (no fallback declared)
**Body Font:** Switzer Variable, self-hosted and registered as `"switzer"` (no fallback declared), applied to everything by a global `*` rule
**Label/Mono Font:** `ui-monospace, Menlo, Consolas, monospace`

**Character:** A very condensed, tall grotesque shouting in uppercase next to a calm, neutral sans at reading size. The mono face is the drafting pencil: small, spaced, uppercase.

### Hierarchy
- **Display** (500, `clamp(56px, 9vw, 168px)`, 0.9 to 0.92, uppercase): the page title on About and Stack. Poster variants scale to the viewport instead: Artworks title `min(25vw, 34vh)` at 0.84, project names `clamp(64px, min(12vw, 22vh), 220px)` at 0.9, the sent-flood word `clamp(120px, 22vw, 400px)` at 0.85, the home hero sized from its square box.
- **Headline** (500, `clamp(36px, 4.5vw, 80px)`, 0.9, uppercase): the footer call to action. Neighbours: Let's Talk title `clamp(56px, 6.4vw, 120px)`, form question `clamp(38px, 4vw, 72px)` at 1, home brief sentence `clamp(40px, 6vw, 108px)` at 1.08.
- **Title** (500, `clamp(32px, 3.4vw, 56px)`, 1, uppercase): list item names (services, roles). Parts-list names step down to `clamp(20px, 3.2vh, 34px)`.
- **Lede** (400, `clamp(18px, 1.8vw, 26px)`, 1.4 to 1.45): the one paragraph beside or under a title, capped at 24 to 38ch.
- **Body** (400, 16px, 1.5): supporting paragraphs and fact values, capped at 42ch. Fact values on Artworks are 15px at 1.4.
- **Nav** (400, 18px; 14px on phones): header links.
- **Label** (400, 12px, 0.2em, uppercase, mono): spec lines, scroll hints, counters, captions, fact labels.
- **Label Small** (400, 11px, 0.12em, uppercase, mono): part numbers, roles, title-block field names. The footer column labels are 11px at 0.2em.

### Named Rules
**The Shout and the Whisper Rule.** Display type is always uppercase NewTitle at weight 500 with line-height at or below 1.1. Nothing in between: the next size down is reading text, not a medium heading in Switzer.

**The Inherit Rule.** Because `*` forces Switzer, any wrapper inside a NewTitle or mono block (including the divs SplitText injects) must set `font-family: inherit`. Every surface carries this rule; a new one needs it too.

**The Whole Word Rule.** A display word stays on one line (`white-space: nowrap`) and is sized to fit the viewport in both directions (`vw` and `vh` in one `min()`/`clamp()`), rather than wrapping.

## Layout

Pages share one gutter: `spacing.gutter` on each side on desktop, `spacing.gutter-phone` at 768px and below. The header (logo left, three links and the Let's Talk button right) sits inside the same gutter with no bar or border. The Stack sheet reaches the same margin as 3rem of page padding plus 5rem of sheet padding.

A page opens with the title top left and its lede top right or directly under it, then the surface's one object (a line of cards, tower, hands). Below that, content sits in asymmetric two-column grids with a narrow label or media column against a wide content column (1fr/3fr on About, 7fr/4fr alternating sides on Artworks, a three-column drafting sheet on Stack). All of them collapse to one column at 768px.

Vertical rhythm is measured in viewport height, not a pixel scale: 14vh above a major block, 5vh under a title, 18vh above each project plate (12vh on phones), and `spacing.before-footer` between the last content and the footer. Horizontal gaps are `spacing.gap` or multiples of it. Home sections are full-screen (100vh) scenes.

3D scenes size themselves from one custom property per scene (`--box` for the hero, `--s`/`--t`/`--g` for the tower, `--u` for the line of cards), each a `min()` of a `vh` and a `vw` term so the object fits short and narrow screens alike.

Breakpoints: 768px is the system breakpoint. 1024px (Let's Talk form controls drop under the question) and 1100px (Stack sheet padding) are local adjustments. `(hover: none)` and `(pointer: fine)` gate cursor-following behaviour.

## Elevation & Depth

The system is flat. No surface casts a drop shadow and nothing floats on a blurred layer. Depth comes from real CSS perspective (objects tilted, stacked and hinged in 3D), from a card darkening as it tips away from the light (a black overlay driven by `--shade`), and from dashed phantom outlines that mark where an object belongs.

The only glow in the system is light the yellow dot emits on black.

### Shadow Vocabulary
- **Spark glow** (`box-shadow: 0 0 18px 4px rgba(255, 214, 50, 0.55)`): the yellow spark between the hands, pulsing to `0 0 28px 8px rgba(255, 214, 50, 0.7)`.
- **Pulse ring** (`box-shadow: 0 0 0 0 rgba(255, 214, 50, 0.6)` to `0 0 0 10px rgba(255, 214, 50, 0)`): the breathing "live" dot.
- **Tip halo** (`box-shadow: 0 0 0 6px rgba(255, 214, 50, 0.25)`): the dot riding the timeline's progress line.
- **Card edge** (`box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.24)`): a hairline, not a shadow, so light screenshots keep their edge on white.
- **ASCII bloom** (`filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.25))`): soft bloom on the dithered hands, under an animated film grain at 0.2 opacity.

### Named Rules
**The Only Light Is Yellow Rule.** Surfaces are flat at rest and in every state. A glow belongs to the yellow dot on black, nowhere else.

**The Phantom Rule.** When an object leaves its place (a slab pulled from the tower, a plate card still lying on its floor line, an empty slot waiting), a 1.5px dashed black outline holds the place.

## Shapes

Three corner behaviours, each tied to a kind of thing. Circles for the dot in all its forms (`rounded.dot`). Full pills for actions and chips (`rounded.pill`). Near-square corners for physical objects: screenshot cards at `rounded.card`, tower slabs at zero. Large soft corners appear only on big containers: the drafting-sheet frame and hero plate at `rounded.frame`, and the top edge of a black section where it meets white at `rounded.section`. The header's Let's Talk button is a soft rectangle (`rounded.nav`, 10px on phones), not a pill.

Lines are 1px for dividers and fact rows, 1.5px for frames, slab outlines, balloons and phantom outlines, 2px for the timeline rail and focus rings. Leader lines end in a dot or a numbered balloon. Screenshot cards keep the home deck's 2.06:1 ratio everywhere.

Gradients exist only as masks and as drawn rules (the photo fading into the plate, lines that draw in by animating a background size). No surface is filled with a gradient.

## Components

Controls are plain and direct; the type and the objects carry the character, the controls stay out of the way.

### Buttons
- **Send (primary action on black):** NewTitle uppercase, `clamp(28px, 2.6vw, 44px)`, yellow pill with black text, padding in ems so it scales with its type. Hover turns it white. Leans toward the cursor on fine pointers. Disabled drops to 0.5 opacity with a progress cursor.
- **Footer button:** white pill, black 14px/600 Switzer, an 8px yellow dot before the label. Hover and focus turn the pill yellow.
- **Header Let's Talk:** black soft rectangle with white 18px text; on black pages it inverts to yellow with black text.
- **On-yellow button:** black pill with white 18px text, used on the sent-flood screen beside an underlined text link.
- **Text link:** black, underlined, underline offset 4px, 15px/500.
- **Focus:** a 2px solid outline offset 2 to 3px, black on white and yellow grounds, yellow on black.

### Chips
- **Style:** transparent pill, 1px `outline-on-ink` border, 15px Switzer in `on-ink`. Hover brightens the border to white.
- **Selected:** yellow fill and border with black text (`aria-pressed="true"`).

### Cards / Containers
- **Screenshot card:** 2.06:1, `rounded.card`, `card-ground` behind the image, the 1px card edge, image cropped from the top. It is an object: it lies flat, hinges on its bottom edge (`transform-origin: 50% 100%`) and stands up. No padding, no caption inside.
- **Drafting sheet:** a 1.5px black frame at `rounded.frame` with zone rulers along the top and left, wiped in from the left.
- **Title block:** a 1.5px black box divided by 1px rules, a NewTitle name across the top, small mono field names over 15px values.
- **Slab:** a white square with a 1.5px black outline and black side faces that give it thickness; the last one is yellow.

### Inputs / Fields
- **Style:** a blank in a sentence, not a box. Transparent, no radius, NewTitle uppercase at the size of the line it sits in, a bottom rule only (2px on the Let's Talk page, 0.05em in the home brief). Typed text and caret are yellow.
- **Focus:** the bottom rule turns yellow.
- **Invalid:** once filled and blurred, the rule turns `invalid`.

### Navigation
- **Header:** logo at 60px (44px on phones) linking home, three 18px links and the Let's Talk button, 2rem apart, colour inherited, no underline. `aria-current="page"` marks the current page in markup; it has no visual treatment.
- **Footer:** on black. ASCII hands with the spark link, the headline and footer button, three columns under small mono labels (one row of links on phones), and a mono sign-off bar. Footer links invert to black on white on hover and focus.
- **List rows as navigation:** rows divided by `hairline`; on hover, focus or current, a yellow dot scales in to the left of the NewTitle name and the name steps right by the same distance. The current row's number gets a yellow block behind it and its top rule turns black.

### The Yellow Dot
A circle sized in ems of the word it follows (0.14em after a display word, 0.28 to 0.3em beside a list name). The same dot is the cursor (14px, trailing the pointer, growing 3.4x at 0.55 opacity over anything clickable), the guide pill's bullet, the spark, and the point every page's opening curtain collapses into.

### Guide Pill and Scroll Hints
A small black pill with a 7px yellow bullet and 13px/500 white text follows the cursor over the home deck ("Click to drop"); on touch it sits fixed at the bottom. Elsewhere a mono label line states the one available gesture.

### Motion
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` for every CSS transform and scale transition (0.5s for hover moves, 0.7 to 0.9s for objects), mirrored in GSAP as the custom ease `ab-snap`. Colour and opacity changes run 0.2 to 0.5s with the default curve. The sent-flood uses `cubic-bezier(0.7, 0, 0.2, 1)` over 1.1s.
- **Entrances:** a yellow curtain covers first paint and collapses into the title's dot; display characters rise out of masks; paragraphs unblur word by word (10 to 12px blur, small upward drift); rules draw in from one end.
- **Scroll:** Lenis smooth scroll drives GSAP ScrollTrigger; scroll moves objects (lifts, explodes, stands cards up) rather than fading sections in.
- **Hover:** the dot slides in and the name steps right; objects lift on their hinge.
- **Still fallback:** with `prefers-reduced-motion` or without JavaScript, every surface is a complete static page with nothing hidden; curtains clear themselves with a CSS failsafe.

## Do's and Don'ts

### Do:
- **Do** end a page's display word with the yellow dot, sized in ems of that word.
- **Do** keep the palette to black, white, the listed greys and `yellow`. Use `label` for mono labels on white and `label-on-ink` on black.
- **Do** set display text in uppercase NewTitle at weight 500 on one line, sized with `vw` and `vh` together so it fits.
- **Do** add `font-family: inherit` to wrappers inside display and mono blocks, since the global rule forces Switzer.
- **Do** use `spacing.gutter` side margins (`spacing.gutter-phone` at 768px and below) and viewport-height vertical spacing.
- **Do** show depth with CSS perspective, hinges and dashed 1.5px phantom outlines.
- **Do** use `cubic-bezier(0.16, 1, 0.3, 1)` for transforms and ship a complete static state for reduced motion and no JavaScript.
- **Do** give focusable controls a 2px outline offset 2 to 3px: black on white or yellow, yellow on black.
- **Do** draw icons as inline SVG, as the GitHub mark and the phone back-to-top arrow are.

### Don't:
- **Don't** introduce a second accent hue. `invalid` is for an invalid field's underline only.
- **Don't** set yellow text on white, or use yellow for two unrelated things on one screen.
- **Don't** add drop shadows or blurred, floating panels. The only glow is the yellow dot's on black.
- **Don't** fill a surface with a gradient. Gradients are for masks and drawn rules.
- **Don't** round screenshot cards beyond `rounded.card` or put them in padded, shadowed tiles.
- **Don't** box form fields. A field is an underlined blank in a line of display type.
- **Don't** set headings in Switzer or mix-case NewTitle.
- **Don't** hide content behind motion: nothing may depend on an animation having run.
