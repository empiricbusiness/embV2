import { registerHooks } from 'node:module'
import { statSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

/**
 * Teaches plain `node --test` the `@/*` path alias from tsconfig.json.
 *
 * Next resolves `@/` itself at build time, so the app never needs this; the
 * test runner does, because it loads the modules directly. Node 24 strips the
 * TypeScript annotations natively, so no transpiler is involved — this only
 * has to answer "which file is `@/data/site`".
 */
const SRC = path.join(process.cwd(), 'src')

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith('@/')) return nextResolve(specifier, context)

    const base = path.join(SRC, specifier.slice(2))
    const isFile = (p) => {
      try {
        return statSync(p).isFile()
      } catch {
        return false
      }
    }
    for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')]) {
      if (isFile(candidate)) return nextResolve(pathToFileURL(candidate).href, context)
    }
    return nextResolve(pathToFileURL(base).href, context)
  },
})
