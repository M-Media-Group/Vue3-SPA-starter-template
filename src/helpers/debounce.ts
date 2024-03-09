/** This function debounces a function
 *
 * @example ```ts
 * const debounced = debounce(() => console.log('Hello World'), 300);
 * debounced(); // This will log 'Hello World' after 300ms
 * ```
 *
 * @param fn - The function to debounce
 * @param delay - The delay in milliseconds
 * @param leading - If the function should be called on the leading edge or the trailing edge (first-in triggers the function vs last-in triggers the function)
 */
export const debounce = (fn: Function, delay = 300, leading = false) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    if (leading && !timeoutId) {
      fn(...args);
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (!leading) {
        fn(...args);
      }
    }, delay);
  };
};
