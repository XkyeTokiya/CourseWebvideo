function screenSourceItems(screenSource) {
  const items = [];
  if (screenSource?.title && typeof screenSource.title === "object") items.push(screenSource.title);
  for (const group of Array.isArray(screenSource?.groups) ? screenSource.groups : []) {
    for (const item of Array.isArray(group?.items) ? group.items : []) items.push(item);
  }
  return items;
}

function stableUnique(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.trim()))].sort();
}

function semanticAtoms(text) {
  return text.match(/(?:\d+(?:\.\d+)?%?|百分之[零一二三四五六七八九十百千万亿点]+(?:以上|以下)?|[A-Z]{2,}|[\u3400-\u9fff]{2})/gu) ?? [];
}

function quantityAtoms(text) {
  return text.match(/(?:\d+(?:\.\d+)?%?(?:以上|以下)?|百分之[零一二三四五六七八九十百千万亿点]+(?:以上|以下)?)/gu) ?? [];
}

function qualifierAtoms(text) {
  const markers = ["不构成", "不得", "不能", "以上", "以下", "至少", "至多", "仅", "只", "没有", "同一", "任何", "某"];
  return markers.filter((marker) => text.includes(marker));
}

function sourceRelationIds(screenSource, protectedRelations) {
  return stableUnique([
    ...(Array.isArray(screenSource?.protected_relations) ? screenSource.protected_relations : []).map((item) => item?.relation_id),
    ...(Array.isArray(protectedRelations) ? protectedRelations : []).map((item) => typeof item === "string" ? item : item?.relation_id),
  ]);
}

function finalRelationIds(finalVisibleItems, finalProtectedRelationIds) {
  if (Array.isArray(finalProtectedRelationIds)) return stableUnique(finalProtectedRelationIds);
  return stableUnique([
    ...(Array.isArray(finalVisibleItems) ? finalVisibleItems : []).flatMap((item) => [
      ...(Array.isArray(item?.protected_relation_ids) ? item.protected_relation_ids : []),
      ...(Array.isArray(item?.relation_ids) ? item.relation_ids : []),
    ]),
  ]);
}

/**
 * Check v5 baseline adaptation plus optional text derived from the current A's
 * narration beats. This is a content-fidelity helper, not a production gate or
 * an NLP equivalence claim.
 */
export function validateScreenAdaptation({
  screenSource,
  narrationBeats = [],
  finalVisibleItems,
  protectedRelations = [],
  finalProtectedRelationIds = null,
  silentConstraints = [],
} = {}) {
  const failures = [];
  const sourceItems = screenSourceItems(screenSource);
  const sourceById = new Map();
  for (const item of sourceItems) {
    if (typeof item?.screen_item_id !== "string" || sourceById.has(item.screen_item_id)) {
      failures.push("SCREEN_SOURCE_ID_INVALID");
      continue;
    }
    sourceById.set(item.screen_item_id, item);
  }
  if (!Array.isArray(finalVisibleItems)) {
    failures.push("FINAL_VISIBLE_ITEMS_REQUIRED");
    return { passed: false, decision: "must-fix", failures: stableUnique(failures), errors: stableUnique(failures) };
  }
  const finalById = new Map();
  for (let itemIndex = 0; itemIndex < finalVisibleItems.length; itemIndex += 1) {
    const item = finalVisibleItems[itemIndex];
    if (item?.source_kind === "narration") {
      const label = `narration[${itemIndex}]`;
      const text = typeof item.text === "string"
        ? item.text
        : typeof item.visible_text === "string" ? item.visible_text : null;
      const beatIndexes = item.narration_beat_indexes;
      if (item.screen_item_id !== undefined) failures.push(`UNSUPPORTED_SCREEN_ITEM:${item.screen_item_id}`);
      if (typeof text !== "string" || !text.trim()) {
        failures.push(`SCREEN_TEXT_REQUIRED:${label}`);
        continue;
      }
      if (
        !Array.isArray(beatIndexes)
        || !beatIndexes.length
        || !beatIndexes.every((index) => Number.isInteger(index) && index >= 1 && index <= narrationBeats.length)
        || new Set(beatIndexes).size !== beatIndexes.length
      ) {
        failures.push(`UNSUPPORTED_SCREEN_ITEM:${label}`);
        continue;
      }
      const narrationSource = beatIndexes.map((index) => narrationBeats[index - 1]).join("\n");
      const sourceQuantities = new Set(quantityAtoms(narrationSource));
      const sourceQualifiers = new Set(qualifierAtoms(narrationSource));
      if (
        semanticAtoms(text).some((atom) => !narrationSource.includes(atom))
        || quantityAtoms(text).some((atom) => !sourceQuantities.has(atom))
        || qualifierAtoms(text).some((atom) => !sourceQualifiers.has(atom))
        || (Array.isArray(item.evidence_refs) && item.evidence_refs.length)
      ) failures.push(`UNSUPPORTED_CLAIM:${label}`);
      const constraintIds = [
        ...(Array.isArray(item.silent_constraint_ids) ? item.silent_constraint_ids : []),
        ...(Array.isArray(item.constraint_ids) ? item.constraint_ids : []),
      ];
      if (constraintIds.length) failures.push(`SILENT_CONSTRAINT_LEAKAGE:${label}`);
      for (const constraint of silentConstraints) {
        if (typeof constraint?.constraint_id === "string" && text.includes(constraint.constraint_id)) failures.push(`SILENT_CONSTRAINT_LEAKAGE:${label}:${constraint.constraint_id}`);
        if (typeof constraint?.instruction === "string" && constraint.instruction.trim() && text.includes(constraint.instruction.trim())) failures.push(`SILENT_CONSTRAINT_LEAKAGE:${label}:${constraint.constraint_id ?? "<unknown>"}`);
      }
      continue;
    }
    const id = item?.screen_item_id;
    if (typeof id !== "string" || finalById.has(id)) {
      failures.push(`FINAL_SCREEN_ITEM_ID_INVALID:${id ?? "<unknown>"}`);
      continue;
    }
    finalById.set(id, item);
    if (!sourceById.has(id)) failures.push(`UNSUPPORTED_SCREEN_ITEM:${id}`);
  }

  for (const [id, source] of sourceById) {
    const finalItem = finalById.get(id);
    if (!finalItem) {
      failures.push(`SCREEN_ITEM_MISSING:${id}`);
      continue;
    }
    const finalText = typeof finalItem.text === "string"
      ? finalItem.text
      : typeof finalItem.visible_text === "string"
        ? finalItem.visible_text
        : typeof finalItem.source_text === "string" ? finalItem.source_text : null;
    if (typeof finalText !== "string" || !finalText.trim()) {
      failures.push(`SCREEN_TEXT_REQUIRED:${id}`);
      continue;
    }
    const policy = source.edit_policy;
    if (finalItem.edit_policy !== undefined && finalItem.edit_policy !== policy) failures.push(`EDIT_POLICY_CHANGED:${id}`);
    if (policy === "exact" && finalText !== source.source_text) failures.push(`EXACT_TEXT_CHANGED:${id}`);
    if (policy === "adaptable") {
      const sourceQuantities = quantityAtoms(source.source_text).sort();
      const finalQuantities = quantityAtoms(finalText).sort();
      if (JSON.stringify(sourceQuantities) !== JSON.stringify(finalQuantities)) failures.push(`SEMANTIC_QUANTITY_DRIFT:${id}`);
      const sourceQualifiers = qualifierAtoms(source.source_text);
      const finalQualifiers = qualifierAtoms(finalText);
      if (sourceQualifiers.some((marker) => !finalQualifiers.includes(marker))) failures.push(`SEMANTIC_QUALIFIER_DRIFT:${id}`);
      const sourceAtoms = new Set(semanticAtoms(source.source_text));
      const finalAtoms = new Set(semanticAtoms(finalText));
      const overlap = [...sourceAtoms].filter((atom) => finalAtoms.has(atom)).length;
      if (sourceAtoms.size >= 3 && overlap === 0) failures.push(`SEMANTIC_DRIFT:${id}`);
      if (finalText.length > source.source_text.length * 3 + 24) failures.push(`UNSUPPORTED_CLAIM:${id}`);
    }
    if (Array.isArray(finalItem.evidence_refs)) {
      const allowedEvidence = new Set(Array.isArray(source.evidence_refs) ? source.evidence_refs : []);
      for (const evidenceId of finalItem.evidence_refs) {
        if (!allowedEvidence.has(evidenceId)) failures.push(`UNSUPPORTED_EVIDENCE:${id}:${evidenceId}`);
      }
    }
    const constraintIds = [
      ...(Array.isArray(finalItem.silent_constraint_ids) ? finalItem.silent_constraint_ids : []),
      ...(Array.isArray(finalItem.constraint_ids) ? finalItem.constraint_ids : []),
    ];
    if (constraintIds.length) failures.push(`SILENT_CONSTRAINT_LEAKAGE:${id}`);
    for (const constraint of silentConstraints) {
      if (typeof constraint?.constraint_id === "string" && finalText.includes(constraint.constraint_id)) failures.push(`SILENT_CONSTRAINT_LEAKAGE:${id}:${constraint.constraint_id}`);
      if (typeof constraint?.instruction === "string" && constraint.instruction.trim() && finalText.includes(constraint.instruction.trim())) failures.push(`SILENT_CONSTRAINT_LEAKAGE:${id}:${constraint.constraint_id ?? "<unknown>"}`);
    }
  }

  const expectedRelations = sourceRelationIds(screenSource, protectedRelations);
  const actualRelations = finalRelationIds(finalVisibleItems, finalProtectedRelationIds);
  if (JSON.stringify(expectedRelations) !== JSON.stringify(actualRelations)) failures.push("PROTECTED_RELATION_CHANGE");

  const normalized = stableUnique(failures);
  return {
    passed: normalized.length === 0,
    decision: normalized.length === 0 ? "passed" : "must-fix",
    checked_item_count: sourceById.size,
    failures: normalized,
    errors: normalized,
  };
}

export const reviewScreenAdaptation = validateScreenAdaptation;
