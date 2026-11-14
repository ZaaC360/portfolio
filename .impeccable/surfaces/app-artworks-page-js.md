---
version: 1
slug: "app-artworks-page-js"
primary_target: "app/artworks/page.js"
related_targets: []
---

Scope: /artworks page, Experience mode. A whole new surface inside the established site world (no DESIGN.md change).
Audience: founders and small brands checking what Zaac has made before they brief him. Job: see each project, what it is and what it is built with; then carry on to the footer CTA.
Content: six projects shared with the home deck (app/projectData.js). All six are SAMPLE entries on Unsplash placeholder shots, tagged "Sample" on the page; one plate each (name, one line, year, platform, stack, optional live link). No clients, results or testimonials.
Constraint from the user: no more pinned scrolling (the /stack walk already pins).
Memorable moment: a line of overlapped screenshot cards drifting across the first screen; the one under the pointer rises out of it. Below, each plate card is wiped up out of its floor line once as the scroll reaches it.
Unresolved: real projects and screenshots replace the samples.

## Direction contract
THESIS: The home deck, standing and on the move: the projects file past as one overlapped line, you pull one out, and below each gets a plate where its card stands up. Refuses the thumbnail grid and the hover-reveal project list.
OWN-WORLD: White ground; screenshot cards with a 1px edge, skewed 5 degrees as if seen from the side; a black pill tab on each card with its number in mono (the home deck's pill), the name and a yellow dot joining it only for the card in hand; condensed uppercase title face for the title and plate names; black hairline floor lines on the plates, a dashed outline only on the open slot; yellow #ffd632 only on the title dot, the tab of the card in hand and the open slot (it fills yellow under the pointer and links to /lets-talk).
STORY: The visitor watches the six projects file past, pulls one out of the line (or just scrolls), reads each plate as its card is revealed, and ends on an empty dashed slot numbered 07: theirs.
FIRST VIEWPORT: Nav on top. ARTWORKS with the yellow dot top left, a third of the screen tall. Lede and hint top right, as on /lets-talk. Under both, edge to edge: one line of large overlapped cards (about a quarter of each showing), turned 5 degrees and stepping gently down to the right. It drifts slowly left to right, back to front, without end; it stops while a card is under the pointer or focused, and that card rises about half its height out of the line.
FORM: The Line (the user's own sketch, 2026-11-14; it replaces the dealt Floor hero, seed:8b524d1df6d3a1d5, whose plates remain). Signature interaction: the endless drifting line with the pull-out on hover (pure CSS: one keyframe animation per card, z-index riding along); on the plates, each card is wiped up from its floor line while its picture settles back (once per plate, no pin, no scrub; the earlier flat-to-upright flip was removed at the user's request). Motion grammar: yellow curtain collapsing into the title dot, the line sliding in from the side it comes from, characters rising out of masks, words unblurring, expo ease-out.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
