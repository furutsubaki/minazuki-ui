module.exports = {
    plugins: [
        '@stylistic/stylelint-plugin'
    ],
    extends: [
        'stylelint-config-standard',
        'stylelint-config-recess-order',
        'stylelint-config-standard-scss',
        'stylelint-config-standard-vue/scss',
        'stylelint-config-recommended-vue',
        '@stylistic/stylelint-config'
    ],
    overrides: [
        {
            files: ['**/*.scss'],
            customSyntax: 'postcss-scss'
        },
        {
            files: ['**/*.vue', '**/*.html'],
            customSyntax: 'postcss-html'
        }
    ],
    rules: {
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
        'scss/comment-no-empty': null,
        'no-empty-source': null,
        'no-descending-specificity': null,
        'rule-empty-line-before': [
            'always',
            {
                except: 'inside-block'
            }
        ],
        'function-no-unknown': null,
        'value-keyword-case': [
            'lower',
            {
                ignoreFunctions: ['v-bind']
            }
        ],
        '@stylistic/indentation': 4,
        '@stylistic/string-quotes': 'single',
        '@stylistic/block-closing-brace-newline-after': [
            'always',
            {
                ignoreAtRules: ['if', 'else']
            }
        ],
        'scss/selector-no-union-class-name': true
    }
};
