/**
 * Terminal Logger Utility forwarding browser console errors and API logs to Vite Terminal Server
 */
export function sendTerminalLog(payload: {
  type: 'API_REQUEST' | 'API_RESPONSE' | 'API_ERROR' | 'ERROR' | 'LOG';
  method?: string;
  url?: string;
  status?: number;
  message?: string;
  data?: any;
  details?: any;
}) {
  try {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/__terminal_log', blob);
    } else {
      fetch('/__terminal_log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }
  } catch (e) {
    // Ignore logger network errors
  }
}

/**
 * Initializes global browser error listeners to forward all uncaught errors & console.errors to IDE terminal
 */
export function initTerminalLogger() {
  window.addEventListener('error', (event) => {
    sendTerminalLog({
      type: 'ERROR',
      message: event.message,
      details: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      },
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    sendTerminalLog({
      type: 'ERROR',
      message: `Unhandled Promise Rejection: ${event.reason?.message || event.reason}`,
      details: {
        reason: event.reason,
      },
    });
  });

  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    originalConsoleError.apply(console, args);
    sendTerminalLog({
      type: 'ERROR',
      message: args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '),
    });
  };
}
