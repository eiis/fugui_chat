import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import ChatPage from "./screens/ChatPage";
import HomeMain from "./screens/Home";
import SettingMain from "./screens/Setting";
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBarVisibleContext } from './utils/TabBarVisibleContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Home({ navigation }) {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='HomeMain'
				component={HomeMain}
				options={{
					title: "Home", headerShown: true, headerStyle: {
						backgroundColor: '#EEE3CB', // 设置导航栏背景色
					},
					headerTintColor: '#fff', // 设置导航栏标题和按钮颜色
					headerTitleStyle: {
						fontWeight: 'bold', // 设置导航栏标题样式
					},
					headerRight: () => (
						<TouchableOpacity onPress={() => navigation.navigate('ChatPage', { id: '' })}>
							<Text style={{ marginRight: 15, color: '#00DFA2' }}>新对话</Text>
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name='ChatPage'
				component={ChatPage}
				options={{
					title: "fuguiChat",
					headerShown: true,
					headerStyle: {
						backgroundColor: '#a5e89f',
					},
					headerTintColor: '#fff',
					headerTitleStyle: {
						fontWeight: 'bold',
					},
				}}
			/>
		</Stack.Navigator>
	);
}

function Settings() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='SettingMain'
				component={SettingMain}
				options={{ title: "设置", }}
			/>
		</Stack.Navigator>
	);
}

export default function App() {
	const [tabBarVisible, setTabBarVisible] = useState(true);

	return (
		<TabBarVisibleContext.Provider value={{ tabBarVisible, setTabBarVisible }}>
			<NavigationContainer>
				<Tab.Navigator screenOptions={({ route }) => ({
					// tabBarStyle: { display: 'none' },
					headerShown: false,
					tabBarStyle: {
						display: tabBarVisible ? 'flex' : 'none',
						backgroundColor: '#EEE3CB',  // 用你希望的颜色替换 'blue'
					},
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;
						// Select an icon based on the route name
						if (route.name === 'Home') {
							iconName = focused
								? 'chatbox-ellipses'
								: 'chatbox-ellipses-outline';
						} else if (route.name === 'Settings') {
							iconName = focused
								? 'settings'
								: 'settings-outline';
						}

						// Return an Ionicons component
						return <Ionicons name={iconName} size={size} color={color} />;
					},
				})}
					tabBarOptions={{
						activeTintColor: '#519259',  // active icon color
						inactiveTintColor: 'gray',  // inactive icon color
						tabBarIconSize: 24,  // icon size
					}}
				>
					<Tab.Screen name="Home" component={Home} />
					<Tab.Screen name="Settings" component={Settings} />
				</Tab.Navigator>
			</NavigationContainer>
		</TabBarVisibleContext.Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
