declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALCHEMY_API_KEY: string;
      GOERLI_ETHERSCAN_API_KEY: string;
    }
  }
}
export {};
