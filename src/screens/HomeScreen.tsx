import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { MapScreen } from '../components/MapScreen';
import { LocationSelector } from '../components/LocationSelector';
import { BookingPanel } from '../components/BookingPanel';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

interface LocationType {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export const HomeScreen: React.FC = () => {
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [showBookingPanel, setShowBookingPanel] = useState(false);
  const [pickupLocation, setPickupLocation] = useState<LocationType | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<LocationType | null>(null);
  const [bookingStep, setBookingStep] = useState<'pickup' | 'dropoff'>('pickup');

  const enableLocationSelector = useFeatureFlag('enableLocationSelector');

  const handleLocationSelect = () => {
    setShowLocationSelector(true);
  };

  const handleLocationSelected = (location: LocationType) => {
    if (bookingStep === 'pickup') {
      setPickupLocation(location);
      setBookingStep('dropoff');
      setShowLocationSelector(true);
    } else {
      setDropoffLocation(location);
      setShowLocationSelector(false);
      setShowBookingPanel(true);
    }
  };

  const handleBookingBack = () => {
    setShowBookingPanel(false);
    setDropoffLocation(null);
    setBookingStep('dropoff');
    setShowLocationSelector(true);
  };

  const handleBookingConfirm = (rideDetails: any) => {
    console.log('Booking confirmed:', rideDetails);
    // Here you would typically navigate to a ride tracking screen
    // or send the booking to your backend
    setShowBookingPanel(false);
    setPickupLocation(null);
    setDropoffLocation(null);
    setBookingStep('pickup');
  };

  const handleLocationSelectorBack = () => {
    setShowLocationSelector(false);
    if (bookingStep === 'dropoff') {
      setBookingStep('pickup');
      setDropoffLocation(null);
    } else {
      setPickupLocation(null);
    }
  };

  return (
    <View style={styles.container}>
      <MapScreen onLocationSelect={handleLocationSelect} />
      
      <Modal
        visible={showLocationSelector}
        animationType="slide"
        transparent
        onRequestClose={() => setShowLocationSelector(false)}
      >
        <LocationSelector
          onLocationSelect={handleLocationSelected}
          onBack={handleLocationSelectorBack}
        />
      </Modal>

      <Modal
        visible={showBookingPanel}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBookingPanel(false)}
      >
        <BookingPanel
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          onBack={handleBookingBack}
          onConfirm={handleBookingConfirm}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
