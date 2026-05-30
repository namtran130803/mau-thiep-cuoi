export function parseDbId(id: string | number | bigint): bigint {
  if (typeof id === "bigint") return id;
  if (typeof id === "number") return BigInt(id);

  const value = id.trim();
  if (!/^\d+$/.test(value)) {
    throw new Error("ID không hợp lệ");
  }
  return BigInt(value);
}

export function tryParseDbId(id: string | number | bigint): bigint | null {
  try {
    return parseDbId(id);
  } catch {
    return null;
  }
}

export function formatDbId(id: string | number | bigint): string {
  return id.toString();
}
