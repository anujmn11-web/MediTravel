import { Capacitor } from '@capacitor/core';

/**
 * Capacitor initialization — runs once at app boot.
 *
 * Configures platform-specific behavior:
 * - On native: sets status bar to transparent overlay mode
 * - On web: no-ops gracefully
 */
export async function initCapacitor() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');

    // Use a transparent overlay so the WebView renders behind the status bar.
    // The CSS env(safe-area-inset-*) values then handle the content offset.
    await StatusBar.setOverlaysWebView({ overlay: true });
    await StatusBar.setStyle({ style: Style.Light });
  } catch {
    // Status bar plugin not available — safe to ignore
  }
}

// Auto-run on import
initCapacitor();
