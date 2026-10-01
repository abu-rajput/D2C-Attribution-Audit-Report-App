# CMGalaxy — 12-Point D2C Attribution Audit

> **"The goal is not a vanity score — it is to find where reporting disagreement could influence budget decisions."**

A production-grade, high-converting interactive diagnostic experience built for **CMGalaxy** as a flagship GTM marketing lead magnet. Designed for D2C growth leaders, VP of Marketing, and founders to uncover where Meta, Google, and Shopify reporting diverge, and which attribution gaps directly risk marketing capital.

---

## 🎯 Strategic & Business Objectives

1. **Not a Consumer Quiz**: Strictly designed as a serious enterprise SaaS diagnostic tool. Zero gamification, zero vanity scores (no arbitrary 0–100% or "7/12" scores).
2. **Actionable Classification**: Categorizes reporting integrity across 4 core statuses:
   - `✓ RELIABLE`: Tracking and reporting broadly reconcile.
   - `◐ INVESTIGATE`: Numbers differ, but the underlying reason may be understood.
   - `! ATTRIBUTION GAP`: The disagreement could materially affect marketing budget allocation.
   - `? UNKNOWN`: The team cannot currently verify or answer with confidence.
3. **Budget Impact Weighted**: Internal priority scoring evaluates decision risk (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) to surface what matters most to executive leadership.
4. **Frictionless Lead Capture**: Report delivery is framed as delivery rather than gated capture ("Your personalized report is ready"). Lead info is captured alongside full question-by-question analysis, attribution status, and UTM parameters for Sales.

---

## 🏗️ Architecture & Component Overview

```
d2c/
├── index.html            # Semantic HTML5 application shell with 5 view states
├── package.json          # Project configuration & npm scripts
├── css/
│   ├── tokens.css        # CMGalaxy Design System tokens (Onest typography, #161C52 Navy, #34C759 Green)
│   ├── main.css          # App layout, responsive grid, landing page, footer
│   ├── audit.css         # Full-screen audit interface, cards, progress bar
│   └── report.css        # Personalized report, 4 summary cards, priority cards
├── js/
│   ├── auditData.js      # Source of truth: 12 questions, categories, answer cards
│   ├── rulesEngine.js    # Decoupled rules engine & configurable question map
│   ├── api.js            # Mock API service layer (sessions, leads, email, CRM sync)
│   ├── tracking.js       # UTM capture, session persistence, GTM dataLayer events
│   └── app.js            # Master application state controller & UI renderer
└── assets/
    └── og-attribution-audit.svg # Social sharing vector card & branding assets
```

---

## 🔄 Five Interactive Application States

1. **State 1 — Landing Page**:
   - Above-the-fold hero with eyebrow pill, clear copy, and single primary CTA.
   - Educational problem visual showing Meta vs Google vs Shopify claim conflicts.
   - 3-step "How It Works" visual: **01 Answer → 02 Analyse → 03 Act**.
   - Resume banner when returning users have an in-progress audit or generated report.
2. **State 2 — Interactive 12-Question Audit**:
   - Single-question focus interface with animated progress bar and category markers.
   - Large touch-accessible answer cards: **Yes**, **Partly**, **No**, **Don't know**.
   - Keyboard accessible (`1–4` to select, `Enter` to advance, `←` to go back).
   - Preserves answers across navigation and browser refresh via `localStorage`.
3. **State 3 — Completion & Lead Delivery**:
   - Transition screen signaling the audit is analyzed and ready.
   - Inline validated lead capture (Full Name, Work Email, Company).
   - Async loading states with simulated processing latency.
4. **State 4 — Personalized Diagnostic Report**:
   - Instant reveal without waiting for email.
   - 4 Dynamic Summary Cards (**Reliable**, **Investigate**, **Attribution Gaps**, **Unknown**).
   - **Your Biggest Finding** dynamic strategic narrative synthesized from responses.
   - Priority Findings ranked by **Budget Decision Impact** and **Attribution Status**.
   - Filter tabs: `All (12)`, `Attribution Gaps`, `Investigate`, `Unknown`, `Reliable`.
   - Actionable cards detailing **Why It Matters**, **What To Investigate**, and the source diagnostic prompt.
   - **Three Post-Audit Business Questions** for team alignment.
5. **State 5 — CMGalaxy Conversion CTA & Sales Intelligence**:
   - Direct CTA to review attribution gaps with a CMGalaxy specialist.
   - Interactive Consultation / Demo booking modal.
   - **Built-in Sales & CRM Data Inspector Drawer**: inspects the exact JSON payload, UTM tags, answers array, and lead record generated for HubSpot/Salesforce before sales outreach.
   - Executive PDF Print view (`Ctrl/Cmd + P`) clean stylesheet.

---

## 📊 Configurable Rules Engine (`js/rulesEngine.js`)

The rules engine decouples diagnosis logic from UI components:

```javascript
export const QUESTION_RULES = {
  1: { budgetImpact: 'HIGH', answerMap: { yes: 'RELIABLE', partly: 'INVESTIGATE', no: 'ATTRIBUTION_GAP', dont_know: 'UNKNOWN' } },
  4: { budgetImpact: 'HIGH', answerMap: { yes: 'RELIABLE', partly: 'INVESTIGATE', no: 'ATTRIBUTION_GAP', dont_know: 'UNKNOWN' } },
  12: { budgetImpact: 'CRITICAL', answerMap: { yes: 'RELIABLE', partly: 'INVESTIGATE', no: 'ATTRIBUTION_GAP', dont_know: 'UNKNOWN' } },
  // ... fully configurable per question
};
```

### Priority Ranking Formula
$$\text{SortScore} = \text{Weight}(\text{BudgetImpact}) + \text{Weight}(\text{Status}) + \text{Weight}(\text{QuestionPriority})$$

- `CRITICAL`: 400 pts | `HIGH`: 300 pts | `MEDIUM`: 200 pts | `LOW`: 100 pts
- `ATTRIBUTION_GAP`: 40 pts | `INVESTIGATE`: 30 pts | `UNKNOWN`: 20 pts | `RELIABLE`: 10 pts

---

## 📈 GTM / Analytics Events (`window.dataLayer`)

Enforces strict **No-PII** policies:

- `audit_landing_view`
- `audit_started`
- `audit_question_viewed`
- `audit_question_answered`
- `audit_completed`
- `lead_form_viewed`
- `lead_form_submitted`
- `report_viewed`
- `finding_expanded`
- `cmgalaxy_cta_clicked`
- `deeper_analysis_clicked`
- `cmgalaxy_signup_started`
- `cmgalaxy_signup_completed`

---

## 🚀 How to Run Locally

### Option 1: Standard Python HTTP Server
```bash
python3 -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080).

### Option 2: XAMPP Apache
Since this folder is inside `/Applications/XAMPP/xamppfiles/htdocs/d2c`, if your local Apache is started, visit:
```
http://localhost/d2c/
```

### Option 3: Webflow Embed
The HTML, CSS, and JS modules are completely self-contained without npm build tooling dependencies. You can embed the markup into a Webflow page code block or host the assets on a CDN.
