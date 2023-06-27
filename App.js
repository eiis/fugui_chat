import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import ChatPage from "./screens/ChatPage";
import HomeMain from "./screens/Home";
import SettingMain from "./screens/Setting";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBarVisibleContext } from './utils/TabBarVisibleContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Home({ navigation }) {

	const [refreshKey, setRefreshKey] = useState(0);

	const deleteChatList = async () => {
		const chatLists = await AsyncStorage.getItem('@chat_List');
		if (chatLists && chatLists.length > 0) {
			await AsyncStorage.removeItem('@chat_List');
			setRefreshKey(refreshKey => refreshKey + 1);
		}
	}
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='HomeMain'
				// component={HomeMain}
				children={(props) => <HomeMain {...props} refreshKey={refreshKey} />}
				options={{
					title: "",
					headerShown: true,
					headerStyle: {
						backgroundColor: '#EEE3CB', // 设置导航栏背景色
					},
					headerTintColor: '#fff', // 设置导航栏标题和按钮颜色
					headerTitleStyle: {
						fontWeight: 'bold', // 设置导航栏标题样式
					},
					headerLeft: () => (
						<TouchableOpacity onPress={deleteChatList}>
							<AntDesign name="delete" size={24} color="black" />
						</TouchableOpacity>
					),
					headerRight: () => (
						<TouchableOpacity onPress={() => navigation.navigate('ChatPage', { id: '' })}>
							<Text style={{ color: '#00DFA2' }}>新对话</Text>
						</TouchableOpacity>
					),
				}}
			/>
			<Stack.Screen
				name='ChatPage'
				component={ChatPage}
				options={{
					title: "随便聊聊",
					headerShown: true,
					headerStyle: {
						backgroundColor: '#EEE3CB',
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
				options={{
					title: "设置",
					headerStyle: {
						backgroundColor: '#EEE3CB',
					},
				}}
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
