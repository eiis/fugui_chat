import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, Animated } from "react-native";
import ChatPage from "./screens/ChatPage";
import HomeMain from "./screens/Home";
import SettingMain from "./screens/Setting";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBarVisibleContext } from './utils/TabBarVisibleContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

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
						backgroundColor: '#FFEEBB', // 设置导航栏背景色
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
						backgroundColor: '#FFEEBB',
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
						backgroundColor: '#FFEEBB',
					},
				}}
			/>
		</Stack.Navigator>
	);
}

// 在这里，我将创建一个新的组件来处理动画逻辑
const AnimatedTabIcon = ({ iconName, focused, color }) => {
	const iconSize = 24;
	const scaleValue = useState(new Animated.Value(1))[0];

	useEffect(() => {
		Animated.spring(scaleValue, {
			toValue: focused ? 1.25 : 1,
			friction: 4,
			useNativeDriver: true,
		}).start();
	}, [focused]);

	return (
		<Animated.View style={{ transform: [{ scale: scaleValue }] }}>
			<Ionicons name={iconName} size={iconSize} color={color} />
		</Animated.View>
	);
};

export default function App() {
	const [tabBarVisible, setTabBarVisible] = useState(true);

	return (
		<TabBarVisibleContext.Provider value={{ tabBarVisible, setTabBarVisible }}>
			<NavigationContainer>
				{/* <SafeAreaView style={{ flex: 1 }} edges={['top']}> */}
				<Tab.Navigator
					screenOptions={({ route }) => ({
						tabBarActiveTintColor: '#519259',
						tabBarInactiveTintColor: 'gray',
						headerShown: false,
						tabBarStyle: {
							display: tabBarVisible ? 'flex' : 'none',
							// backgroundColor: '#FFEEBB',  // 用你希望的颜色替换 'blue'
						},
						animation: 'slide_from_right', //添加的动画效果
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
							return <AnimatedTabIcon iconName={iconName} focused={focused} color={color} />;;
						},
					})}
				>
					<Tab.Screen name="Home" component={Home} />
					<Tab.Screen name="Settings" component={Settings} />
				</Tab.Navigator>
				{/* </SafeAreaView> */}
			</NavigationContainer>
		</TabBarVisibleContext.Provider>
	);
}
