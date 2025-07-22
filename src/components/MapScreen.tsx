import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import { useLocation } from '../hooks/useLocation';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

interface MapScreenProps {
  onLocationSelect: () => void;
  onMapPress?: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({ 
  onLocationSelect, 
  onMapPress 
}) => {
  const mapRef = useRef<MapView>(null);
  const { currentLocation, loading } = useLocation();
  const enableMapbox = useFeatureFlag('enableMapbox');

  useEffect(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  }, [currentLocation]);

  const handleMapPress = () => {
    onMapPress?.();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading map...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
        initialRegion={{
          latitude: currentLocation?.latitude || 5.6037,
          longitude: currentLocation?.longitude || -0.1870,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onPress={handleMapPress}
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Your Location"
            description="Current position"
            pinColor="#007AFF"
          />
        )}
      </MapView>
      
      <View style={styles.overlay}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>🚗</Text>
              </View>
              <View style={styles.titleText}>
                <Text style={styles.title}>RideOver</Text>
                <Text style={styles.subtitle}>Your ride, your way</Text>
              </View>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.fab} 
          onPress={onLocationSelect}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>Book a Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
  },
  titleText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
