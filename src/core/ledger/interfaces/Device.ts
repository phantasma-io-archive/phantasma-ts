export interface Device {
  enabled: boolean;
  error?: boolean;
  message?: string;
  device?: any; // Define the type based on your device's type
}
