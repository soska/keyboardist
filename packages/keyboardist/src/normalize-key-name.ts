const MODIFIER_ALIASES: Record<string, string> = {
  alt: "alt",
  option: "alt",
  shift: "shift",
  ctrl: "ctrl",
  control: "ctrl",
  meta: "meta",
  cmd: "meta",
  command: "meta",
};

// Canonical modifier order in normalized names.
const MODIFIER_ORDER = ["alt", "shift", "ctrl", "meta"];

// `Numpad1` must stay distinct from `Digit1`, so only these exact prefixes
// are stripped from the base key.
const BASE_KEY_PREFIXES = /^(key|arrow|digit)/;

/**
 * Normalizes a key name to its canonical form, so friendly spellings and
 * raw `event.code` spellings match the same subscription:
 * `Shift+ArrowUp`, `shift + up` and `SHIFT+UP` all become `shift+up`.
 */
export function normalizeKeyName(name: string): string {
  const compact = name.toLowerCase().replace(/\s/g, "");

  if (compact === "") {
    return "unknown";
  }

  const tokens = compact.split("+").filter((token) => token !== "");
  if (tokens.length === 0) {
    return "unknown";
  }

  const baseToken = tokens[tokens.length - 1] as string;
  const modifierTokens = tokens.slice(0, -1);

  const modifiers = new Set<string>();
  for (const token of modifierTokens) {
    const modifier = MODIFIER_ALIASES[token];
    if (modifier) {
      modifiers.add(modifier);
    }
  }

  const orderedModifiers = MODIFIER_ORDER.filter((modifier) =>
    modifiers.has(modifier),
  );

  const baseKey = baseToken.replace(BASE_KEY_PREFIXES, "") || baseToken;

  return [...orderedModifiers, baseKey].join("+");
}

/**
 * Expands a comma-separated key list (`"j,k"`) into normalized key names.
 */
export function expandKeyAliases(name: string): string[] {
  return name
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part !== "")
    .map(normalizeKeyName);
}
