'use strict';

var utils = require('@cantinc/utils');
var pluginutils = require('@rollup/pluginutils');
var MagicString = require('magic-string');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var MagicString__default = /*#__PURE__*/_interopDefaultLegacy(MagicString);

const name = 'rollup-plugin-process-env';
const VIRTUAL_ID = `\0${name}`;
function env(condition, options = {}) {
    const { include, exclude, virtual = !include || (Array.isArray(include) && include.length > 1), } = options;
    const filter = pluginutils.createFilter(include, exclude);
    if (typeof condition === 'string') {
        const conditionStr = condition;
        condition = name => name.startsWith(conditionStr);
    }
    if (typeof condition === 'function') {
        const conditionFn = condition;
        condition = {};
        for (const key in process.env) {
            const value = process.env[key];
            if (conditionFn(key)) {
                condition[key] = utils.placeholder(value, process.env);
            }
        }
    }
    const envJson = JSON.stringify(condition);
    if (envJson === '{}') {
        return { name };
    }
    const injection = `if (typeof process === 'undefined') { process = { env: ${envJson} } } else { Object.assign(process.env, ${envJson}) }\n`;
    const injectEnv = (code) => {
        const magicString = new MagicString__default["default"](code);
        magicString.prepend(injection);
        return {
            code: magicString.toString(),
            map: magicString.generateMap({ hires: true }),
        };
    };
    if (virtual) {
        return {
            name,
            transform(code, id) {
                if (!filter(id) || id === VIRTUAL_ID)
                    return null;
                return injectEnv(code);
            },
            resolveId(id) {
                if (id === VIRTUAL_ID)
                    return VIRTUAL_ID;
            },
            load(id) {
                if (id === VIRTUAL_ID)
                    return injection;
            },
        };
    }
    return {
        name,
        transform(code, id) {
            if (!filter(id))
                return null;
            return injectEnv(code);
        },
    };
}

module.exports = env;
