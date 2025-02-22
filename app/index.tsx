
import { SplashScreen } from "expo-router";
import React from "react";
import LoadingBubble from "../components/auth/Loading";

SplashScreen.preventAutoHideAsync();

const App = () => {

  return <LoadingBubble />;
};

export default App;
