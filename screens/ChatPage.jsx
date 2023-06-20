import React, { useState, useContext, useRef, useEffect, useCallback } from "react";
import { TabBarVisibleContext } from '../App';
import { Typewriter } from '../utils/01'
import * as Clipboard from 'expo-clipboard';

import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	ScrollView,
	SafeAreaView
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";


const ChatPage = () => {
	const { setTabBarVisible } = useContext(TabBarVisibleContext);

	const scrollViewRef = useRef();
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([
		{
			message: "Hi! How can I help you ?",
			sender: "ai",
		},
	]);

	useEffect(() => {
		// 在页面加载时隐藏Tab Bar
		setTabBarVisible(false);

		// 在页面卸载时显示Tab Bar
		return () => setTabBarVisible(true);
	}, []);

	const send = async () => {
		if (message) {
			await setMessages([...messages, { message: message, sender: "user" }]);
			setMessage("");
			await sendMessage();
		}
	};

	const copyToClipboard = async (text) => {
		await Clipboard.setStringAsync(text);
		alert('已复制');
	};

	const parsePack = (str) => {
		// 定义正则表达式匹配模式
		const pattern = /data:\s*({.*?})\s*\n/g
		// 定义一个数组来存储所有匹 配到的 JSON 对象
		const result = []
		// 使用正则表达式匹配完整的 JSON 对象并解析它们
		let match
		while ((match = pattern.exec(str)) !== null) {
			const jsonStr = match[1]
			try {
				const json = JSON.parse(jsonStr)
				result.push(json)
			} catch (e) {
				console.log(e)
			}
		}
		// 输出所有解析出的 JSON 对象
		return result
	}


	const sendMessage = async () => {
		const options = {
			method: "POST",
			url: 'https://chat.fugui.info/v1/chat/completions',
			headers: {
				'content-type': 'application/json',
				"Authorization": "Bearer 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"
			},
			data: {
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'user',
						content: message
					}
				]
			}
		};
		try {
			const response = await axios.request(options);
			console.log('response', JSON.stringify(response.data.choices[0].message.content))
			setMessages([
				...messages,
				{ message: message, sender: "user" },
				{ message: response.data.choices[0].message.content, sender: "ai" },
			]);
		} catch (error) {
			console.error(error);
			setMessages([
				...messages,
				{ message: "sry...try again...", sender: "ai" },
			]);
		}
	};



	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: "#fff",
				height: "100%",
			}}
		>
			<Image
				source={require("../assets/bot.jpg")}
				style={{
					width: 300,
					height: 300,
					position: "absolute",
					top: 250,
					bottom: 0,
					left: 40,
					right: 0,
					justifyContent: "center",
					alignItems: "center",
					opacity: 0.4,
				}}
			/>
			<ScrollView
				style={{
					flex: 1,
					color: "black",
					overflow: "scroll",
					margin: 10,
					// paddingTop: 10,
				}}
				ref={scrollViewRef}
				onContentSizeChange={() =>
					scrollViewRef.current.scrollToEnd({ animated: true })
				}
			>
				{messages.map((msg, index) => (
					<View
						key={index}
						style={{
							display: "flex",
							justifyContent:
								msg.sender === "user" ? "flex-end" : "flex-start",
							flexDirection: "row",
							flexWrap: "wrap",
							alignItems: "flex-end",
						}}
					>
						{msg.sender !== "user" && (
							<Image
								style={{
									width: 25,
									height: 25,
									marginRight: 7,
									marginBottom: 6,
									borderRadius: 50,
									borderWidth: 1,
									borderColor: "#a5e89f",
								}}
								source={require("../assets/bot.png")}
							/>
						)}
						<Text
							selectable
							onPress={() => copyToClipboard(msg.message)}
							style={{
								backgroundColor: msg.sender === "user" ? '#a5e89f' : '#D1E8C3',
								padding: 9,
								marginTop: 4,
								marginBottom: 5,
								borderRadius: 10,
								maxWidth: 270,
								fontSize: 17,
								borderRadius:
									msg.sender === "user" ? 40 : 10,
								borderRadius:
									msg.sender !== "user" ? 40 : 10,
							}}
						>
							{msg.message}
						</Text>
						{msg.sender === "user" && (
							<Image
								style={{
									width: 25,
									height: 25,
									marginLeft: 7,
									marginRight: 7,
									marginBottom: 6,
									borderRadius: 50,
									borderWidth: 1,
									borderColor: "#a5e89f",
								}}
								source={require("../assets/user.jpeg")}
							/>
						)}
					</View>
				))}
			</ScrollView>
			<View
				style={{
					padding: 10,
					flexDirection: "row",
					alignItems: "center",
					paddingTop: 7,
				}}
			>
				<TextInput
					style={{
						flex: 1,
						borderRadius: 10,
						fontSize: 17,
						paddingHorizontal: 16,
						borderWidth: 1,
						borderColor: "#a5e89f",
						backgroundColor: "#a5e89f47",
						marginRight: 10,
						height: 70,
					}}
					value={message}
					onChangeText={text => setMessage(text)}
					placeholder='输入您的问题'
				/>
				<View
					style={{
						backgroundColor: "#a5e89f",
						height: "100%",
						display: "flex",
						borderRadius: 10,
						alignItems: "center",
						position: "relative",
						// justifyContent: 'center',
					}}
				>
					<TouchableOpacity onPress={send}>
						<Text
							style={{
								transform: "translate(0px, 19px)",
								fontSize: 17,
								padding: 4,
								paddingHorizontal: 17,
							}}
						>
							<Icon
								name='send'
								style={{
									fontSize: 25,
								}}
							/>
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default ChatPage;
