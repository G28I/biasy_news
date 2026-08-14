# PostHog Self-driving Setup Report

Generated: 2026-08-14

## Summary

PostHog Self-driving is now configured for **biasly** (project 248356). Session Replay, Error Tracking, and Support sources are wired up; a 5-scout troop is active; and two Replay Vision scanners are watching article detail sessions and rage-click sessions. Findings will start appearing in the [Self-driving inbox](https://eu.posthog.com/project/248356/inbox) within ~30 minutes of the first scout runs.

---

## AI Data Processing

**Status:** Approved — the wizard enforces organization-level AI data processing approval before setup starts.

---

## GitHub

**Status:** Connected during this run.
- Integration ID: 78040
- Account: G28I
- Connected at: 2026-08-14T13:53:47Z

Self-driving can now research findings against your code and open fix PRs.

---

## Products Enabled

The `products-enable` MCP tool was not available on this deploy. The posthog-js init (`instrumentation-client.ts`) was inspected and is correctly configured — no overrides suppress replay or error tracking.

| Product | Server Status | Client Init |
|---|---|---|
| Session Replay | Follow-up: enable in Settings → Session replay | No `disable_session_recording` found ✓ |
| Error Tracking | Follow-up: enable in Settings → Error tracking | `capture_exceptions: true` ✓ |
| Support (Conversations) | Follow-up: enable in PostHog sidebar | Inert until inbound channel connected |

**Note on Support:** Conversations tickets only arrive once an inbound channel (email, inbox, or Slack) is connected in PostHog. See Follow-ups.

---

## Signal Sources

| source_product | source_type | Action |
|---|---|---|
| `health_checks` | `health_issue` | Enabled (new) — ID `01a0008e-7b52-7f7c-a02c-ca3358d81f16` |
| `error_tracking` | `issue_created` | Enabled (new) — ID `01a0008e-7f1c-73a2-b684-6dfcd9c05127` |
| `error_tracking` | `issue_reopened` | Enabled (new) — ID `01a0008e-81df-76f0-b3b4-d09aa8e8676e` |
| `error_tracking` | `issue_spiking` | Enabled (new) — ID `01a0008e-8470-72af-b895-8c73a1a040df` |
| `session_replay` | `session_analysis_cluster` | Enabled (new) — ID `01a0008e-86ff-74f9-b682-b4cd5b374473`, sample rate 10% |
| `conversations` | `ticket` | Enabled (new) — ID `01a0008e-8d99-75dc-b3ef-cec0de6c59b1` (dormant until channel connected) |
| `signals_scout` | `cross_source_issue` | On by default — no row needed |
| `replay_vision` | — | Self-authorizing via scanner `emits_signals` — no source row created |

---

## Connected Tools

No external tools were selected.

| Tool | Status |
|---|---|
| GitHub Issues | Not used (not selected) |
| Linear | Not used (not selected) |
| Jira | Not used (not selected) |
| Sentry | Not used (not selected) |
| Zendesk | Not used (not selected) |

---

## Scout Troop

**Run budget:** 100 runs/day (early-access default); 0 used today. Banner: "Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more."

### Enabled (5 scouts)

| Scout | Why enabled |
|---|---|
| `signals-scout-general` | Always on — cross-product correlations and surfaces no specialist covers |
| `signals-scout-ai-observability` | AI-first product (`@ai-sdk/groq`, `@huggingface/transformers`) — watches LLM cost, latency, error, and volume regressions |
| `signals-scout-health-checks` | Fresh setup — watches PostHog health issues and files the ones worth acting on |
| `signals-scout-product-analytics` | `posthog-js` instrumented — watches saved funnel/retention/lifecycle flows for conversion regressions |
| `signals-scout-web-analytics` | News website — watches per-channel session volume, attribution breakage, and landing-page health |

### Disabled (22 scouts)

| Scout | Reason |
|---|---|
| `signals-scout-error-tracking` | Covered by the native error tracking source (step 4) |
| `signals-scout-session-replay` | Covered by the native session replay source (step 4) |
| `signals-scout-experiments` | No A/B experiments detected — re-enable if experiments are added |
| `signals-scout-feature-flags` | No confirmed active feature flag usage — re-enable if flags are in active use |
| `signals-scout-surveys` | No surveys in use |
| `signals-scout-revenue-analytics` | No payment SDK detected |
| `signals-scout-logs` | PostHog logs product not in use |
| `signals-scout-csp-violations` | No CSP reporting configured |
| `signals-scout-customer-analytics` | Not a B2B group analytics product |
| `signals-scout-data-pipelines` | No CDP destinations or batch exports |
| `signals-scout-data-warehouse` | No external data warehouse sources |
| `signals-scout-apm` | No distributed tracing / OpenTelemetry spans |
| `signals-scout-anomaly-detection` | Not enabled — can be added later if dashboards and insights grow |
| `signals-scout-observability-gaps` | Deferred in favour of tighter specialists |
| `signals-scout-replay-vision` | Needs accumulated observations — re-enable after scanners have run for a few days |
| `signals-scout-conversations` | Conversations not yet connected to an inbound channel |
| `signals-scout-inbox-validation` | Fresh setup — no shipped fixes to validate yet |
| `signals-scout-insight-alerts` | No insight alerts configured |
| `signals-scout-mcp-tool-calls` | No `$mcp_tool_call` telemetry detected |
| `signals-scout-skills-store` | Not a priority for this project |
| `signals-scout-tasks` | Not a primary surface |
| `signals-scout-web-vitals` | Deferred — re-enable if Core Web Vitals data (`$web_vitals`) starts flowing |

---

## Custom Scouts

Two custom scouts were proposed and declined (user selection included "None"):

| Scout | Surface | Why proposed | Why not created |
|---|---|---|---|
| Article click-through | Home → article detail `$pageview` ratio | Neither web-analytics (session-level) nor product-analytics (needs saved funnels) watches this page-to-page conversion | Declined by user |
| Auth funnel | Sign-up/sign-in page views vs `$identify` events | No enabled scout watches Clerk auth conversion | Declined by user |

**Noise escape hatch:** If any scout turns noisy in future, set `emit: false` on its config in PostHog → Self-driving → Scouts to switch it to dry-run mode.

---

## Replay Vision Scanners

Replay Vision scanners are LLMs that watch **individual session recordings** on a schedule and push what they find straight to the Self-driving inbox. They are the only part of this setup that spends Replay Vision quota. Findings arrive at half weight and need corroboration before they're promoted into a full inbox report.

This project has no recordings yet — both scanners are armed and will start working the day recordings begin.

The `creating-replay-vision-scanners` sizing skill was unavailable on this deploy — credit spend was not verified. At `sampling_rate: 0.5` (scanner 1) and `sampling_rate: 1.0` gated on `$rageclick` (scanner 2), projected spend is negligible until recording volume grows.

| Scanner | Status | Query scope | Sampling rate | Estimated credits/month |
|---|---|---|---|---|
| **Broken experiences** | Created — ID `01a00097-a807-74b1-a1d5-b5363adda35a` | `$current_url` icontains `/article/` (article detail pages — the completion flow where silent breakage costs the most) | 0.5 | 0 (no recordings yet) |
| **User frustration** | Created — ID `01a00097-b7b0-7e1e-8576-b8caf9da31f5` | Sessions with a `$rageclick` event (site-wide, disjoint from scanner 1 by filter axis) | 1.0 | 0 (no recordings yet) |

**Why `/article/` is the completion flow:** The route at `app/article/[id]/page.tsx` is where users land after clicking a news card on the home page. It shows the full AI analysis — sentiment score, political framing breakdown, bias label, and related articles. A silent defect here (failed analysis load, broken bias chart, blank summary) is the highest-cost failure in the product.

---

## Follow-ups

- [ ] **Enable Session Replay** — PostHog → Settings → Session replay → "Record user sessions" → ON
- [ ] **Enable Error Tracking (Exception Autocapture)** — PostHog → Settings → Error tracking → "Enable exception autocapture" → ON
- [ ] **Enable Support (Conversations)** — PostHog → product sidebar → Support → ON
- [ ] **Connect a Support inbound channel** — PostHog → Support → Channels → connect email, inbox, or Slack so tickets reach the Self-driving inbox
- [ ] **Verify Replay Vision credit spend** once recordings exist — run `vision-quota-retrieve` and `vision-scanners-estimate-create` against the live scanner IDs to confirm projected spend fits the org budget
- [ ] **Enable `signals-scout-experiments`** in PostHog → Self-driving → Scouts if A/B experiments are added
- [ ] **Enable `signals-scout-feature-flags`** if feature flags are actively used in production
- [ ] **Enable `signals-scout-replay-vision`** after the Replay Vision scanners have accumulated a few days of observations
- [ ] **Revisit custom scouts** — two proposals (article click-through, auth funnel) were declined; re-run setup or create them manually from PostHog → Self-driving → Scouts → New scout if desired

---

## What Happens Next

1. The scout coordinator picks up the new configs within **~30 minutes** — the first scout runs fire then.
2. Each run draws from the **100 runs/day** early-access budget (shared across all 5 enabled scouts).
3. Findings cluster into reports in the [Self-driving inbox](https://eu.posthog.com/project/248356/inbox); actionable ones can automatically start coding tasks via the GitHub integration.
4. Replay Vision scanners activate the moment the first session recording arrives.
