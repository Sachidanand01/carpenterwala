export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server') {
    return nextResolve('next/server.js', context);
  }
  if (specifier.startsWith('@/')) {
    const rel = specifier.slice(2);
    const withExt = /\.[a-z]+$/i.test(rel) ? rel : `${rel}.js`;
    const fileUrl = new URL('../' + withExt, import.meta.url).href;
    return nextResolve(fileUrl, context);
  }
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\.[a-z0-9]+$/i.test(specifier)) {
    return nextResolve(`${specifier}.js`, context);
  }
  return nextResolve(specifier, context);
}
