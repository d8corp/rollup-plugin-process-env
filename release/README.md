[![NPM](https://img.shields.io/npm/v/rollup-plugin-process-env.svg)](https://www.npmjs.com/package/rollup-plugin-process-env)
[![downloads](https://img.shields.io/npm/dm/rollup-plugin-process-env.svg)](https://www.npmtrends.com/rollup-plugin-process-env)
[![changelog](https://img.shields.io/badge/Changelog-⋮-brightgreen)](https://changelogs.xyz/rollup-plugin-process-env)
[![license](https://img.shields.io/npm/l/rollup-plugin-process-env)](https://github.com/d8corp/rollup-plugin-process-env/blob/main/LICENSE)

# rollup-plugin-process-env

🍣 A Rollup plugin which injects `process.env` variables into build.

[![stars](https://img.shields.io/github/stars/d8corp/rollup-plugin-process-env?style=social)](https://github.com/d8corp/rollup-plugin-process-env/stargazers)
[![watchers](https://img.shields.io/github/watchers/d8corp/rollup-plugin-process-env?style=social)](https://github.com/d8corp/rollup-plugin-process-env/watchers)

## Install

```shell
npm i rollup-plugin-process-env
```

## Usage

Use prefix to inject environments from current `process.env` which starts with the prefix.

```typescript
import env from 'rollup-plugin-process-env'

export default {
  plugins: [
    env('MY_PREFIX_'),
  ],
}
```

Use [dotenv](https://www.npmjs.com/package/dotenv) and [dotenv-expand](https://www.npmjs.com/package/dotenv-expand)
to get environments from `.env` and outer environments

```typescript
import env from 'rollup-plugin-process-env'

require('dotenv-expand').expand(require('dotenv').config())

export default {
  plugins: [
    env('MY_PREFIX_'),
  ],
}
```

Filter environments by name

```typescript
import env from 'rollup-plugin-process-env'

const envs = ['MY_ENV', 'ANOTHER_MY_NAME']

export default {
  plugins: [
    env(name => envs.includes(name)),
  ],
}
```

Provide an object to include it as `process.env`

```typescript
import env from 'rollup-plugin-process-env'

export default {
  plugins: [
    env({ MY_ENV: 'true' }),
  ],
}
```

## Issues
If you find a bug or have a suggestion, please file an issue on [GitHub](https://github.com/d8corp/rollup-plugin-process-env/issues).

[![issues](https://img.shields.io/github/issues-raw/d8corp/rollup-plugin-process-env)](https://github.com/d8corp/rollup-plugin-process-env/issues)
