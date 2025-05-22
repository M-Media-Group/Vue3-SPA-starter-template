type FlattenedValue = string | string[] | object;

function has<
  T extends string,
  Obj extends Record<T, unknown> = Record<T, unknown>
>(el: unknown, method: T, type: string): el is Obj {
  return (
    typeof el === "object" &&
    el !== null &&
    method in el &&
    typeof (el as Record<string, unknown>)[method] === type
  );
}

/**
 *  Determines if an object has a method of a specific type in a type-safe way.
 */
export function hasMethod<
  T extends string,
  Obj extends Record<T, unknown> = Record<T, unknown>
>(el: unknown, method: T): el is Obj {
  return has(el, method, "function");
}

/**
 * Determines if an object has a property of a specific type in a type-safe way.
 */
export function hasProperty<
  T extends string,
  Obj extends Record<T, unknown> = Record<T, unknown>
>(el: unknown, method: T): el is Obj {
  return has(el, method, "string");
}

/**
 * Recursively flattens a nested object into dot notation,
 * stopping at a specific key (default "_errors").
 *
 * Used primarily to unify error messages from different sources.
 *
 * @example
 * ```ts
 * const dataToFlatten = {a: [{ b: [{ _errors: ["Error"] }] }]};
 * const output = flattenObjectToDotNotationWithArrayAndStopAtKey(dataToFlatten);
 * return output === {
 *  "a.0.b.0": ["Error"]
 * };
 * ```
 */
export function flattenObjectToDotNotationWithArrayAndStopAtKey<
  T extends Record<string, FlattenedValue>
>(
  obj: T,
  parentKey = "",
  result: Record<string, FlattenedValue> = {},
  stopKey = "_errors"
): Record<string, FlattenedValue> {
  for (const key in obj) {
    const value = obj[key];
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    // If the value is an empty array, skip it
    if (Array.isArray(value) && value.length === 0) {
      continue;
    }

    if (key === stopKey) {
      result[parentKey] = value as FlattenedValue;
      continue;
    }

    if (Array.isArray(value)) {
      result[newKey] = value as FlattenedValue;
    } else if (typeof value === "object" && value !== null) {
      flattenObjectToDotNotationWithArrayAndStopAtKey(
        value as Record<string, FlattenedValue>,
        newKey,
        result,
        stopKey
      );
    } else {
      result[newKey] = value as FlattenedValue;
    }
  }

  return result;
}
