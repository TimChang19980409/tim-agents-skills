import { asList, fail, parseArgs, readYamlMap, type JsonMap, writeFileEnsured } from "./_common";

const PATTERN_LABELS: Record<string, string> = {
  customer_supplier: "Customer-Supplier",
  conformist: "Conformist",
  acl: "ACL",
  open_host_service: "Open Host Service",
  shared_kernel: "Shared Kernel",
  partnership: "Partnership",
};

function safeNodeId(name: string): string {
  let cleaned = name.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  if (!cleaned) cleaned = "Context";
  if (/^[0-9]/.test(cleaned)) cleaned = `C_${cleaned}`;
  return cleaned;
}

function getContextNames(contract: JsonMap): string[] {
  const names: string[] = [];
  for (const ctx of asList(contract.bounded_contexts)) {
    if (!ctx || typeof ctx !== "object" || Array.isArray(ctx)) continue;
    const name = String((ctx as JsonMap).name ?? "").trim();
    if (name) names.push(name);
  }
  return [...new Set(names)];
}

function renderMermaid(contract: JsonMap): string {
  const contexts = getContextNames(contract);
  const rels = asList(contract.context_map_relationships);
  const idByName = new Map<string, string>(contexts.map((name) => [name, safeNodeId(name)]));

  const lines = ["graph LR"];
  for (const name of contexts) {
    lines.push(`  ${idByName.get(name)}["${name}"]`);
  }

  rels.forEach((rel, idx) => {
    if (!rel || typeof rel !== "object" || Array.isArray(rel)) return;
    const r = rel as JsonMap;
    const upstream = String(r.upstream ?? "").trim();
    const downstream = String(r.downstream ?? "").trim();
    const pattern = String(r.pattern ?? "").trim().toLowerCase().replace(/\s+/g, "_");
    if (!upstream || !downstream) return;

    if (!idByName.has(upstream)) {
      const id = safeNodeId(`auto_up_${idx}_${upstream}`);
      idByName.set(upstream, id);
      lines.push(`  ${id}["${upstream}"]`);
    }
    if (!idByName.has(downstream)) {
      const id = safeNodeId(`auto_down_${idx}_${downstream}`);
      idByName.set(downstream, id);
      lines.push(`  ${id}["${downstream}"]`);
    }

    const label = PATTERN_LABELS[pattern] ?? (pattern ? pattern.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) : "Relation");
    lines.push(`  ${idByName.get(upstream)} -- "${label}" --> ${idByName.get(downstream)}`);
  });

  return `${lines.join("\n")}\n`;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const input = args.input;
  if (typeof input !== "string") fail("--input is required");
  const output = typeof args.output === "string" ? args.output : undefined;

  let mermaid = "";
  try {
    mermaid = renderMermaid(readYamlMap(input));
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }

  if (output) {
    writeFileEnsured(output, mermaid);
  } else {
    process.stdout.write(mermaid);
  }
}

main();
