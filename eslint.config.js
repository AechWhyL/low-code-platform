import react from "eslint-plugin-react";
import reactHooks from 'eslint-plugin-react-hooks';
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...react.configs.recommended.rules,
     ...reactHooks.configs.recommended.rules
    },
  }
);
