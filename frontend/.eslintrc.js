module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  env: {
    browser: true,
    es6: true
  },
  globals: {
    PublicKeyCredential: 'readonly',
    navigator: 'readonly',
    window: 'readonly'
  },
  rules: {
    'no-unused-vars': 'warn',
    'import/no-anonymous-default-export': 'off'
  }
};
