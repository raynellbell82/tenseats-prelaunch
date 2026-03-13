---
phase: 13
slug: city-persona-copy
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-13
---

# Phase 13 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler (tsc) — no unit test framework for copy data |
| **Config file** | tsconfig.json |
| **Quick run command** | `npx tsc --noEmit 2>&1 | head -30` |
| **Full suite command** | `npm run build 2>&1 | tail -20` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx tsc --noEmit 2>&1 | head -30`
- **After every plan wave:** Run `npm run build 2>&1 | tail -20`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 13-01-01 | 01 | 1 | DATA-01 | type check | `npx tsc --noEmit` | tsconfig.json | pending |
| 13-01-02 | 01 | 1 | DATA-01 | count | `grep -c 'role: "' lib/city-data.ts` (expect 192) | lib/city-data.ts | pending |
| 13-01-03 | 01 | 1 | COPY-01 | smoke | `npm run build` | next.config.ts | pending |
| 13-01-04 | 01 | 1 | COPY-03 | lint-style | `grep -n "amazing\|incredible\|unique\|best-in-class\|world-class" lib/city-data.ts` | lib/city-data.ts | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.* No new test files needed; DATA-01 is verified by counting role entries in the source file. TypeScript compiler catches role type violations at build time.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| City-specific cultural references | COPY-02 | Requires human judgment on local accuracy | Read persona descriptions for 5 sample cities; verify they name specific neighborhoods, scenes, or operators |
| Brand voice compliance | COPY-03 | Beyond forbidden-word grep; tone/register is subjective | Spot-check 10 random entries against brand-voice.md patterns |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
