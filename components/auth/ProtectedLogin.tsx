import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import LoadingBubble from './Loading';

type Props = {
  children: React.ReactNode;
};

const ProtectedLogin: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkLocalUser = async () => {
      try {
        const userJSON = await AsyncStorage.getItem('@user');
        const userData = userJSON ? JSON.parse(userJSON) : null;
        if (userData) {
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error('Error fetching user from AsyncStorage', e);
        setLoading(false);
      }
    };

    checkLocalUser();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/welcome');
        // router.replace('/(tabs)/home');
      } else {
        router.replace('/(tabs)/home');
      }
    }
  }, [loading, user, router]);

  if (loading) {
    return <LoadingBubble />;
  }

  return <>{children}</>;
};

export default ProtectedLogin;