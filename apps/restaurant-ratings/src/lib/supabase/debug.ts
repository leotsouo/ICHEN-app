export const DEV = process.env.NODE_ENV !== "production";

export function mkTrace(prefix: string) {
  const id =
    (globalThis.crypto as any)?.randomUUID?.() ??
    Math.random().toString(36).slice(2, 10);
  const tag = `${prefix}#${id}`;
  return {
    id,
    log: (...a: any[]) => DEV && console.log(`[${tag}]`, ...a),
    err: (...a: any[]) => DEV && console.error(`[${tag}]`, ...a),
  };
}
