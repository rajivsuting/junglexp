// lib/cache.ts
import { redis } from "./redis";

type CacheOptions<T> = {
  key: string; // final Redis key
  ttlSeconds?: number; // time-to-live
  swrSeconds?: number; // optional stale-while-revalidate window (pseudo)
  revalidate?: boolean; // force refresh and overwrite cache
  serialize?: (val: T) => string;
  deserialize?: (raw: string) => T;
};

export async function getJSON<T>(key: string): Promise<T | null> {
  const raw = await redis.json.get<T>(key);
  return raw;
}

export async function setJSON<T>(key: string, val: T, ttlSeconds?: number) {
  const raw = JSON.stringify(val);
  if (ttlSeconds && ttlSeconds > 0) {
    await redis.set(key, raw, { ex: ttlSeconds });
  } else {
    await redis.set(key, raw);
  }
}

// Optional versioning to bust a whole namespace
export async function bumpVersion(namespace: string) {
  // Incr a version key; include this in key derivation
  await redis.incr(`v:${namespace}`);
}

export async function getVersion(namespace: string): Promise<number> {
  const v = await redis.get<number>(`v:${namespace}`);
  return typeof v === "number" ? v : 0;
}

export async function getOrSet<T>(
  compute: () => Promise<T>,
  opts: CacheOptions<T>
): Promise<T> {
  const {
    key,
    ttlSeconds,
    revalidate = false,
    serialize = (v) => JSON.stringify(v),
    deserialize = (v) => JSON.parse(v) as T,
  } = opts;

  if (!revalidate) {
    const cached = await redis.get<string>(key);

    if (cached) {
      try {
        return deserialize(cached);
      } catch {
        // fallthrough to recompute on parse error
      }
    }
  }

  const data = await compute();
  const serialized = serialize(data);
  if (ttlSeconds && ttlSeconds > 0) {
    await redis.set(key, serialized, { ex: ttlSeconds });
  } else {
    await redis.set(key, serialized);
  }
  return data;
}
