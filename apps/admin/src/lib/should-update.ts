const deepEqual = (obj1: any, obj2: any): boolean => {
  // If they're strictly equal, return true
  if (obj1 === obj2) return true;

  // If either is null or undefined, they're only equal if both are
  if (obj1 == null || obj2 == null) return obj1 === obj2;

  // If they're different types, they're not equal
  if (typeof obj1 !== typeof obj2) return false;

  // If they're not objects, they must be primitives that aren't equal
  if (typeof obj1 !== "object") return false;

  // Handle arrays
  if (Array.isArray(obj1)) {
    if (!Array.isArray(obj2) || obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) return false;
    }
    return true;
  }

  // Handle objects
  if (Array.isArray(obj2)) return false;

  // Get all keys from both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // If different number of keys, they're not equal
  if (keys1.length !== keys2.length) return false;

  // Check each key and value recursively
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
};

export const shouldUpdate = (
  previous: Record<string, any>,
  current: Record<string, any>
) => {
  return !deepEqual(previous, current);
};
