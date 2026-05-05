# Development Workflow

## Approach

Build this project incrementally using a spec-driven workflow. Context files define what to build, how to build it, and what the current state of progress is. Always implement against these specs — do not infer or invent behavior from scratch.

## Scoping Rules

- Work on one feature slice or subsystem at a time.
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated FSD layers or slices in a single implementation step.

## When To Split Work

Split an implementation step if it combines:

- Changes across more than two FSD layers simultaneously
- UI changes and data model changes
- Multiple unrelated features or entities
- Behavior that is not clearly defined in the context files

If a change cannot be verified end to end quickly, the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior that is not defined in the context files.
- If a requirement is ambiguous, resolve it in the relevant context file before implementing.
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing.

## Protected Foundation Components

Do not modify generated third-party foundation components unless explicitly instructed.

This includes:

- `src/shared/ui/*` (shadcn/ui components added via CLI)
- Third-party library internals

Project-specific styling, layout changes, and feature logic must be implemented in slice components, not by modifying foundation components. Only touch `src/shared/ui/` when a task explicitly requires it.

## Keeping Docs In Sync

Update the relevant context file whenever implementation changes:

- System architecture, boundaries, or FSD slice structure → `architecture-context.md`
- Storage model or data model decisions → `architecture-context.md`
- UI tokens, layout patterns, or component conventions → `ui-context.md`
- Code conventions or tooling → `code-standards.md`
- Feature scope → `project-overview.md`

Progress state must reflect the actual state of the implementation, not the intended state.

---

## Git Workflow

### Branches

- `main` is protected — direct pushes are forbidden. All changes go through pull requests.
- Create a branch before starting any implementation work.
- Branch naming follows the pattern: `<type>/<short-description>`

| Type       | When to use                              |
| ---------- | ---------------------------------------- |
| `feat/`    | New feature or slice                     |
| `fix/`     | Bug fix                                  |
| `refactor/`| Restructure without behavior change      |
| `chore/`   | Tooling, config, deps, non-product work  |
| `docs/`    | Context file or documentation updates    |

Examples: `feat/create-microcycle`, `fix/srpe-calculation`, `chore/biome-setup`

### Commit Format

Every commit must follow **Conventional Commits**:

```
<type>(<scope>): <short description>
```

- Type: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`
- Scope: FSD slice or subsystem (optional but recommended)
- Description: lowercase, imperative, no period

```bash
# Good
feat(microcycle): add create microcycle bottom sheet
fix(session): derive sRPE from duration at read time
refactor(entities/player): extract player row to ui segment
chore: configure ultracite biome
docs: update architecture-context with views layer

# Bad
Added microcycle form
fix bug
WIP
```

The AI must propose the commit message before committing and confirm it matches the format above.

### Pull Requests

- One PR per feature unit or fix — match the scope of a single implementation step.
- PR title follows the same Conventional Commits format as the commit messages.
- PR description must include: what changed, which context files were updated (if any), and how to verify.

### AI Git Responsibilities

The AI must:

1. Propose a branch name before starting implementation work on a new unit.
2. Write commit messages in Conventional Commits format — never freeform.
3. Never push directly to `main`.
4. Flag if a commit would mix unrelated concerns — split it instead.

---

## Before Moving To The Next Unit

1. The current unit works end to end within its defined scope.
2. No invariant defined in `architecture-context.md` was violated.
3. `pnpm check` and `pnpm typescript` pass with no errors.
4. All changes are committed with a valid Conventional Commits message.
5. A pull request is open for the completed branch.
6. `progress-tracker.md` reflects the completed work.
