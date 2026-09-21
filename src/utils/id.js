// Small dependency-free id suffix generator — avoids pulling in nanoid just
// for this one use, since new tasks only need a short, URL-safe unique tail.
export function customAlphabet() {
  return () => Math.random().toString(36).slice(2, 8);
}
