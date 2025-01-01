import { Tabs } from "expo-router";
import React from "react";
import Svg, { SvgProps } from 'react-native-svg';
import { Text, View } from "react-native";
import { CalendarIcon, CaptureIcon, CommunityIcon, HomeIcon, MenuIcon } from "../../constants/icon";
import Calendar from "./calendar/_layout";

interface TabIconProps {
  icon: React.FC<SvgProps>;
  color?: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon: Icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center w-[74px] p-1">
      <Icon width={30} height={30} color={color || (focused ? 'blue' : 'gray')} />
      <Text className={`${focused?"text-primary":"text-nonFocus"} text-sm w-max`}>
        {name}
      </Text>
    </View>
  );
};
const CameraIcon: React.FC<TabIconProps> = ({ icon: Icon, color, focused }) => {
  return (
    <View className={`${focused? 'w-[64px] h-[64px] bg-white border-4 border-primary':'w-[58px] h-[58px] bg-primary'} flex items-center justify-center rounded-[24px] p-1 -translate-y-1`}>
      <Icon width={40} height={40} color={(focused ? color : 'white')} />
    </View>
  );
};

const TabsLayout = () => {
  return (
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#1C60DE',
          tabBarInactiveTintColor: '#B8D0D2',
          tabBarStyle:{
            height:87,
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            paddingTop:7,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 5,
          },
          animation:'shift',
        }}
      >
        <Tabs.Screen
          name="home"
          options={{ headerShown: false, title: "Home", tabBarIcon:({color,focused})=>(
            <TabIcon
              icon={HomeIcon}
              color={color}
              name="Home"
              focused={focused}
            />
            )
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{ headerShown: false, tabBarIcon:({color,focused})=>(
            <TabIcon
              icon={CalendarIcon}
              color={color}
              name="Calendar"
              focused={focused}
            />
            )
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{ headerShown: false, tabBarIcon:({color,focused})=>(
            <CameraIcon
              icon={CaptureIcon}
              color={color}
              focused={focused}
              name={""}
            />
            )
          }}
        />
        <Tabs.Screen
          name="community"
          options={{ headerShown: false, tabBarIcon:({color,focused})=>(
            <TabIcon
              icon={CommunityIcon}
              color={color}
              name="Community"
              focused={focused}
            />
            )
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{ headerShown: false, tabBarIcon:({color,focused})=>(
            <TabIcon
              icon={MenuIcon}
              color={color}
              name="Menu"
              focused={focused}
            />
            )
          }}
        />
      </Tabs>
  );
};

export default TabsLayout;
