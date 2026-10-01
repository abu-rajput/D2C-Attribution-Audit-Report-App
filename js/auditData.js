/**
 * CMGalaxy - 12-Point D2C Attribution Audit Data
 * Source of truth for questions, categories, options, and diagnostic guidance.
 */

export const AUDIT_CATEGORIES = [
  {
    id: 1,
    code: '01',
    name: 'Revenue & Conversion',
    questionRange: 'Questions 1–2',
    description: 'Verifying baseline financial and transaction alignment between ad channels and your commerce platform.'
  },
  {
    id: 2,
    code: '02',
    name: 'Attribution Setup',
    questionRange: 'Questions 3–4',
    description: 'Auditing lookback windows, claim overlap, and deduplication mechanics across paid channels.'
  },
  {
    id: 3,
    code: '03',
    name: 'Tracking Quality',
    questionRange: 'Questions 5–7',
    description: 'Ensuring signal fidelity, UTM consistency, Server-Side CAPI, and primary conversion definitions.'
  },
  {
    id: 4,
    code: '04',
    name: 'Commerce Reconciliation',
    questionRange: 'Questions 8–9',
    description: 'Reconciling order-level truth from Shopify against ad network claims and separating new vs repeat buyers.'
  },
  {
    id: 5,
    code: '05',
    name: 'Performance Measurement',
    questionRange: 'Questions 10–11',
    description: 'Standardizing CAC & ROAS definitions and inspecting multi-touch customer paths.'
  },
  {
    id: 6,
    code: '06',
    name: 'Decision Confidence',
    questionRange: 'Question 12',
    description: 'Evaluating whether reporting integrity is robust enough to validate real budget shifts.'
  }
];

export const ANSWER_OPTIONS = [
  {
    id: 'yes',
    label: 'Yes',
    helper: "We're confident.",
    icon: '✓'
  },
  {
    id: 'partly',
    label: 'Partly',
    helper: "There's some uncertainty.",
    icon: '◐'
  },
  {
    id: 'no',
    label: 'No',
    helper: 'We have a known issue.',
    icon: '!'
  },
  {
    id: 'dont_know',
    label: "Don't know",
    helper: "We can't verify this.",
    icon: '?'
  }
];

export const AUDIT_QUESTIONS = [
  {
    id: 1,
    number: 1,
    categoryId: 1,
    categoryName: '01 — Revenue & Conversion',
    title: 'Revenue match',
    question: 'Does total revenue claimed by Meta + Google make sense against actual Shopify revenue after allowing for attribution overlap?',
    whyItMatters: 'When ad channels collectively claim 120–150%+ of your gross Shopify revenue, your blended return metrics become inflated illusions. You risk allocating more capital to channels that are simply claiming credit for organic demand or each other\'s assists.',
    whatToInvestigate: 'Sum 30-day reported revenue across Meta Ads Manager and Google Ads. Compare this against Shopify Gross Sales (less returns). Calculate your Net Attribution Inflation ratio and establish an incremental baseline.',
    defaultBudgetImpact: 'HIGH'
  },
  {
    id: 2,
    number: 2,
    categoryId: 1,
    categoryName: '01 — Revenue & Conversion',
    title: 'Conversion match',
    question: 'Do Meta, Google, GA4 and Shopify broadly agree on the number and value of purchases?',
    whyItMatters: 'Discrepancies exceeding 15% between ad platform conversions, GA4 purchase events, and Shopify orders signal fundamental signal loss, ad blockers, or duplicate pixel firing. Inaccurate conversion counts mislead bidding algorithms.',
    whatToInvestigate: 'Cross-reference transaction IDs between Shopify order exports and GA4 purchase events. Audit Meta event deduplication scores and Google Ads enhanced conversion match rates over identical date windows.',
    defaultBudgetImpact: 'HIGH'
  },
  {
    id: 3,
    number: 3,
    categoryId: 2,
    categoryName: '02 — Attribution Setup',
    title: 'Attribution windows',
    question: 'Do you know which attribution windows Meta and Google are using when they report conversions?',
    whyItMatters: 'Comparing a 7-day click / 1-day view attribution window in Meta directly against a Google Ads data-driven or 30-day click model creates an unfair apples-to-oranges comparison, distorting cross-channel budget allocation.',
    whatToInvestigate: 'Document the exact reporting settings in Meta Ads Manager (e.g. 7d click + 1d view vs 1d click only) and Google Ads (account-level vs campaign attribution models). Align both to a standardized view for budget comparisons.',
    defaultBudgetImpact: 'MEDIUM'
  },
  {
    id: 4,
    number: 4,
    categoryId: 2,
    categoryName: '02 — Attribution Setup',
    title: 'Double attribution',
    question: 'Could Meta and Google both be claiming credit for the same Shopify order?',
    whyItMatters: 'If Meta and Google both receive credit for the same Shopify order, platform-reported performance may not provide a reliable basis for reallocating budget. Both algorithms will believe they drove the sale independently.',
    whatToInvestigate: 'Compare platform-reported conversions against Shopify orders and review the attribution rules being used. Implement order ID transaction deduplication in your central analytics layer.',
    defaultBudgetImpact: 'HIGH'
  },
  {
    id: 5,
    number: 5,
    categoryId: 3,
    categoryName: '03 — Tracking Quality',
    title: 'UTM hygiene',
    question: 'Are UTMs used consistently enough to trace paid traffic and revenue back to campaigns?',
    whyItMatters: 'Inconsistent UTM naming conventions (casing, campaign IDs, ad IDs, dynamic parameters) prevent your analytics engine from matching sessions to ad spend, creating "Direct" or "(Unassigned)" traffic black holes in GA4.',
    whatToInvestigate: 'Audit URL parameters across all active ad sets and ads in Meta and Google. Check for lowercase normalization, parameter casing, and automated parameter tracking templates.',
    defaultBudgetImpact: 'MEDIUM'
  },
  {
    id: 6,
    number: 6,
    categoryId: 3,
    categoryName: '03 — Tracking Quality',
    title: 'Meta tracking',
    question: 'Are Meta Pixel and Conversions API configured correctly, without obvious missing or duplicate purchase events?',
    whyItMatters: 'Improper deduplication between browser Pixel and server-side Conversions API (CAPI) can either double-count purchases or drop valid signal, causing Meta Advantage+ campaigns to optimize on flawed feedback loops.',
    whatToInvestigate: 'Check Meta Events Manager for Event Match Quality (EMQ) scores and deduplication rates on Purchase events. Ensure identical event_id and order_id parameters are passed from both client and server.',
    defaultBudgetImpact: 'HIGH'
  },
  {
    id: 7,
    number: 7,
    categoryId: 3,
    categoryName: '03 — Tracking Quality',
    title: 'Google tracking',
    question: 'Are Google Ads and GA4 purchase events configured correctly, with the right primary conversion actions?',
    whyItMatters: 'Having both GA4 imported purchases and direct Google Ads conversion tags active as "Primary" conversion actions causes Smart Bidding to double-count transactions and aggressively over-bid on brand search and PMax.',
    whatToInvestigate: 'Inspect Google Ads > Goals > Conversions. Verify that only one transaction source is marked as "Primary" for bidding, with Enhanced Conversions enabled and passing hashed user data.',
    defaultBudgetImpact: 'HIGH'
  },
  {
    id: 8,
    number: 8,
    categoryId: 4,
    categoryName: '04 — Commerce Reconciliation',
    title: 'Shopify reconciliation',
    question: 'Is actual order data from Shopify used to reconcile what advertising platforms claim?',
    whyItMatters: 'Ad platforms report gross orders without visibility into cancellations, fraud, refunds, or chargebacks. Optimizing marketing spend on phantom revenue leads to negative unit economics and cash flow strain.',
    whatToInvestigate: 'Build an automated reconciliation pipeline between Shopify webhook order status (specifically cancelled/refunded flags) and your ad reporting dashboard to observe net realized revenue.',
    defaultBudgetImpact: 'HIGH'
  },
  {
    id: 9,
    number: 9,
    categoryId: 4,
    categoryName: '04 — Commerce Reconciliation',
    title: 'New vs returning customers',
    question: 'Can you separate true customer acquisition from revenue generated by existing customers?',
    whyItMatters: 'If retargeting ads or branded search campaigns claim credit for repurchases by loyal subscribers, your true Blended Customer Acquisition Cost (nCAC) is artificially deflated while top-of-funnel reach stalls.',
    whatToInvestigate: 'Segment Shopify orders by first-time customer vs repeat customer tags. Calculate new-customer ROAS (ncROAS) and new-customer CAC (nCAC) independently for Meta and Google spend.',
    defaultBudgetImpact: 'HIGH'
  },
  {
    id: 10,
    number: 10,
    categoryId: 5,
    categoryName: '05 — Performance Measurement',
    title: 'CAC / ROAS consistency',
    question: 'Does the team use consistent definitions for CAC and ROAS instead of comparing different calculations across tools?',
    whyItMatters: 'If the growth team defines ROAS using in-platform Meta attribution while finance defines it as Shopify Net Revenue divided by Total Ad Spend (MER), executive misalignment will freeze budget scaling discussions.',
    whatToInvestigate: 'Document a single shared "Marketing Metrics Dictionary" across growth, agency partners, and finance defining exact numerator and denominator inclusions (taxes, discounts, shipping, agency fees).',
    defaultBudgetImpact: 'HIGH'
  },
  {
    id: 11,
    number: 11,
    categoryId: 5,
    categoryName: '05 — Performance Measurement',
    title: 'Cross-channel journey',
    question: 'Can you see when customers interact with multiple channels before purchasing instead of giving all credit to one touchpoint?',
    whyItMatters: 'Last-click or siloed platform models starve top-of-funnel awareness channels (like TikTok or non-brand Meta) while over-rewarding bottom-funnel capturing channels (like Google Branded Search and Klaviyo flows).',
    whatToInvestigate: 'Map multi-touch conversion paths to evaluate channel synergy. Identify touchpoint sequences where Meta acts as the initial discoverer and Google acts as the final navigation converter.',
    defaultBudgetImpact: 'HIGH'
  },
  {
    id: 12,
    number: 12,
    categoryId: 6,
    categoryName: '06 — Decision Confidence',
    title: 'Budget decision confidence',
    question: 'If you moved 20% of budget from Meta to Google tomorrow, would you trust the data enough to justify the decision?',
    whyItMatters: 'This is the ultimate litmus test of attribution health. If your data cannot give leadership confidence to shift $10,000–$50,000 between channels, your reporting is merely a vanity dashboard rather than an operational steering wheel.',
    whatToInvestigate: 'Evaluate the uncertainty spread across your measurement stack. Design clean geo-lift or matched-market holdout tests to measure true marginal incrementality before making large portfolio reallocations.',
    defaultBudgetImpact: 'CRITICAL'
  }
];

export const STATUS_DEFINITIONS = {
  RELIABLE: {
    key: 'RELIABLE',
    label: 'Reliable',
    symbol: '✓',
    colorName: 'emerald',
    badgeClass: 'badge-reliable',
    cardClass: 'card-reliable',
    summaryTitle: 'Tracking and reporting broadly reconcile.',
    keyQuestion: 'Can the team reproduce the same answer consistently?'
  },
  INVESTIGATE: {
    key: 'INVESTIGATE',
    label: 'Investigate',
    symbol: '◐',
    colorName: 'amber',
    badgeClass: 'badge-investigate',
    cardClass: 'card-investigate',
    summaryTitle: 'Numbers differ, but the reason may be understood.',
    keyQuestion: 'Is the difference documented and acceptable for decision-making?'
  },
  ATTRIBUTION_GAP: {
    key: 'ATTRIBUTION_GAP',
    label: 'Attribution Gap',
    symbol: '!',
    colorName: 'rose',
    badgeClass: 'badge-gap',
    cardClass: 'card-gap',
    summaryTitle: 'The disagreement could materially affect budget decisions.',
    keyQuestion: 'Which channel, event or attribution rule is creating the gap?'
  },
  UNKNOWN: {
    key: 'UNKNOWN',
    label: 'Unknown',
    symbol: '?',
    colorName: 'slate',
    badgeClass: 'badge-unknown',
    cardClass: 'card-unknown',
    summaryTitle: 'The team cannot currently answer with confidence.',
    keyQuestion: 'What data or integration is missing?'
  }
};

export const THREE_DISCUSSION_QUESTIONS = [
  {
    number: '01',
    question: 'Where do Meta, Google and Shopify disagree the most?',
    context: 'Pinpoint whether the variance is in conversion counts, gross vs net revenue, or lookback window assumptions.'
  },
  {
    number: '02',
    question: 'Which disagreement is most likely to change a real budget decision?',
    context: 'Focus on high-impact areas like double attribution and new vs returning customer split before minor discrepancies.'
  },
  {
    number: '03',
    question: 'What would your team need to see before trusting one cross-channel view of performance?',
    context: 'Determine what unified validation standard (Shopify order reconciliation, incrementality test, or single dashboard) would satisfy both marketing and finance.'
  }
];
