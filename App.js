import "./gesture-handler";
import { StatusBar } from "expo-status-bar";
import { SafeAreaViewComponent, StyleSheet, Text, View } from "react-native";
const { Navigator, Screen } = createStackNavigator();
import Home from "./Home";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import VideoScreen from "./VideoScreen";
export default function App() {
  return (
    <NavigationContainer >
      <Navigator screenOptions={{headerShown:false}}>
        <Screen name="Home" component={Home} />
        <Screen name="VideoScreen" component={VideoScreen} />
      </Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}