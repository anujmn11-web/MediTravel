import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

/**
 * Gets the current position using Capacitor Geolocation plugin on native platforms
 * or HTML5 Geolocation API on web platforms.
 * 
 * @param {Object} options - Position options (enableHighAccuracy, timeout, maximumAge)
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export async function getCurrentPosition(options = { enableHighAccuracy: true, timeout: 10000 }) {
  if (Capacitor.isNativePlatform()) {
    // Native platform (Android / iOS)
    try {
      // Check and request permissions if needed
      let permStatus = await Geolocation.checkPermissions();
      if (permStatus.location !== 'granted') {
        permStatus = await Geolocation.requestPermissions();
      }

      if (permStatus.location === 'granted' || permStatus.coarseLocation === 'granted') {
        const position = await Geolocation.getCurrentPosition(options);
        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } else {
        throw new Error('Location permission denied on device.');
      }
    } catch (err) {
      console.warn('Native geolocation failed, falling back to browser API:', err);
      return getBrowserPosition(options);
    }
  } else {
    // Web / Browser platform
    return getBrowserPosition(options);
  }
}

function getBrowserPosition(options) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      options
    );
  });
}
