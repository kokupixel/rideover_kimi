import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationType {
  latitude: number;
  longitude: number;
  address?: string;
}

export const useLocation = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationType | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      if (status === 'granted') {
        await getCurrentLocation();
      }
      
      return status;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return 'denied';
    }
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setCurrentLocation(coords);
      return coords;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      if (address) {
        return `${address.street || ''} ${address.city || ''}`.trim();
      }
      return 'Address not found';
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Address unavailable';
    }
  };

  const watchLocation = (callback: (location: LocationType) => void) => {
    return Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      },
      (location) => {
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    );
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return {
    currentLocation,
    permissionStatus,
    loading,
    requestLocationPermission,
    getCurrentLocation,
    getAddressFromCoords,
    watchLocation,
  };
};
