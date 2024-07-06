module.exports = {
    env: {
        es2021: true,
        node: true,
        jest: true,
    },
    parser: '@typescript-eslint/parser',
    extends: [
        'prettier',
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'import', 'react'],
    rules: {
        'react/display-name': 'off',
        'react-hooks/exhaustive-deps': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-unused-vars': 'off',
        'no-shadow': 'off',
        'class-methods-use-this': 'off',
        'no-console': 'warn',
        '@typescript-eslint/no-shadow': ['error'],
        'import/prefer-default-export': 0,
        'import/no-cycle': 0,
        'no-underscore-dangle': 'off',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
            alias: {
                map: [['@src', './src']],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
        react: {
            version: 'detect',
        },
    },
};
