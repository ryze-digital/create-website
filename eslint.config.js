import config from '@ryze-digital/eslint-config-website';

export default [
    ...config,
    {
        rules: {
            'no-console': 'off'
        },
        languageOptions: {
            globals: {
                process: 'readonly'
            }
        }
    }
];