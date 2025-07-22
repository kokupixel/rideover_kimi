import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

interface BookingPanelProps {
  pickupLocation: any;
  dropoffLocation: any;
  onBack: () => void;
  onConfirm: (rideDetails: any) => void;
}

interface RideOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: string;
  icon: string;
}

export const BookingPanel: React.FC<BookingPanelProps> = ({ 
  pickupLocation, 
  dropoffLocation, 
  onBack, 
  onConfirm 
}) => {
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const enablePayment = useFeatureFlag('enablePayment');

  const rideOptions: RideOption[] = [
    {
      id: 'economy',
      name: 'Economy',
      description: 'Affordable rides for everyday travel',
      price: 15,
      estimatedTime: '5-10 min',
      icon: 'car-outline'
    },
    {
      id: 'comfort',
      name: 'Comfort',
      description: 'Newer cars with extra legroom',
      price: 25,
      estimatedTime: '3-7 min',
      icon: 'car-sport-outline'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Luxury cars for special occasions',
      price: 40,
      estimatedTime: '2-5 min',
      icon: 'car-sport'
    }
  ];

  const handleConfirm = () => {
    if (selectedRide) {
      const selectedOption = rideOptions.find(opt => opt.id === selectedRide);
      onConfirm({
        pickupLocation,
        dropoffLocation,
        rideType: selectedRide,
        price: selectedOption?.price || 0,
        estimatedTime: selectedOption?.estimatedTime || '5-10 min'
      });
    }
  };

  const renderRideOption = (option: RideOption) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.rideOption,
        selectedRide === option.id && styles.selectedRideOption
      ]}
      onPress={() => setSelectedRide(option.id)}
      activeOpacity={0.8}
    >
      <View style={styles.rideOptionContent}>
        <View style={styles.rideIcon}>
          <Ionicons name={option.icon as any} size={32} color="#007AFF" />
        </View>
        <View style={styles.rideDetails}>
          <Text style={styles.rideName}>{option.name}</Text>
          <Text style={styles.rideDescription}>{option.description}</Text>
          <Text style={styles.rideTime}>{option.estimatedTime}</Text>
        </View>
        <View style={styles.ridePrice}>
          <Text style={styles.priceText}>GHS {option.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.panelTitle}>Confirm Ride</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.locationSection}>
            <Text style={styles.sectionTitle}>Trip Details</Text>
            
            <View style={styles.locationRow}>
              <View style={styles.locationDot} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Pickup</Text>
                <Text style={styles.locationText}>{pickupLocation?.name || 'Current Location'}</Text>
              </View>
            </View>

            <View style={styles.locationDivider} />

            <View style={styles.locationRow}>
              <View style={[styles.locationDot, styles.destinationDot]} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Destination</Text>
                <Text style={styles.locationText}>{dropoffLocation?.name || 'Select destination'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.rideOptionsSection}>
            <Text style={styles.sectionTitle}>Choose your ride</Text>
            {rideOptions.map(renderRideOption)}
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Trip Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Distance</Text>
              <Text style={styles.summaryValue}>~5.2 km</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Estimated time</Text>
              <Text style={styles.summaryValue}>15-20 min</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Payment method</Text>
              <Text style={styles.summaryValue}>Cash</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              !selectedRide && styles.disabledButton
            ]}
            onPress={handleConfirm}
            disabled={!selectedRide}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>
              {selectedRide ? 'Confirm Ride' : 'Select a ride type'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  locationSection: {
    marginBottom: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    marginRight: 12,
  },
  destinationDot: {
    backgroundColor: '#FF3B30',
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  locationDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginLeft: 24,
    marginVertical: 8,
  },
  rideOptionsSection: {
    marginBottom: 24,
  },
  rideOption: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedRideOption: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  rideOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideIcon: {
    marginRight: 12,
  },
  rideDetails: {
    flex: 1,
  },
  rideName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  rideDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  rideTime: {
    fontSize: 12,
    color: '#007AFF',
  },
  ridePrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
