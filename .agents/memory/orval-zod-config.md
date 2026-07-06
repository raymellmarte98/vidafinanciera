---
name: Orval zod output collision fix
description: How to fix TS2308 *Params name collision between Zod schema and TypeScript types in api-zod when orval regenerates barrel files.
---

## The Rule

Remove `schemas` and `workspace` from the `zod` output block in `lib/api-spec/orval.config.ts`. Use an absolute `target` path instead. Manually maintain `lib/api-zod/src/index.ts` to only export from `./generated/api`.

**Why:** When `schemas: { path: "generated/types", type: "typescript" }` is set, Orval generates TypeScript interfaces AND Zod schemas with identical names (e.g. `GetArticleParams`). When `workspace` is set, Orval regenerates the barrel at `lib/api-zod/src/index.ts` re-exporting both — causing TS2308.

**How to apply:** Any time the api-spec codegen produces TS2308 collision errors on `*Params` names:
1. Remove `schemas: {...}` from the zod output config
2. Change `workspace: apiZodSrc, target: "generated"` → `target: path.resolve(apiZodSrc, "generated", "api.ts")`
3. Rewrite `lib/api-zod/src/index.ts` to only: `export * from "./generated/api";`
4. Re-run codegen — should pass cleanly

The TypeScript types are still accessible via `z.infer<typeof SomeZodSchema>` from the Zod schemas.
