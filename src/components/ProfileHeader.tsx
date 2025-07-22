import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export const ProfileHeader: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.greeting}>Hello, {user?.user_metadata?.full_name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  signOutButton: {
    padding: 8,
  },
  signOutText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});
