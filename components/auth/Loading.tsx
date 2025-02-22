import { ActivityIndicator, View } from "react-native";
import { useTheme } from "../../context/themeContext";

const LoadingBubble = () => {

  const { colors } = useTheme();

  return (
    <View style={{backgroundColor:colors.background}} className="flex-1 justify-center items-center">
      <View className="flex-row space-x-2">
        <ActivityIndicator size="large" color="#1C60DE" />
      </View>
    </View>
  );
};

export default LoadingBubble;
