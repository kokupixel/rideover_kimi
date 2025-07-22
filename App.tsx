import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { LoadingScreen } from './src/components/LoadingScreen';
import { AuthProvider } from './src/contexts/AuthContext';
import { useAuth } from './src/hooks/useAuth';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'home'>('login');
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    switch (currentScreen) {
      case 'login':
        return (
          <LoginScreen
            onNavigateToRegister={() => setCurrentScreen('register')}
            onLoginSuccess={() => setCurrentScreen('home')}
          />
        );
      case 'register':
        return (
          <RegisterScreen
            onNavigateToLogin={() => setCurrentScreen('login')}
            onRegisterSuccess={() => setCurrentScreen('login')}
          />
        );
      default:
        return (
          <LoginScreen
            onNavigateToRegister={() => setCurrentScreen('register')}
            onLoginSuccess={() => setCurrentScreen('home')}
          />
        );
    }
  }

  return <HomeScreen />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
