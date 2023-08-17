/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
export function mergeDeep(target: any, source: any) {
  const t = { ...(target || {}) }
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      Object.assign(source[key], mergeDeep(t[key], source[key]))
    }
  }

  // Join `target` and modified `source`
  Object.assign(t || {}, source)
  return t
}
