# Go-live checklist — current status

| Gate | State | Requirement |
| --- | --- | --- |
| Static site, original supplied assets, unit/API tests, local build | PASS (local) | `npm ci`, check, lint, 29 tests (including 15 API tests and static-output checks) and build passed; 12 HTML pages and sitemap generated; local link/asset audit found no missing targets |
| Mobile/keyboard/accessibility and Lighthouse targets | BLOCKED | Browser audits on real preview and production; record actual scores |
| Cloudflare Pages Git-based project and PR preview | BLOCKED | Owner authorizes new repository and Cloudflare Git app |
| Preview and production D1/Turnstile | BLOCKED | Create isolated databases/widgets, bind secrets, test persistence and failure paths |
| Constant Contact investor subscription | BLOCKED | Approve real hosted opt-in and verify subscription |
| Company identity, licensing, Fair Housing and PA advertising disclosures | BLOCKED | Owner/legal review; populate `src/data/site.ts` |
| Privacy/terms/retention and contact mailbox | BLOCKED | Approve final notices, retention and test Proton email |
| Asset rights and final master logo comparison | BLOCKED | Owner confirms original marketing source and usage rights |
| DNS, mail records and custom domain | BLOCKED | Snapshot DNS, protect Proton/CC records, verify mail receipt after cutover |
| Synthetic production inquiry and D1 cleanup | BLOCKED | Verify real response, stored row and deletion |

Never mark production ready merely because the static build succeeds. SMS marketing remains disabled; no fabricated business address or offer claims should be added.
