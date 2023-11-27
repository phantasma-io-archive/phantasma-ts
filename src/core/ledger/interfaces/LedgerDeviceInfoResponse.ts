import { VersionResponse } from './VersionResponse';
import { ApplicationNameResponse } from './ApplicationNameResponse';

export interface LedgerDeviceInfoResponse {
  version: VersionResponse;
  applicationName: ApplicationNameResponse;
}
