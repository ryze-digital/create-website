import config from '@ryze-digital/eslint-config-website';

export default [
    ...config,
    {
        languageOptions: {
            globals: {
                process: 'readonly'
            }
        }
    }
];