// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');

const reactNative = require('eslint-plugin-react-native');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: require('@typescript-eslint/parser'),
            globals: {
                __DEV__: 'readonly',
            },
        },
        plugins: {
            react: require('eslint-plugin-react'),
            'react-hooks': require('eslint-plugin-react-hooks'),
            'react-native': reactNative,
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
        },
        rules: {
            // Base rules
            'no-unused-vars': 'off',
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',

            // React rules
            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/jsx-no-target-blank': 'off',

            // React Native specific
            'react-native/no-unused-styles': 'off',
            'react-native/split-platform-components': 'warn',
            'react-native/no-inline-styles': 'off',
            'react-native/no-color-literals': 'off',
            'react-native/no-raw-text': 'off',
            'react/no-unescaped-entities': 'off',

            // TypeScript rules
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',

            // React Hooks
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },

    expoConfig,
]);
