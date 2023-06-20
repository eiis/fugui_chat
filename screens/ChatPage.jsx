import React, { useState, useRef } from "react";

import { SyntaxHighlighter } from 'react-native-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/cjs/styles/prism';


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
	const scrollViewRef = useRef();
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([
		{
			message: "Hi! How can I help you ?",
			sender: "ai",
		},
	]);
	const send = async () => {
		if (message) {
			await setMessages([...messages, { message: message, sender: "user" }]);
			setMessage("");
			await sendMessage();
		}
	};

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
					animationName: "moveUpDown",
					animationIterationCount: "infinite",
					animationDirection: "alternate",
					animationDuration: "2s",
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
					marginTop: 60,
				}}
				ref={scrollViewRef}
				onContentSizeChange={() =>
					scrollViewRef.current.scrollToEnd({ animated: true })
				}
			>
				{messages.map((msg, index) => (
					<>
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
								style={{
									backgroundColor: "#a5e89f",
									padding: 9,
									marginTop: 4,
									marginBottom: 5,
									borderRadius: 10,
									maxWidth: 270,
									fontSize: 17,
									borderBottomRightRadius:
										msg.sender === "user" ? 0 : 10,
									borderBottomLeftRadius:
										msg.sender !== "user" ? 0 : 10,
								}}
							>
								{msg.message}
							</Text>
							{msg.sender === "user" && (
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
									source={require("../assets/user.jpeg")}
								/>
							)}
						</View>
					</>
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
