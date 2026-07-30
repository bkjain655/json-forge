import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

const eslintConfig = [
  { ignores: [".next/**", "next-env.d.ts", "node_modules/**"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // This app deliberately operates on arbitrary user JSON, so `any` is the
      // honest type in the diff/parse helpers. Kept visible as a warning.
      "@typescript-eslint/no-explicit-any": "warn",
      // Ignored catch bindings and `_`-prefixed args are intentional.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
      ],
    },
  },
]

export default eslintConfig
