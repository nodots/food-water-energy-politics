/// <reference types="vite/client" />

// (optional) declare your custom key for better autocomplete
interface ImportMetaEnv {
  readonly VITE_API_BASE?: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
