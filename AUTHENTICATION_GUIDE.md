# RideOver Authentication System Guide

## Overview
This guide documents the complete authentication system implemented for the RideOver driver app, built with React Native, Expo, and Supabase.

## Architecture

### Core Components
1. **AuthContext** (`src/contexts/AuthContext.tsx`) - Global authentication state management
2. **useAuth Hook** (`src/hooks/useAuth.ts`) - Authentication methods and user state
3. **LoginScreen** (`src/screens/LoginScreen.tsx`) - User login interface
4. **RegisterScreen** (`src/screens/RegisterScreen.tsx`) - User registration interface
5. **ProfileHeader** (`src/components/ProfileHeader.tsx`) - User profile display with sign-out
6. **LoadingScreen** (`src/components/LoadingScreen.tsx`) - Loading state during auth checks

### Authentication Flow
```
App Launch → LoadingScreen → Auth Check → 
├── Not Authenticated → LoginScreen → RegisterScreen (optional)
└── Authenticated → HomeScreen with ProfileHeader
```

## Features Implemented

### ✅ User Registration
- Email/password registration
- Full name and phone number collection
- Email verification required
- Form validation (password length, email format)
- Loading states and error handling

### ✅ User Login
- Email/password authentication
- Remember me functionality (via Supabase session)
- Error handling for invalid credentials
- Loading states

### ✅ Session Management
- Automatic session restoration on app restart
- Real-time auth state listener
- Secure token storage via Supabase
- Automatic sign-out on session expiry

### ✅ User Profile
- Display user information (name, email)
- Sign-out functionality with confirmation
- Profile updates (via updateProfile method)

### ✅ Security Features
- Password validation (minimum 6 characters)
- Email format validation
- Secure password storage (hashed via Supabase)
- Session timeout handling

## Setup Instructions

### 1. Environment Configuration
Create a `.env` file in the root directory:
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Setup
1. Create a new Supabase project
2. Set up the authentication providers (Email/Password)
3. Create a `profiles` table with the following schema:
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

### 3. Install Dependencies
```bash
npm install @supabase/supabase-js
```

## Usage Examples

### Using Authentication in Components
```typescript
import { useAuth } from '../hooks/useAuth';

const MyComponent = () => {
  const { user, signIn, signOut, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  
  if (!user) return <LoginScreen />;

  return <Text>Welcome, {user.user_metadata.full_name}!</Text>;
};
```

### Registering a New User
```typescript
const handleRegister = async (email: string, password: string, fullName: string, phone: string) => {
  try {
    await signUp(email, password, fullName, phone);
    // User registered successfully, check email for verification
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
};
```

### Updating User Profile
```typescript
const handleUpdateProfile = async (updates: { full_name?: string; phone?: string }) => {
  try {
    await updateProfile(updates);
    // Profile updated successfully
  } catch (error) {
    console.error('Profile update failed:', error.message);
  }
};
```

## API Reference

### AuthContext Methods
- `signIn(email: string, password: string): Promise<void>`
- `signUp(email: string, password: string, fullName: string, phone: string): Promise<void>`
- `signOut(): Promise<void>`
- `updateProfile(updates: Partial<User>): Promise<void>`

### AuthContext State
- `user: User | null` - Current authenticated user
- `loading: boolean` - Authentication loading state

## Error Handling
The system includes comprehensive error handling for:
- Network connectivity issues
- Invalid credentials
- Email already in use
- Weak passwords
- Session expiry

## Security Considerations
- All passwords are hashed using bcrypt
- Sessions are managed securely via Supabase
- Row Level Security (RLS) is enabled on user data
- API keys are stored in environment variables
- No sensitive data is logged

## Testing
### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:e2e
```

## Next Steps
1. Add social authentication (Google, Facebook)
2. Implement password reset flow
3. Add biometric authentication
4. Create driver-specific registration flow
5. Add email verification screen
6. Implement role-based access control

## Troubleshooting

### Common Issues

**"Network request failed"**
- Check internet connection
- Verify Supabase URL and key are correct

**"Invalid login credentials"**
- Ensure email is verified
- Check for typos in email/password

**"User already registered"**
- User should use login instead of register
- Or reset password if forgotten

### Debug Mode
Enable debug logging by setting:
```typescript
// In AuthContext.tsx
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);
```

## Support
For issues or questions, please check:
1. Supabase documentation: https://supabase.com/docs
2. React Native documentation: https://reactnative.dev/docs
3. Expo documentation: https://docs.expo.dev/
