import { useState, useEffect } from 'react';
import Constants from 'expo-constants';

interface FeatureFlags {
  enableMapbox: boolean;
  enableRideTracking: boolean;
  enableLocationSelector: boolean;
  enablePayment: boolean;
  enableSafetyFeatures: boolean;
  enableDriverMode: boolean;
  enableLoyaltyProgram: boolean;
  enableReferrals: boolean;
}

const defaultFlags: FeatureFlags = {
  enableMapbox: false,
  enableRideTracking: true,
  enableLocationSelector: true,
  enablePayment: true,
  enableSafetyFeatures: false,
  enableDriverMode: false,
  enableLoyaltyProgram: false,
  enableReferrals: false,
};

const getFeatureFlag = (key: keyof FeatureFlags): boolean => {
  const envKey = `EXPO_PUBLIC_${key.toUpperCase()}`;
  const value = Constants.expoConfig?.extra?.[key] || process.env[envKey];
  
  if (value === undefined) {
    return defaultFlags[key];
  }
  
  return value === 'true' || value === true;
};

export const useFeatureFlag = (flag: keyof FeatureFlags): boolean => {
  const [isEnabled, setIsEnabled] = useState(() => getFeatureFlag(flag));

  useEffect(() => {
    setIsEnabled(getFeatureFlag(flag));
  }, [flag]);

  return isEnabled;
};

export const useAllFeatureFlags = (): FeatureFlags => {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);

  useEffect(() => {
    const newFlags: FeatureFlags = {
      enableMapbox: getFeatureFlag('enableMapbox'),
      enableRideTracking: getFeatureFlag('enableRideTracking'),
      enableLocationSelector: getFeatureFlag('enableLocationSelector'),
      enablePayment: getFeatureFlag('enablePayment'),
      enableSafetyFeatures: getFeatureFlag('enableSafetyFeatures'),
      enableDriverMode: getFeatureFlag('enableDriverMode'),
      enableLoyaltyProgram: getFeatureFlag('enableLoyaltyProgram'),
      enableReferrals: getFeatureFlag('enableReferrals'),
    };
    setFlags(newFlags);
  }, []);

  return flags;
};

export const updateFeatureFlag = (flag: keyof FeatureFlags, value: boolean) => {
  // In a real app, this would update remote config
  console.log(`Feature flag ${flag} updated to ${value}`);
};
