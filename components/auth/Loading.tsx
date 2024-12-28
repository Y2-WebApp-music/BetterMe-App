import { ActivityIndicator, View } from "react-native";

const LoadingBubble = () => {
  return (
    <View className="flex-1 justify-center items-center bg-primaryblue-300">
      <View className="flex-row space-x-2">
        <ActivityIndicator size="large" color="#1C60DE" />
      </View>
    </View>
  );
};

export default LoadingBubble;
