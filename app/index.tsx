import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { BetterMeIcon } from '../constants/icon';

export default function App() {
  return (
    <View className="flex-1 gap-2 justify-center items-center bg-Background">
      <BetterMeIcon width={80} height={80} color={"#1C60DE"}/>
      <Text className='text-[40px] font-notoSemiBold text-primary'>Better Me</Text>
      <Text className='text-xl font-notoMedium text-primary'>ชีวิตดีๆที่ลงตัว</Text>
      <View className="flex-row space-x-2 pt-10">
        <ActivityIndicator size="large" color="#1C60DE" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3FEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});