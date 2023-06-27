import React, { useState, useContext, useRef, useEffect, } from "react";
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import uuid from 'react-native-uuid';
import { TabBarVisibleContext } from '../utils/TabBarVisibleContext';

import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Image,
	ScrollView,
	SafeAreaView,
	ActivityIndicator
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";


const ChatPage = ({ route }) => {
	const { id = '' } = route.params;
	const [chatId, setChatId] = useState('');
	//如果第一次进来生成一个chatId
	useEffect(() => {
		if (!id) {
			setChatId(uuid.v4());  // 生成唯一的聊天ID
		}
	}, [id]); // 当id改变时触发
	useEffect(() => {
		const getApiKey = async () => {
			try {
				if (id) {
					const chat_List = JSON.parse(await AsyncStorage.getItem('@chat_List'));
					if (chat_List !== null) {
						const found = chat_List.find(item => item.id === id);
						console.log('found', found)
						const hisMessagesToSend = found.messages.map(({ isLoading, ...rest }) => rest);
						console.log('hisMessagesToSend', hisMessagesToSend)
						setMessages(found.messages)
						setMessagesToSend(hisMessagesToSend)
					}
				}
			} catch (e) {
				console.error(e);
			}
		}
		getApiKey();
	}, []);

	const { setTabBarVisible } = useContext(TabBarVisibleContext);

	const scrollViewRef = useRef();
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([
	]);
	const [isModalVisible, setModalVisible] = useState(false);
	const [modelMsg, setModelMsg] = useState('');
	const [loading, setLoading] = useState(false);

	const [messagesToSend, setMessagesToSend] = useState([])

	useEffect(() => {
		// 在页面加载时隐藏Tab Bar
		setTabBarVisible(false);

		// 在页面卸载时显示Tab Bar
		return () => setTabBarVisible(true);
	}, []);

	const send = async () => {
		const apiKey = await AsyncStorage.getItem('@api_Key')
		// console.log('apiKey', apiKey)
		if (!apiKey) {
			console.log('apiKey', apiKey)
			setModelMsg('请输入API_Key')
			setModalVisible(!isModalVisible);
			// 设定3秒后关闭模态窗口
			setTimeout(() => {
				setModalVisible(false);
			}, 3000);
			return
		}
		if (message) {
			await setMessages([
				...messages,
				{
					content: message, role: "user", isLoading: false,
					content: 'loading', role: "ai", isLoading: true
				}
			]);
			setMessage("");
			await sendMessage(apiKey, message);
		}
	};

	// const copyToClipboard = async (text) => {
	// 	await Clipboard.setStringAsync(text);
	// 	alert('已复制');
	// };

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

	const sendMessage = async (apiKey, message) => {
		try {
			setLoading(true);
			setMessages([
				...messages,
				{ content: message, role: "user", loading: false },
				{ content: '...', role: "assistant", loading: true },
			]);
			const options = {
				method: "POST",
				url: 'https://chat.fugui.info/v1/chat/completions',
				headers: {
					'content-type': 'application/json',
					"Authorization": `Bearer ${apiKey}` // 使用变量apiKey替代硬编码的API Key
				},
				data: {
					model: 'gpt-3.5-turbo',
					messages: [
						...messagesToSend,
						{ role: "user", content: message }
					]
				}
			};

			const response = await axios.request(options);
			const newMessages = [
				...messages,
				{ content: message, role: "user" },
				{ content: response.data.choices[0].message.content, role: "assistant", isLoading: false },
			];


			const newMessagesToSend = [
				...messagesToSend,
				{ content: message, role: "user" },
				{ content: response.data.choices[0].message.content, role: "assistant", },
			]
			console.log('newMessagesToSend', newMessagesToSend)

			setMessagesToSend(newMessagesToSend)

			// console.log('newMessages', newMessages)

			setMessages(newMessages);

			let chatList = await AsyncStorage.getItem('@chat_List');
			chatList = chatList ? JSON.parse(chatList) : [];

			if (chatId) {
				// console.log('第一次进来第一段聊天记录')
				const chatRecord = {
					id: chatId,  // 添加唯一的聊天ID
					messages: newMessages,
				};
				const chat_List = JSON.parse(await AsyncStorage.getItem('@chat_List'));
				const found = chat_List && chat_List.find(item => item.id === chatId);
				if (found) {
					found.messages.push(
						{ content: message, role: "user" },
						{ content: response.data.choices[0].message.content, role: "assistant", isLoading: false }
					)

					await AsyncStorage.setItem('@chat_List', JSON.stringify(chat_List)); // 将更新后的chat_List保存到AsyncStorage中
				} else {
					chatList.push(chatRecord);
					// console.log('chatList', chatList)

					await AsyncStorage.setItem('@chat_List', JSON.stringify(chatList))
				}
			} else {
				const chat_List = JSON.parse(await AsyncStorage.getItem('@chat_List'));
				const found = chat_List.find(item => item.id === id);
				found.messages.push(
					{ content: message, role: "user" },
					{ content: response.data.choices[0].message.content, role: "assistant", isLoading: false }
				)

				await AsyncStorage.setItem('@chat_List', JSON.stringify(chat_List)); // 将更新后的chat_List保存到AsyncStorage中
			}
			setLoading(false);
		} catch (error) {
			if (error.request) {
				// The request was made but no response was received
				console.error('error', JSON.parse(error.request.response).error.code);
				setModelMsg(JSON.parse(error.request.response).error.code)
			} else if (error.message) {
				// Something happened in setting up the request that triggered an Error
				console.error('error', error.message);
				setModelMsg(error.message);
			} else {
				setModelMsg("Unknown error");
			}

			setModalVisible(!isModalVisible);
			// 设定3秒后关闭模态窗口
			setTimeout(() => {
				setModalVisible(false);
			}, 3000);
			setLoading(false);
		}
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: "#fff",
				// height: "100%",
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
					paddingHorizontal: 10,
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
								msg.role === "user" ? "flex-end" : "flex-start",
							flexDirection: "row",
							flexWrap: "wrap",
							alignItems: "flex-end",
						}}
					>
						{msg.role !== "user" && (
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
								source={require("../assets/ai.png")}
							/>
						)}
						{msg.loading ? (
							<ActivityIndicator size="small" color="#519259" />
						) : (
							<Text
								selectable
								// onPress={() => copyToClipboard(msg.message)}
								style={{
									backgroundColor: msg.role === "user" ? '#a5e89f' : '#FFE9A0',
									padding: 9,
									marginTop: 4,
									marginBottom: 5,
									borderRadius: 10,
									maxWidth: 270,
									fontSize: 17,
									borderRadius: msg.role === "user" ? 20 : 10,
									borderRadius: msg.role !== "user" ? 20 : 10,
								}}
							>
								{msg.content}
							</Text>
						)}
						{msg.role === "user" && (
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
					paddingHorizontal: 10,
					margin: 10,
					flexDirection: "row",
				}}
			>
				<TextInput
					style={{
						width: '85%',
						borderRadius: 10,
						fontSize: 17,
						paddingHorizontal: 16,
						borderWidth: 1,
						borderColor: "#a5e89f",
						backgroundColor: "#a5e89f47",
						marginRight: 10,
						height: 50,
					}}
					value={message}
					onChangeText={text => setMessage(text)}
					placeholder='输入您的问题'
				/>
				<TouchableOpacity
					style={{
						width: '15%',
						backgroundColor: "#a5e89f",
						height: 50,
						display: "flex",
						borderRadius: 10,
						alignItems: "center",
						justifyContent: 'center'
					}}
					disabled={loading}
					onPress={send}
				>
					<Icon
						name='send'
						style={{
							fontSize: 25,
						}}
					/>
				</TouchableOpacity>
			</View >
			<Modal isVisible={isModalVisible}>
				<View style={{
					justifyContent: 'flex-start',
					alignItems: 'center',
					backgroundColor: 'white',
					padding: 20,
					borderRadius: 20,
					width: 200,    // 调整宽度
					height: 60,   // 调整高度
					alignSelf: 'center', // 把模态窗口放到屏幕中央
				}}>
					<Text style={{ color: '#a5e89f' }}>{modelMsg}</Text>
				</View>
			</Modal>
		</SafeAreaView >
	);
};

export default ChatPage;
