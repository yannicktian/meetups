---
title: Harness engineering — the trend
topic: trend
audience_level: all
sources:
  - https://www.latent.space/p/harness-eng
---

# Harness Engineering

## The article

**Published:** April 7, 2026 (latent.space)
**Title:** *Harness Engineering*
**Source:** https://www.latent.space/p/harness-eng

This article gave the talk its hook. It argues that **harness engineering is replacing context engineering** as the next discipline for AI development.

## Three years, three paradigms

| Year | Paradigm | The question |
|------|----------|--------------|
| 2023 | **Prompt engineering** | *"How do I make the model follow my instructions?"* |
| 2024-25 | **Context engineering** | *"How do I give the model the right context to succeed?"* |
| 2026 | **Harness engineering** | *"What capability, context, or structure is missing?"* |

## The killer quote

> **"When the agent failed, instead of prompting it better or to 'try harder,' the team would look at: what capability, what context, what structure is missing?"**
> — Harness Engineering, latent.space

This encapsulates the paradigm shift. Instead of tweaking prompts, harness engineering asks structural questions about the agent's environment.

## The scarcity reframe

The article's other big idea: **the bottleneck is no longer tokens — it's human attention.**

> "The only fundamentally scarce thing is the synchronous human attention of my team."
> — latent.space

Implications:
- Models are now capable enough that the bottleneck shifted from token cost to human review cycles
- Harness engineering removes humans from synchronous loops
- Code review, merging, observability setup → become agent-owned

## Three paradigm shifts the article identifies

### 1. From scaffolding to reasoning

Old approach: predefined scaffolds force agents into predetermined state machines.

New approach:
> "Give it a bunch of options for how to proceed with enough context for it to make intelligent choices."

The harness provides options + context, and the model picks. Less rigid. More autonomous.

### 2. Code as disposable, systems as permanent

With cheap parallel execution and rework loops, **the codebase becomes ephemeral**. What persists:

- Observability stack
- Spec documents
- Skill definitions
- The harness itself

Human-written source code is no longer the durable artifact. The infrastructure for agent autonomy is.

### 3. Software written for agents, not humans

> "Increasingly needs to be written for the model as much as for the engineer."

Repository structure, CLI design, documentation — all optimize for **agent legibility** (text-heavy, deterministic, structured) rather than human readability.

## Why now specifically

Three factors converged:

1. **Model capability** — Codex now handles million-line codebases and complex task decomposition
2. **Cost efficiency** — Tokens cheap enough that parallel execution + rework loops economically beat human review
3. **Observability maturity** — Open-source stacks (Victoria, Temporal, Prometheus) run locally, giving agents full-loop visibility without cloud dependencies

## The harness as boundary object

The article frames the harness as the **interface layer that makes agent-native development possible**:

- Skills (reusable, observable primitives)
- Specs (ghost libraries that encode requirements)
- Fast feedback loops (sub-minute builds enforcing discipline)
- Autonomous systems (code review, merging, dashboard updates all delegated)

## Why the talk references this article

The article was published two days before the talk. It validates the talk's thesis from an external, authoritative source — and gives the audience a name for the trend they may have been seeing without knowing what to call it.

The slide in the talk that uses this article shows the 3-year progression and the killer quote about *"what capability, what context, what structure is missing?"*

## Key takeaway

Harness engineering is the discipline of building **the structure around the model** so the model can make intelligent choices on its own. It's the natural successor to prompt engineering and context engineering as the bottleneck moves up the stack.
