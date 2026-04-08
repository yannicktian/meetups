---
title: Talk thesis and narrative arc
topic: meta
audience_level: all
---

# 2026: The Year of Harnesses

## The thesis

> **Harnesses are the next paradigm for AI-native products. Claude Code is the canonical example. Mastra named the primitive. Every domain that has a product can have a harness.**

## Why now (April 2026)

Three independent signals converged:

1. **Anthropic** ships the Claude Agent SDK — explicitly framed as *"the same tools, agent loop, and context management that power Claude Code,"* programmable in Python and TypeScript
2. **Mastra** ships the `Harness` class as the core orchestration primitive of the framework (Feb 2026)
3. **latent.space** publishes *"Harness Engineering"* — argues that harness engineering is replacing context engineering as the next frontier for AI development (April 2026)

The pattern existed before. The name and the primitive arrived together. That's why now.

## Narrative arc (~25 minutes)

**Intro (5 min)** — Set the frame
- Hero: title, event context, hosts
- Speaker bio
- Show of hands: who uses Claude Code? You're using a harness.
- Harness Engineering: 3 paradigms in 3 years (prompt → context → harness)

**Act I — The Journey (5 min)** — Quick context, evidence
- Gojob context
- Alpha (recruiter assistant): SMS demo + 3M conversations stat + the 80/20 lesson
- SaaS pivot — onboarding pain

**Act II — The In-App Agent (5 min)** — What we shipped
- An agent inside the product
- Live mockup: streaming prerequisite suggestions
- Architecture: Mastra + RAG + MCP
- How streaming structured output to React works

**Act III — The Realization (8 min)** — The harness pattern
- Claude Code quote (Anthropic)
- Claude Code anatomy (6 pillars)
- Mastra Harness quote
- The 6 pillars of a harness
- Mastra's `new Harness(...)` code
- Building Ernest in 48 hours (hackathon code)
- Typed state foundation
- Tools = product features
- Phase-aware instructions
- Multi-round iteration
- Reliability layer (production concerns)

**Act IV — The Vision (4 min)** — What this changes
- The death of menus (old vs new UI comparison)
- Intent first
- Your harness today (grid of examples)
- Closing CTA: 2026 is the year of harnesses

## Key messages the audience should leave with

1. The harness pattern has a name now, and it's a primitive in modern frameworks
2. Building harnesses is no longer experimental — there are production references (Claude Code, Mastra, Gojob)
3. The hard part isn't the AI — it's the reliability layer: state, observability, multi-tenant, multi-provider
4. Every domain that has a product can have a harness — not just coding
5. Old menu-driven UIs are dying. Agents capture intent. UI is what the harness chooses to show.

## Tone

Conference keynote — bold, expressive, confident. English slides, French delivery. Mixed audience: AI-savvy devs and curious less-experienced devs. Storytelling first, code as supporting evidence.
