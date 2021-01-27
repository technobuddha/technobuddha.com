import parser        from 'postcss-comment';
import mapKeys       from 'lodash/mapKeys';
import kebabCase     from 'lodash/kebabCase';
import variables     from '#settings/css-variables';
import theme         from '#settings/mui-theme';

export default {
    parser:     parser,
    plugins: {
        'postcss-preset-env': {
            stage: 4,
            features: {
                'custom-properties': {
                    preserve:   true,
                    importFrom:[{
                        customProperties:   mapKeys(variables, (_, key) => `--${kebabCase(key)}`),
                    }],
                },
            },
        },
        // 'postcss-advanced-variables': {
        //     variables: mapKeys(variables, (v, key) => kebabCase(key))
        // },
        'postcss-nested':                   {},
        'postcss-property-lookup':          {},
        'postcss-mui-theme':                { theme },
    },
};
