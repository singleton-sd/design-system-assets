# Agent Working Agreements

This file contains cross-agent instructions intended to be reused by any AI
agent (Cursor, Claude Code, Codex CLI, etc.) working in this repository.

## ClickUp Default Destination

When creating ClickUp tasks for this repository, default to:

- Workspace: `Workspace` (`90161394355`)
- List: `Design System - Singleton`
- List ID: `901614701551`
- Ticket prefix: `DS`

Only ask for a different destination if the user explicitly requests a
different space/folder/list.

## Required Step Before Creating ClickUp Tasks

Before creating a task, read `config/clickup-defaults.json` and use those
values as defaults.

## Design System List Statuses

Use statuses that exist on the Design System list (for example `to do`,
`in progress`). Prefer the list's native workflow over inventing new names.

## Commit Message Rules Source

Commit message conventions for this repository are maintained in the dedicated
commit-message skill at
`skills/engineering/git-conventions/SKILL.md` in the `singleton-sd/ai-plattform`
repository. Agents should use that skill as the source of truth.

Fallback only when skill access is unavailable:

- Subject length: 50 chars max
- Ticket required in subject (for example `DS-31`)
- Format: `type: DS-N Description in sentence case`

## Related docs

This package is the source of truth for **logo/favicon/OG binaries**. Token **values** live in `@singleton-sd/tokens`. Penpot is the style-guide home.

- Brand usage: [BRAND.md](BRAND.md)
- Public CDN: https://assets.singletonsd.com
- Tokens operating manual: [AGENTS.md](https://gitlab.com/singleton-sd/design-system/tokens/-/blob/main/AGENTS.md) · [docs/FOUNDATIONS.md](https://gitlab.com/singleton-sd/design-system/tokens/-/blob/main/docs/FOUNDATIONS.md)
- Figma is deprecated: [FIGMA-DEPRECATED.md](https://gitlab.com/singleton-sd/design-system/tokens/-/blob/main/docs/FIGMA-DEPRECATED.md)
- Tokens gallery/agent identity: [DESIGN.md](https://gitlab.com/singleton-sd/design-system/tokens/-/blob/main/DESIGN.md)
- Tokens gallery: https://tokens.design.singletonsd.com/
- Local sibling checkout: `../tokens/`
