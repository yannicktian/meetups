# Knowledge Base

This directory contains the source material for the meetup talk *"2026: The Year of Harnesses"* — research, code references, quotes, and context. It's structured for a future Q&A agent that can answer audience questions about the talk's topics.

## Structure

| File | Purpose |
|------|---------|
| [`00-talk-thesis.md`](./00-talk-thesis.md) | Core argument, narrative arc, key messages |
| [`01-event-context.md`](./01-event-context.md) | The meetup itself: date, hosts, format |
| [`02-speaker-bio.md`](./02-speaker-bio.md) | Yannick Tian — background, role at Gojob |
| [`03-claude-code-architecture.md`](./03-claude-code-architecture.md) | Claude Code as the canonical harness — Anthropic's framing |
| [`04-mastra-harness-primitive.md`](./04-mastra-harness-primitive.md) | Mastra's official `Harness` class — full API and rationale |
| [`05-harness-engineering-trend.md`](./05-harness-engineering-trend.md) | The latent.space article that named the pattern |
| [`06-alpha-recruiter-assistant.md`](./06-alpha-recruiter-assistant.md) | Alpha — Gojob's first AI in production, 3M conversations |
| [`07-aglae-in-app-agent.md`](./07-aglae-in-app-agent.md) | The In-App Agent — Mastra + RAG + MCP + streaming UI |
| [`08-kitsune-hackathon.md`](./08-kitsune-hackathon.md) | Ernest — recruiter harness built in 48 hours |
| [`09-harness-pattern-anatomy.md`](./09-harness-pattern-anatomy.md) | The six pillars + reliability layer + production concerns |
| [`10-faq.md`](./10-faq.md) | Anticipated audience questions with answers |
| [`11-references.md`](./11-references.md) | All source URLs, quotes, citations |

## Conventions

- All files start with a short summary so an agent can retrieve them by topic
- Direct quotes are marked with `>` blockquotes and include attribution
- Code examples come from real production projects (Gojob Aglae SaaS, Kitsune hackathon, public Mastra/Anthropic docs)
- Dates use ISO format (YYYY-MM-DD) where possible

## For the future Q&A agent

This knowledge base is designed to be loaded as MCP resources or skill markdown files. Each file is self-contained and can be retrieved independently based on the user's question. The agent should be able to answer:

- "What is a harness?" → 09-harness-pattern-anatomy.md, 03, 04
- "How does Claude Code work?" → 03-claude-code-architecture.md
- "What did Gojob ship?" → 06, 07
- "What's harness engineering?" → 05-harness-engineering-trend.md
- "Who built this?" → 02-speaker-bio.md
- "What's the difference between context engineering and harness engineering?" → 05
- "How does the prerequisite agent stream output?" → 07
