# ERYND — Media Intelligence

A high-fidelity, interactive prototype of an **AI-first media intelligence platform**.
It inverts the category: instead of a left-nav-and-dashboards console, the product is
**conversation-first**. You talk to a nameless assistant, and capabilities *materialize
inline as interactive artifacts* that *expand into full working surfaces*. It wears the
**ERYND** brand identity throughout.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

> Built with React + TypeScript + Vite, Zustand, and Framer Motion. No backend — all
> data is realistic mock content built around one coherent scenario.

---

## Design rationale — how this beats the incumbents

The competitor teardown (Meltwater, Brandwatch, Sprinklr, Sprout, Talkwalker, Dataminr)
points at one open quadrant: **broad capability delivered with genuine ease of use**.
Every rival is either easy-but-narrow or broad-but-heavy. Two ideas land us in that gap.

**The conversation is the spine (but not a cage).** There is no module nav rail — you ask
*"what's happening today?"* and the briefing renders; ask *"why did sentiment drop?"* and a
drill-able chart appears. This directly answers **Meltwater's** "clunky navigation / not
intuitive," **Brandwatch's** *three separate logins* (here, one unified surface), and the
**Meltwater/Brandwatch/Sprinklr** Boolean learning curve — the search builder lets you
describe a query in plain language instead. Goal-first onboarding renders a useful briefing
in about a minute, beating **Sprinklr's** 3–6-month *configure-before-value*. And because
the briefing **absorbs urgency** as a calm narrative ("what changed · why it matters · what
to do") with severity shown through hierarchy rather than saturated color, it answers
**Dataminr's** *alert fatigue* — the watching rail is a quiet set of chips, never a feed
that shouts.

**Progressive delegation is the organizing spine.** The assistant is a partner you trust
more over time: an always-visible autonomy ladder (Ask → Draft → Draft & queue → Act within
bounds), every action logged and **reversible**, and an explicit **outbound-approval gate**
on anything that leaves the building (a pitch, a published post) with the AI's contribution
logged for attribution. Simple asks are never gated and it never nags. This makes the broad
capability *trustworthy* — the thing the heavy enterprise suites never made feel safe or
simple.

---

## Brand provenance

The identity is extracted from the real ERYND landing repo and reproduced faithfully:

- **Fonts** — the actual `woff2` files: Schibsted Grotesk (display, wt 680, tight tracking),
  Inter (body), Fraunces italic (the single serif-emphasis word), JetBrains Mono (labels).
- **Logo** — the real aperture/iris mark (blade arcs + concentric rings + core), rebuilt as
  an SVG component and used as the assistant's avatar and loader; wordmark **ERYND**.
- **Palette** — oxblood `#4C030F`, cream `#F4EEE4`, ink `#1A0A0D`, teal `#2BB0C0`, plus the
  film-grain overlay, pill radii, glow-not-shadow treatment, and `cubic-bezier(.16,1,.3,1)`
  easing from the source CSS.
- **Voice** — editorial, precise, strategy-first ("say less, say it better"). The assistant
  speaks this way; it has **no name**, like a chat that simply responds.

**Brand vs. legibility:** ERYND is dark/oxblood by brand, but this is a tool people live in
for hours. So the oxblood is the constant *shell chrome* (top bar, identity, accents) while
the dense working surfaces sit on calm near-black (dark) or paper-cream (light). Both themes
ship and are toggleable in the top bar and Settings.

---

## What to try

- **Onboarding** — goal-first; answer a few prompts or *skip to sample data*.
- **Ask** the suggested prompts, or anything, in the composer (or `⌘K`).
- **Briefing** → expand it (⤢) → inside the overlay, flip the **state preview**
  (default / loading / empty / error) on the four hero surfaces.
- **Analytics** → click any datapoint to **drill to the evidence** (the underlying mentions).
- **Draft a response** → edit, see the content coach, hit the **outbound-approval gate**,
  approve, and watch it logged in the **trust ledger** (right rail) with **undo**.
- **Actions** → drag a card across Proposed → In Progress → Shipped → Measured.
- Set autonomy to **L0 (Ask)** and ask it to draft — it now **proposes** first.
- Toggle **dark/light** and **EN/ES**.

## Scenario

One thread runs through every surface: the fictional premium-audio brand **Nuvera** is hit
by an *Aria 2* battery-life complaint that spikes overnight → the analyst investigates →
the assistant drafts an on-brand response (approved) → it's published / pitched → logged as
a Kanban action → tracked to a measured recovery. Mentions are a natural EN/ES mix.

## Project structure

```
src/
  styles/      tokens.css (dual-theme) · fonts.css · global.css
  store/       useStore.ts (Zustand: chat, theme, autonomy, ledger, overlays)
  i18n/        en.ts · es.ts · useI18n.ts
  data/        mockData.ts (the scenario) · assistant.ts (intent routing)
  components/
    shell/     AppShell · TopBar · WatchingRail · TrustLedgerPanel · CommandMenu ·
               SurfaceOverlay · EvidencePanel · Settings · Toasts · Onboarding
    chat/      Conversation · Message · ArtifactFrame
    artifacts/ Briefing · Analytics · ResponseDraft · Kanban · SearchBuilder ·
               MediaCRM · SocialPublisher · ROI · WarningDetail
    charts/    hand-rolled, clickable SVG charts
    primitives/ Button · Card · SeverityBadge · Aperture · states · …
```

## Accessibility

WCAG-AA minded: status/severity is never encoded by color alone (always paired with an
icon shape **and** a label), focus is visible, contrast holds in both themes, and all motion
respects `prefers-reduced-motion`.
