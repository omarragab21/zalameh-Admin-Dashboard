/**
 * Terminal Logger Utility - Disabled for production & cPanel deployment
 */
export function sendTerminalLog(_payload?: {
  type: 'API_REQUEST' | 'API_RESPONSE' | 'API_ERROR' | 'ERROR' | 'LOG';
  method?: string;
  url?: string;
  status?: number;
  message?: string;
  data?: any;
  details?: any;
}): void {
  // Disabled
}

export function initTerminalLogger(): void {
  // Disabled
}

