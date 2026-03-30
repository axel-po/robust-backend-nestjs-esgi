import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/.turbo/**',
    ],
  },
  {
    files: ['apps/**/*.ts', 'packages/**/*.ts'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
        projectService: false,
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
)
