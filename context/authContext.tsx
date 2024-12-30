import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithCredential, GoogleAuthProvider, User, signOut } from 'firebase/auth';
import { auth } from '../components/auth/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  user: User | null;
  loginWithGoogle: (id_token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check local user and Firebase auth state
  const checkLocalUser = async () => {
    try {
      const userJSON = await AsyncStorage.getItem('@user');
      const userData = userJSON ? JSON.parse(userJSON) : null;
      console.log(userData);
      if (userData) {
        setUser(userData);
      }
    } catch (e) {
      console.error('Error fetching user from AsyncStorage', e);
    }
  };

  useEffect(() => {
    checkLocalUser();

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        AsyncStorage.setItem('@user', JSON.stringify(firebaseUser));
      } else {
        setUser(null);
        AsyncStorage.removeItem('@user');
      }
    });

    return () => unsub();
  }, []);

  // Login with Google using the ID token
  const loginWithGoogle = async (id_token: string) => {
    const credential = GoogleAuthProvider.credential(id_token);
    await signInWithCredential(auth, credential);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('@user');
      setUser(null);
    } catch (error) {
      console.error('Sign-out failed', error);
    }
  };


  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};