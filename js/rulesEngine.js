/**
 * CMGalaxy - Configurable Attribution Analysis Engine
 * Decouples scoring/classification rules from UI components.
 */

import { AUDIT_QUESTIONS, STATUS_DEFINITIONS } from './auditData.js';

// Configurable Question Rules
export const QUESTION_RULES = {
  1: {
    budgetImpact: 'HIGH',
    answerMap: {
      yes: 'RELIABLE',
      partly: 'INVESTIGATE',
      no: 'ATTRIBUTION_GAP',
      dont_know: 'UNKNOWN'
    }
  },
  2: {
    budgetImpact: 'HIGH',
    answerMap: {
      yes: 'RELIABLE',
      partly: 'INVESTIGATE',
      no: 'ATTRIBUTION_GAP',
      dont_know: 'UNKNOWN'
    }
  },
  3: {
    budgetImpact: 'MEDIUM',
    answerMap: {
      yes: 'RELIABLE',
      partly: 'INVESTIGATE',
      no: 'ATTRIBUTION_GAP',
      dont_know: 'UNKNOWN'
    }
  },
  4: {
    budgetImpact: 'HIGH',
    answerMap: {
      yes: 'RELIABLE',
      partly: 'INVESTIGATE',
      no: 'ATTRIBUTION_GAP',
      dont_know: 'UNKNOWN'
    }
  },
  5: {
    budgetImpact: 'MEDIUM',
    answerMap: {
      yes: 'RELIABLE',
      partly: 'INVESTIGATE',
      no: 'ATTRIBUTION_GAP',
      dont_know: 'UNKNOWN'
    }
  },
  6: {
    budgetImpact: 'HIGH',
    answerMap: {
      yes: 'RELIABLE',
      partly: 'INVESTIGATE',
      no: 'ATTRIBUTION_GAP',
      dont_know: 'UNKNOWN'
    }
  },
  7: {
    budgetImpact: 'HIGH',
    answerMap: {
      yes: 'RELIABLE',
      partly: 'INVESTIGATE',
      no: 'ATTRIBUTION_GAP',
      dont_know: 'UNKNOWN'
    }
  },
  8: {
    budgetImpact: 'HIGH',
    answerMap: {
      yes: 'RELIABLE',
      partly: 'INVESTIGATE',
      no: 'ATTRIBUTION_GAP',
      dont_know: 'UNKNOWN'
    }
  },
  9: {
    budgetImpact: 'HIGH',
    answerMap: {
      yes: 'RELIABLE',
      partly: 'INVESTIGATE',
      no: 'ATTRIBUTION_GAP',
      dont_know: 'UNKNOWN'
    }
  },
  10: {
    budgetImpact: 'HIGH',
    answerMap: {
      yes: 'RELIABLE',
      partly: 'INVESTIGATE',
      no: 'ATTRIBUTION_GAP',
      dont_know: 'UNKNOWN'
    }
  },
  11: {
    budgetImpact: 'HIGH',
    answerMap: {
      yes: 'RELIABLE',
      partly: 'INVESTIGATE',
      no: 'ATTRIBUTION_GAP',
      dont_know: 'UNKNOWN'
    }
  },
  12: {
    budgetImpact: 'CRITICAL',
    answerMap: {
      yes: 'RELIABLE',
      partly: 'INVESTIGATE',
      no: 'ATTRIBUTION_GAP',
      dont_know: 'UNKNOWN'
    }
  }
};

// Priority weights for sorting findings (Section 21)
const BUDGET_IMPACT_WEIGHT = {
  CRITICAL: 400,
  HIGH: 300,
  MEDIUM: 200,
  LOW: 100
};

const STATUS_WEIGHT = {
  ATTRIBUTION_GAP: 40,
  INVESTIGATE: 30,
  UNKNOWN: 20,
  RELIABLE: 10
};

/**
 * Evaluates an individual question's answer against the rule map.
 */
export function evaluateAnswer(questionId, answerKey) {
  const rule = QUESTION_RULES[questionId] || {
    budgetImpact: 'MEDIUM',
    answerMap: {
      yes: 'RELIABLE',
      partly: 'INVESTIGATE',
      no: 'ATTRIBUTION_GAP',
      dont_know: 'UNKNOWN'
    }
  };

  const statusKey = rule.answerMap[answerKey] || 'UNKNOWN';
  const statusDef = STATUS_DEFINITIONS[statusKey] || STATUS_DEFINITIONS.UNKNOWN;

  return {
    questionId,
    answer: answerKey,
    status: statusKey,
    statusDefinition: statusDef,
    budgetImpact: rule.budgetImpact
  };
}

/**
 * Analyzes the entire set of answers and produces diagnostic report data.
 * Pure function: does not mutate state.
 */
export function analyzeAuditAnswers(answersMap) {
  const findings = [];
  let reliableCount = 0;
  let investigateCount = 0;
  let attributionGapCount = 0;
  let unknownCount = 0;

  AUDIT_QUESTIONS.forEach((q) => {
    const rawAnswer = answersMap[q.id] || 'dont_know';
    const evalResult = evaluateAnswer(q.id, rawAnswer);

    if (evalResult.status === 'RELIABLE') reliableCount++;
    else if (evalResult.status === 'INVESTIGATE') investigateCount++;
    else if (evalResult.status === 'ATTRIBUTION_GAP') attributionGapCount++;
    else if (evalResult.status === 'UNKNOWN') unknownCount++;

    // Format human-readable user answer label
    let answerLabel = 'No';
    if (rawAnswer === 'yes') answerLabel = 'YES';
    else if (rawAnswer === 'partly') answerLabel = 'PARTLY';
    else if (rawAnswer === 'no') answerLabel = 'NO';
    else if (rawAnswer === 'dont_know') answerLabel = "DON'T KNOW";

    // Form finding object
    findings.push({
      questionId: q.id,
      questionNumber: q.number,
      title: q.title,
      questionText: q.question,
      categoryId: q.categoryId,
      categoryName: q.categoryName,
      answerKey: rawAnswer,
      answerLabel,
      status: evalResult.status,
      statusDefinition: evalResult.statusDefinition,
      budgetImpact: evalResult.budgetImpact,
      whyItMatters: q.whyItMatters,
      whatToInvestigate: q.whatToInvestigate,
      keyQuestion: evalResult.statusDefinition.keyQuestion,
      // Priority sorting score
      sortScore: (BUDGET_IMPACT_WEIGHT[evalResult.budgetImpact] || 0) +
                 (STATUS_WEIGHT[evalResult.status] || 0) +
                 (15 - q.id) // secondary tie-breaker by question importance
    });
  });

  // Sort findings by priority: budgetImpact -> status -> question importance
  const sortedFindings = [...findings].sort((a, b) => b.sortScore - a.sortScore);

  // Top priority findings (actionable areas: gaps, investigate, critical unknowns)
  const topFindings = sortedFindings.filter(
    (f) => f.status === 'ATTRIBUTION_GAP' || f.status === 'INVESTIGATE' || f.budgetImpact === 'CRITICAL'
  );

  // Fallback if user answered YES to everything
  const prioritizedDisplay = topFindings.length > 0 ? topFindings : sortedFindings.slice(0, 3);

  // Dynamic "Biggest Finding" synthesis (Section 20)
  const decisionImpactingCount = attributionGapCount + investigateCount;
  let biggestFindingHeadline = '';
  let biggestFindingSubtext = '';
  let strategicRiskLevel = 'MODERATE';

  if (attributionGapCount >= 4) {
    strategicRiskLevel = 'HIGH';
    biggestFindingHeadline = `${attributionGapCount} major attribution gaps are distorting your marketing budget decisions.`;
    biggestFindingSubtext = `Your audit indicates significant reporting divergence between Meta, Google, and Shopify. Reallocating budget right now carries substantial blind-spot risk until cross-channel deduplication and Shopify reconciliation are established.`;
  } else if (attributionGapCount > 0) {
    strategicRiskLevel = 'ELEVATED';
    biggestFindingHeadline = `${attributionGapCount} critical areas may affect how confidently your team allocates marketing budget.`;
    biggestFindingSubtext = `Your audit indicates that several parts of your attribution setup need investigation before using platform dashboards to justify significant cross-channel budget shifts.`;
  } else if (investigateCount > 0) {
    strategicRiskLevel = 'MODERATE';
    biggestFindingHeadline = `${investigateCount} reporting areas show variance that requires diagnostic clarity.`;
    biggestFindingSubtext = `While there are no catastrophic tracking breakages, numbers between ad managers and Shopify diverge enough to create friction between marketing and finance during scale planning.`;
  } else if (unknownCount >= 4) {
    strategicRiskLevel = 'UNCERTAIN';
    biggestFindingHeadline = `${unknownCount} unverified attribution variables prevent confident performance measurement.`;
    biggestFindingSubtext = `Your team lacks visibility into key tracking mechanics (such as lookback windows or deduplication). An attribution audit should be conducted to establish baseline truth.`;
  } else {
    strategicRiskLevel = 'SOUND';
    biggestFindingHeadline = `Your attribution foundation shows strong alignment across channels.`;
    biggestFindingSubtext = `Platform reporting and Shopify data broadly reconcile. Your next priority is testing incremental lift and continuous reconciliation to safeguard scale.`;
  }

  return {
    reliableCount,
    investigateCount,
    attributionGapCount,
    unknownCount,
    decisionImpactingCount,
    strategicRiskLevel,
    biggestFindingHeadline,
    biggestFindingSubtext,
    topFindings: prioritizedDisplay,
    findings: sortedFindings,
    rawFindings: findings
  };
}
