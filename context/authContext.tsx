import { SERVER_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import { GoogleAuthProvider, IdTokenResult, onAuthStateChanged, signInWithCredential, signOut, User, UserInfo, UserMetadata } from 'firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from '../components/auth/firebaseConfig';
import { UserData } from '../types/user';
import LoadingBubble from '../components/auth/Loading';

type AuthContextType = {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
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
  const [user, setUser] = useState<UserData | null>(null);

  // Check local user and Firebase auth state
  const checkLocalUser = async () => {
    try {
      const userJSON = await AsyncStorage.getItem('@user');
      const localUser = userJSON ? JSON.parse(userJSON) : null;
      console.log(localUser);
      if (localUser) {
        setUser(localUser);
      }
    } catch (e) {
      console.error('Error fetching user from AsyncStorage', e);
    }
  };

  useEffect(() => {
    checkLocalUser();

    const fetchUserDetails = async (firebaseUser: User) => {
      try {
        console.log('Try Login...');
        const response = await axios.post(`${SERVER_URL}/user/login`,{
          firebase_uid:firebaseUser.uid
        });
        const userData = response.data;

        if (userData.message === "User not found" && firebaseUser?.providerData[0].providerId === 'google.com'){
          console.warn('User not found and goto /(auth)/googleRegis');
          router.replace('/(auth)/googleRegis');
        }
        if (userData.message === "User not found") {
          console.warn('User not found Loading.....');
          return <LoadingBubble />;
        }
        
        else {
          console.warn('.....Have User in Data base.....');
          const { _id, birth_date, gender, weight, height, activity, calorie_need } = response.data.user;
          const serverToken = response.data.token;
          const extendedUser: UserData = {
            ...firebaseUser,
            _id,
            serverToken,
            birth_date,
            gender,
            weight,
            height,
            activity,
            calorie_need,
          };
          console.log(' :=========== userData ===========: \n',extendedUser);
          setUser(extendedUser);

          await AsyncStorage.setItem('@user', JSON.stringify(extendedUser));
        }
      } catch (error) {
        console.warn('Can not get user data:', error);
      }
    };

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        fetchUserDetails(firebaseUser)
      } else {
        //  setUser(dummyUser);
        //  AsyncStorage.setItem('@user', JSON.stringify(dummyUser));
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
      const response = await axios.post(`${SERVER_URL}/user/logout`);
      const res = response.data
      console.log('message :',res.message);

      await AsyncStorage.removeItem('@user');
      setUser(null);
    } catch (error) {
      console.error('Sign-out failed', error);
    }
  };


  return (
    <AuthContext.Provider value={{ user, setUser, loginWithGoogle, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

const dummyUser: UserData = {
  _id:'23nioqabngsrntgkl',
  serverToken:'eyencjwe21m3f.ewf32fsdf4gdfbf5dhg',
  uid: "dummyUid123",
  email: "dummyuser@example.com",
  emailVerified: true,
  displayName: "Dummy User",
  birth_date: new Date(),
  gender: 1,
  weight: 65.8,
  height: 172.9,
  activity: 3,
  calorie_need: 2648,
  isAnonymous: false,
  phoneNumber: null,
  photoURL: null,
  providerId: "firebase",
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  } as UserMetadata,
  providerData: [
    {
      providerId: "password",
      uid: "dummyUid123",
      displayName: "Dummy User",
      email: "dummyuser@example.com",
      phoneNumber: null,
      photoURL: null,
    } as UserInfo,
  ],
  refreshToken: "dummyRefreshToken123",
  tenantId: null,
  delete: async () => {
    console.log("User deleted.");
    return Promise.resolve();
  },
  getIdToken: async (forceRefresh?: boolean) => {
    console.log(`getIdToken called with forceRefresh: ${forceRefresh}`);
    return "dummyIdToken";
  },
  getIdTokenResult: async (forceRefresh?: boolean): Promise<IdTokenResult> => {
    console.log(`getIdTokenResult called with forceRefresh: ${forceRefresh}`);
    return {
      token: "dummyIdToken",
      expirationTime: new Date().toISOString(),
      authTime: new Date().toISOString(),
      issuedAtTime: new Date().toISOString(),
      signInProvider: "password",
      claims: {},
      signInSecondFactor: null, // Include this field as it's required by `IdTokenResult`.
    };
  },
  reload: async () => {
    console.log("User reloaded.");
    return Promise.resolve();
  },
  toJSON: () => ({
    uid: "dummyUid123",
    email: "dummyuser@example.com",
    emailVerified: true,
    displayName: "Dummy User",
    isAnonymous: false,
    phoneNumber: null,
    photoURL: undefined,
    providerId: "firebase",
    refreshToken: "dummyRefreshToken123",
  }),
};

