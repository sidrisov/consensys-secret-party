import { SecretPartyList } from '../../../smart-contracts/typechain-types/contracts/SecretPartyList';
import { AppSettings } from './AppSettingsType';

export interface UserContextType {
  isWalletConnected: boolean;
  userAddress: string | undefined;
  contract: SecretPartyList;
  appSettings: AppSettings;
  setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}
