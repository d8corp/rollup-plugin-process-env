import { placeholder } from '@cantinc/utils'
import { createFilter } from '@rollup/pluginutils'
import MagicString from 'magic-string'
import { Plugin } from 'rollup'

export type ConditionFn = (name: string) => boolean
export type EnvValues = Record<string, string>
export type Condition = string | ConditionFn | EnvValues
export interface EnvOptions {
  /** Inclusion list, it includes everything by default */
  include?: string | string[]
  /** Exclusion list, it excludes nothing by default */
  exclude?: string | string[]
  /** Injection with virtual, by default auto definition relates to `include` */
  virtual?: boolean
}

const name = 'rollup-plugin-process-env'
const VIRTUAL_ID = `\0${name}`

function env (prefix: string, options?: EnvOptions): Plugin
function env (values: EnvValues, options?: EnvOptions): Plugin
function env (condition: ConditionFn, options?: EnvOptions): Plugin
function env (condition: Condition, options: EnvOptions = {}): Plugin {
  const {
    include,
    exclude,
    virtual = !include || (Array.isArray(include) && include.length > 1),
  } = options
  const filter = createFilter(include, exclude)

  if (typeof condition === 'string') {
    const conditionStr = condition

    condition = name => name.startsWith(conditionStr)
  }

  if (typeof condition === 'function') {
    const conditionFn = condition
    condition = {}

    for (const key in process.env) {
      const value = process.env[key]
      if (conditionFn(key)) {
        condition[key] = placeholder(value as string, process.env)
      }
    }
  }

  const envJson = JSON.stringify(condition)

  if (envJson === '{}') {
    return { name }
  }

  const injectionCode = `;(function () {
  const env = ${envJson}
  if (typeof process === 'undefined') {
    globalThis.process = { env: env }
  } else if (process.env) {
    Object.assign(process.env, env)
  } else {
    process.env = env
  }
})();\n`

  const injectEnv = (code: string, injection: string) => {
    const magicString = new MagicString(code)
    magicString.prepend(injection)
    return {
      code: magicString.toString(),
      map: magicString.generateMap({ hires: true }),
    }
  }

  if (virtual) {
    const injection = `import '${VIRTUAL_ID}'\n`

    return {
      name,
      transform (code, id) {
        if (!filter(id) || id === VIRTUAL_ID) return null
        return injectEnv(code, injection)
      },
      resolveId (id: string) {
        if (id === VIRTUAL_ID) return VIRTUAL_ID
      },
      load (id: string) {
        if (id === VIRTUAL_ID) return injectionCode
      },
    }
  }

  return {
    name,
    transform (code, id) {
      if (!filter(id)) return null

      return injectEnv(code, injectionCode)
    },
  }
}

export default env
