import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../hooks/useLocation';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

interface LocationSelectorProps {
  onLocationSelect: (location: any) => void;
  onBack: () => void;
}

interface LocationItem {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  onLocationSelect, 
  onBack 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentLocation, getAddressFromCoords } = useLocation();
  const enableLocationSelector = useFeatureFlag('enableLocationSelector');

  const mockLocations: LocationItem[] = [
    {
      id: '1',
      name: 'Accra Mall',
      address: 'Tetteh Quarshie Interchange, Accra',
      coordinates: { latitude: 5.6037, longitude: -0.1870 }
    },
    {
      id: '2',
      name: 'Kotoka International Airport',
      address: 'Airport City, Accra',
      coordinates: { latitude: 5.6052, longitude: -0.1668 }
    },
    {
      id: '3',
      name: 'Osu Oxford Street',
      address: 'Osu, Accra',
      coordinates: { latitude: 5.5560, longitude: -0.1764 }
    },
    {
      id: '4',
      name: 'Labadi Beach',
      address: 'Labadi, Accra',
      coordinates: { latitude: 5.6037, longitude: -0.1870 }
    },
    {
      id: '5',
      name: 'University of Ghana',
      address: 'Legon, Accra',
      coordinates: { latitude: 5.6500, longitude: -0.1870 }
    }
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const filtered = mockLocations.filter(location =>
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
        setLoading(false);
      }, 500);
    } else {
      setSearchResults(mockLocations);
    }
  }, [searchQuery]);

  const handleLocationPress = (location: LocationItem) => {
    onLocationSelect(location);
  };

  const renderLocationItem = ({ item }: { item: LocationItem }) => (
    <TouchableOpacity 
      style={styles.locationItem} 
      onPress={() => handleLocationPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.locationIcon}>
        <Ionicons name="location-outline" size={24} color="#007AFF" />
      </View>
      <View style={styles.locationDetails}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.panelTitle}>Select Location</Text>
        </View>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a location..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>

        <View style={styles.currentLocationContainer}>
          <TouchableOpacity 
            style={styles.currentLocationButton}
            onPress={() => currentLocation && handleLocationPress({
              id: 'current',
              name: 'Current Location',
              address: 'Your current position',
              coordinates: currentLocation
            })}
          >
            <Ionicons name="locate" size={20} color="#007AFF" />
            <Text style={styles.currentLocationText}>Use Current Location</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Popular Locations</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderLocationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.locationList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No locations found</Text>
              </View>
            }
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  panel: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  currentLocationContainer: {
    marginBottom: 20,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  currentLocationText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  locationList: {
    paddingBottom: 20,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  locationIcon: {
    marginRight: 12,
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
