---
title: Alpha — Gojob's recruiter assistant
topic: gojob-alpha
audience_level: all
---

# Alpha — Gojob's first AI in production

## What it is

Alpha is **Gojob's recruiter assistant** — an AI agent that prequalifies candidates via SMS. Built starting in 2023, deployed to production, and now the foundation of a SaaS product.

## What it does

For each job posting, Alpha:

1. Receives the job posting prerequisites (certifications, experience, language, availability, transportation, etc.)
2. Initiates an SMS conversation with each candidate
3. Asks each prerequisite question in natural language
4. Handles multi-turn back-and-forth (clarifications, follow-ups)
5. Either passes the candidate forward to a human recruiter, or filters them out with feedback

## The numbers

- **3,000,000+ conversations** in production
- **80% automation rate** — recruiters only see candidates Alpha couldn't fully prequalify
- **24/7 availability** — candidates get a response within seconds, day or night

## Customers

After Alpha proved itself internally at Gojob, it became the basis for a **white-label SaaS product** sold to major recruiting organizations:

- **France Travail** (the French national employment agency)
- **Persol** (large staffing group)
- Other temp work and recruiting companies

## The supervision system (the 80%)

The hard part wasn't building Alpha. It was making it production-ready.

The supervision system around Alpha includes:

| Component | Purpose |
|-----------|---------|
| **SMS Gateway** | Bidirectional messaging at scale |
| **Online scoring** | Real-time conversation quality scoring |
| **Offline evaluation** | Batch evaluation of conversation quality against ground truth |
| **Anomaly detection** | Flag conversations where Alpha drifts |
| **Recruiter dashboard** | Human review interface |
| **Human review queue** | Escalation path for ambiguous cases |
| **Feedback loop** | Failed cases feed back into training/prompts |

## The 80/20 lesson

> *"Building the AI was the easy 80%. Operating it was the other 80%."*

This is the talk's framing for Alpha. The lesson Yannick wants the audience to take away:

- Observability — know what the agent is doing at all times
- Control — catch the agent when it drifts
- Trust — confidence that when it doesn't drift, you can trust it
- Human in the loop — supervision system for anomaly detection
- Offline evaluation, online scoring, continuous monitoring

> *"Trust takes infrastructure, not just a good prompt."*

## Why Alpha is in the talk (briefly)

Alpha is **context, not the centerpiece**. It establishes:

1. Gojob has shipped real production AI (credibility)
2. Production AI is hard (the 80/20 lesson)
3. The story that led to building the In-App Agent (the next thing)

The talk spends ~3 minutes on Alpha — including a SMS conversation demo, the 3M stat, and the 80/20 callout.

## The next problem Alpha created

Alpha worked. It got sold as SaaS. But onboarding each new customer was painful:

- Understanding their specific recruiting needs took weeks
- Defining prerequisite questions for each job type required round-trips with management
- Customers couldn't self-serve

That pain is what motivated the In-App Agent (see [`07-aglae-in-app-agent.md`](./07-aglae-in-app-agent.md)).

## Tech stack notes

Alpha itself runs as a **Make scenario** (low-code workflow automation) wrapping the SMS conversation logic. The supervision system is custom code. Both feed into the SaaS product layer.

This is intentionally not described in detail in the talk — the focus is on the In-App Agent and the harness pattern. Alpha is just the credibility-establishing intro.
