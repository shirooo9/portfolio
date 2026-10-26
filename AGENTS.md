# Project Instructions — Personal Portfolio CMS

## 1. Source of Truth

- Read `PRD.md` before implementing any feature.
- Treat `PRD.md` as the primary product specification.
- Do not silently remove, replace, or weaken required features.
- If an implementation detail is unspecified, choose a sensible,
  secure solution consistent with the existing architecture.

## 2. Design Standards

- Follow the design directives defined in `PRD.md`.
- Use the installed Taste Skill when planning or implementing UI.
- Use Impeccable to review and refine visual quality.
- Apply React/Next.js best practices when writing application code.
- Use neutral colors, precise grids, thin borders, and restrained accents.
- Avoid generic AI-style gradients and unnecessary visual decoration.
- Make every page responsive and accessible.

## 3. Implementation Standards

- Inspect the existing repository before modifying files.
- Preserve working functionality and follow the existing project structure.
- Use TypeScript and validate external or user-provided data.
- Keep database/file operations on the server.
- Never expose secrets, admin credentials, or private file paths to the client.
- Protect all admin write operations with server-side authentication
  and authorization.
- Preserve JSON data integrity during CRUD and restore operations.
- Avoid unnecessary dependencies.

## 4. Working Workflow

1. Inspect the repository and identify the current implementation state.
2. Turn the PRD into a practical implementation checklist.
3. Implement features in small, testable stages.
4. Run the relevant lint, type-check, tests, and production build.
5. Fix failures introduced by the implementation.
6. Verify public pages and admin workflows in the browser when possible.
7. Update documentation when architectural decisions change.

## 5. Completion Criteria

- Never claim a feature is complete without checking its behavior.
- Never claim tests or builds passed unless they were actually run.
- Report completed features, verification results, known issues,
  and any remaining work.
- Do not silently substitute mock functionality for working features.
