import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function Home({ navigation }) {

	const [msgs, setMesgs] = useState([{}])
	useFocusEffect(
		React.useCallback(() => {
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
		}, [])
	);

	return (
		<View style={styles.container}>
			<View>
				{msgs && msgs.map((msg, index) => (
					<TouchableOpacity
						key={index}
						onPress={() => navigation.navigate('ChatPage', { id: msg.id })}
						style={{
							margin: 5,
							padding: 10,
							backgroundColor: '#FFF',
							borderBottomWidth: 1,
							borderBottomColor: 'rgba(128, 128, 128, 0.5)',
						}}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<View style={{ marginRight: 10 }}>
								<Ionicons name={'chatbox-ellipses'} size={24} color={'#519259'} />
							</View>
							<View style={{ flex: 1, }}>
								<Text>随便聊聊</Text>
								<Text
									numberOfLines={1}
									ellipsizeMode='tail'
								>
									{msg.messages && msg.messages[msg.messages.length - 1].message}
								</Text>
							</View>
						</View>

					</TouchableOpacity>
				))}
			</View>
			<View>
				<Text
					style={{
						textAlign: 'center',
						marginBottom: 10
					}}
				>
					@ Powered by FUGUI-GPT
				</Text>
			</View>
			<StatusBar style='auto' />
		</View >
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		height: "100%",
		display: 'flex',
		flexDirection: 'column',
		// alignItems: 'center',
		justifyContent: 'space-between'
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
