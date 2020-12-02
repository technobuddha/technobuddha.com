const path          = require('path');
const process       = require('process');
const mapKeys       = require('lodash/mapKeys');
const kebabCase     = require('lodash/kebabCase');
const parser        = require('postcss-comment');
const theme         = require('./src/mui-theme')
const variables     = require('./src/css-variables.js');

module.exports = {
    parser:     parser,
    plugins: {
        'postcss-import': {
            resolve(id, basedir) {
                if (/^\$/.test(id))    return path.join(process.cwd(), 'client', 'style', id.slice(1)); //TODO we shouldn't be using cwd()

                return path.resolve(basedir, id);
            }
        },
        'postcss-preset-env': {
            features: {
                'custom-properties': {
                    preserve:   false,
                    importFrom:[{
                        customProperties:   mapKeys(variables, (v, key) => `--${kebabCase(key)}`)
                    }],
                },
            },
        },
        'postcss-extend-rule':              {},
        'postcss-advanced-variables': {
            variables: mapKeys(variables, (v, key) => kebabCase(key))
        },
        'postcss-color-function':           {},
        'postcss-atroot':                   {},
        'postcss-property-lookup':          {},
        'postcss-nested':                   {},
        'postcss-mui-theme':                {theme},
    }
}
