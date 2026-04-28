# LAWASZ Landing Redesign

Date: 2026-04-28
Project: LAWASZ KEBAB
Scope: Public landing page redesign for local mobile-first conversion

## Goal

Rebuild the public landing page so it works like a production restaurant site for local intent traffic, not like a product demo. The page should support the two most important user actions on mobile:

1. call the restaurant and place an order
2. open navigation and drive to the location

The page must preserve the dark premium LAWASZ brand while improving clarity, hierarchy, and conversion on small screens.

## Business Outcome

The landing page should help users who arrive from Google, social media, or direct links quickly answer:

1. what kind of place this is
2. where it is
3. whether it is open
4. how to order
5. why this place is worth choosing

## Confirmed Source Data

- Address: `Księdza Józefa Krupy 11, 41-949 Piekary Śląskie`
- Phone: `789 969 998`
- Hours:
  - Monday: closed
  - Tuesday-Thursday: `12:00-20:00`
  - Friday-Saturday: `12:00-21:00`
  - Sunday: keep extended-hours structure ready for final confirmation

## Design Direction

### Aesthetic

Dark editorial, premium street food, raw but restrained.

### Visual Thesis

The page should feel like a premium local kebab brand seen through smoked glass: dark surfaces, controlled fire accents, subtle blur, strong typography, and high readability.

### Differentiation Anchor

If the logo were removed, the site should still feel like LAWASZ because of the combination of:

- dark editorial typography
- warm fire highlights
- local-service-first information layout
- restrained glass surfaces over food and fire imagery

### DFII

- Aesthetic Impact: 4
- Context Fit: 5
- Implementation Feasibility: 5
- Performance Safety: 4
- Consistency Risk: 2

Score: `16 - 2 = 14`

## Content Strategy

### Primary CTA

`Zadzwoń i zamów`

### Secondary CTA

`Jak dojechać`

### Public Messaging Rules

Remove all public references to:

- voice
- FreeFlow Voice to Order
- prototype
- ready for voice commerce
- future-tech framing

The site should speak like a restaurant website, not a concept demo.

## Chosen Structure

### 1. Hero

Purpose: immediate conversion and orientation.

Content:

- strong headline
- short supporting description
- primary CTA: call
- secondary CTA: route
- compact info panel with address, phone, and hours

Rules:

- keep the first screen readable on mobile
- reduce copy volume
- keep the visual full-bleed
- no competing messaging above the fold

### 2. Pickup Section

Purpose: clarify that users can order by phone and collect on site.

Content:

- short section heading
- 3-step explanation:
  - call and place order
  - kitchen prepares it fresh
  - collect at the restaurant

This section should feel practical and low-friction.

### 3. Menu Preview

Purpose: show the most important items without overwhelming mobile users.

Content:

- short featured selection
- a few bestsellers or strongest categories
- clear prices
- route to the fuller menu lower on the page

Rationale:

The current full menu wall is too heavy for the first decision stage on mobile. The redesigned page should let users understand the offer quickly before committing to deeper browsing.

### 4. Trust and Differentiation

Purpose: answer why this place is worth choosing.

Content:

- own meat production
- autorski lawasz
- local address and active social media presence

This section should function as social proof without looking like a SaaS feature grid.

### 5. Meat Process Section

Purpose: replace the vague "story" framing with a concrete production story.

Working label:

- `Nasze mięso`
- or `Jak robimy mięso`

Recommendation:

Use `Jak robimy mięso` as the public heading because it is clearer, more useful, and more specific.

### 6. Sauces Section

Purpose: keep brand flavor and personality while improving mobile readability.

Content stays, but layout becomes lighter and better stacked on small screens.

### 7. Contact Section

Purpose: final conversion area for users who scroll.

Content:

- address
- phone
- hours
- route CTA
- local trust framing

### 8. Footer

Repeat:

- phone
- address
- hours
- social links

### 9. Future-ready Content Structure

The code should be prepared so that:

- `menu` data can later be managed by the owner
- `news/aktualności` can later be added as owner-managed content

At this stage:

- no public editor
- no public admin panel
- no visible news section required
- only internal structural separation in code and content models

## UX Requirements

### Mobile-first

- mobile layout is the primary target
- sticky bottom action bar on mobile with:
  - `Zadzwoń`
  - `Trasa`
- all tap targets at least `44x44`
- no horizontal overflow
- improved mobile hamburger experience

### Navigation

Remove the `Voice` item from navigation and from all public content.

### Menu UX

The menu and sauce sections must stack naturally on small screens and avoid dense card walls above the fold.

## Visual System Rules

- retain dark premium branding
- use subtle translucent panels
- use `backdrop-blur`
- use `border-white/10`
- use controlled shadow and depth
- avoid loud SaaS-style gradients
- avoid over-decorated glassmorphism

## Accessibility Requirements

- semantic HTML structure
- correct heading hierarchy
- meaningful `aria-label` usage
- maintain strong text contrast
- keyboard-safe interactive elements
- touch-safe spacing and tap areas

## Performance Requirements

- no delayed above-the-fold content rendering
- avoid CLS in hero
- eager/high-priority loading for hero-critical media
- lazy loading for non-hero images
- avoid unnecessary client-side complexity in the first viewport

## Content Rewrite Direction

### Hero Copy Tone

Short, concrete, local, confident.

Avoid:

- manifesto-style long copy
- speculative language
- product-demo language

Prefer:

- direct service language
- place-based trust
- production credibility

### Example Tone

Good direction:

- rzemieślnicze mięso
- autorski lawasz
- zamów telefonicznie i odbierz na miejscu

Bad direction:

- future ordering
- voice commerce
- prototype-ready

## Technical Implementation Direction

The redesign should keep the current React/Vite base but reorganize the page into clearer, maintainable sections. Content arrays should be separated in a way that makes later owner-controlled content possible without rewriting the whole landing.

Recommended implementation shape:

- simplify hero composition
- remove voice-specific content and data
- split page into clearer content sections
- prepare standalone data structures for:
  - featured menu items
  - full menu groups
  - hours
  - trust points
  - future news placeholders

## Out of Scope For This Pass

- owner admin panel
- CMS integration
- authentication
- live content editing
- public aktualności section
- ordering platform integration

## Acceptance Criteria

The redesign is successful when:

1. the page no longer mentions voice, prototypes, or future commerce language
2. the first screen clearly exposes call, route, address, phone, and hours
3. the hero is cleaner and more conversion-focused
4. the mobile sticky bottom bar exists and works
5. the page feels premium and local rather than technical or experimental
6. the structure is ready for later owner-managed menu and aktualności content
