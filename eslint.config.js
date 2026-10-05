import tseslint from 'typescript-eslint';
import pluginQuery from '@tanstack/eslint-plugin-query';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...pluginQuery.configs['flat/recommended-strict'],
);
