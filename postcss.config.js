const path          = require('path');
const process       = require('process');
const mapKeys       = require('lodash/mapKeys');
const kebabCase     = require('lodash/kebabCase');
const parser        = require('postcss-comment');
const theme         = require('./src/settings/mui-theme')
const variables     = require('./src/settings/css-variables.js');

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
            stage: 4,
            features: {
                'custom-properties': {
                    preserve:   true,
                    importFrom:[{
                        customProperties:   mapKeys(variables, (v, key) => `--${kebabCase(key)}`)
                    }],
                },
                // 'all-property': true,
                // 'any-link-pseudo-class': true,
                // 'blank-pseudo-class': true,
                // 'break-properties': true,
                // 'case-insensitive-attributes': true,
                // 'color-functional-notation': true,
                // 'color-mod-function': true,
                // 'custom-media-queries': true,
                // 'custom-selectors': true,
                // 'dir-pseudo-class': true,
                // 'double-position-gradients': true,
                // 'environment-variables': true,
                // 'focus-visible-pseudo-class': true,
                // 'focus-within-pseudo-class': true,
                // 'font-variant-property': true,
                // 'gap-properties': true,
                // 'gray-function': true,
                // 'has-pseudo-class': true,
                // 'hexadecimal-alpha-notation': true,
                // 'image-set-function': true,
                // 'lab-function': true,
                // 'logical-properties-and-values': true,
                // 'matches-pseudo-class': true,
                // 'media-query-ranges': true,
                // 'nesting-rules': true,
                // 'not-pseudo-class': true,
                // 'overflow-property': true,
                // 'overflow-wrap-property': true,
                // 'place-properties': true,
                // 'prefers-color-scheme-query': true,
                // 'rebeccapurple-color': true,
                // 'system-ui-font-family': true
            },
        },
    //     'postcss-extend-rule':              {},
    //     // 'postcss-advanced-variables': {
    //     //     variables: mapKeys(variables, (v, key) => kebabCase(key))
    //     // },
    //    // 'postcss-css-variables':            {},
    //     'postcss-color-function':           {},
    //     'postcss-atroot':                   {},
    //     'postcss-property-lookup':          {},
        'postcss-nested':                   {},
        'postcss-mui-theme':                {theme},
    }
}
