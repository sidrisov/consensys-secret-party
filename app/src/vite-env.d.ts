/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_INIT_CONNECT: string;
  readonly VITE_ALCHEMY_API_KEY: string;
  readonly VITE_DEFAULT_NETWORK: string;
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_VERIFIER_SERVICE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const APP_VERSION: string;
