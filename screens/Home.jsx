import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({ navigation }) {

	const [msgs, setMesgs] = useState([{}])
	useEffect(() => {
		const getApiKey = async () => {
			try {
				const value = await AsyncStorage.getItem('@chat_List');
				if (value !== null) {
					console.log(JSON.parse(value), 'value')
					setMesgs(JSON.parse(value))
				}
			} catch (e) {
				console.error(e);
			}
		}
		getApiKey();
	}, []);

	return (
		<View style={styles.container}>
			{/* <Image
				source={require("../assets/curve.png")}
				style={{
					position: "absolute",
					top: 0,
					height: 100,
					width: "100%",
					backgroundColor: "#090a09",
				}}
			/> */}
			{msgs && msgs.map((msg, index) => (
				<TouchableOpacity
					key={index}
					onPress={() => navigation.navigate('ChatPage', { id: msg.id })}
					style={{
						margin: 5,
						padding: 10,
						backgroundColor: '#FFE9A0',
					}}
				>
					<Text>
						{msg.id}
					</Text>
				</TouchableOpacity>
			))}
			<Text
				style={{
					paddingTop: 10,
					fontSize: 13,
					position: "absolute",
					bottom: 20,
				}}
			>
				@ Powered by CHAT-GPT
			</Text>
			<StatusBar style='auto' />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		// alignItems: "center",
		// justifyContent: "center",
		height: "100%",
	},
	button: {
		width: 300,
		textAlign: "center",
		backgroundColor: "#a5e89f",
		borderRadius: 10,
		color: "white",
		paddingVertical: 10,
		paddingHorizontal: 17,
		fontSize: 20,
	},
	moveUpDown: {
		transform: [{ translateY: -10 }, { translateY: 10 }],
	},
	text: {
		fontSize: 20,
		paddingBottom: 14,
	},
});
