This is the Vibe Cheque Next.js funding tool. The current MVP includes the original guided application flow and the project-checking workflow at `/grant-engine`.

## Vibe Cheque MVP

Vibe Cheque is an anti-slop project-development workflow for UK artists, CICs, and creative technologists. It does not draft immediately. It links a project to a grant, interrogates the missing evidence, then only drafts once every required gap is answered or marked not applicable.

Implemented MVP pieces:

- Supabase migration in `supabase/migrations/20260606120000_grant_engine_mvp.sql`
- `project_grants` join model for project-against-specific-grant work
- Fixed status values and a database trigger blocking `ready_to_draft` while required questions are unresolved
- Seeded local vertical slice through `/api/grant-engine`
- Draft guardrails for banned slop terms, vague claims, and unsupported entities/figures
- Fetcher payload contract through the `fetcher` API action

The API currently runs in seeded-memory mode when Supabase credentials are not configured. The migration is the database contract for Supabase deployment.

Server-side environment variables:

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
GRANT_ENGINE_WEBHOOK_SECRET=
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` switch the Vibe Cheque API from seeded-memory mode to Supabase mode. `ANTHROPIC_API_KEY` enables optional Claude drafting after the deterministic interrogation gate clears. `GRANT_ENGINE_WEBHOOK_SECRET` protects `POST /api/grant-engine/fetcher` when set.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
