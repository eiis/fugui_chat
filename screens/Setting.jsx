import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, View, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({ navigation }) {

  const [apiKey, setApiKey] = useState(AsyncStorage.getItem('@api_Key'));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const getApiKey = async () => {
      try {
        const value = await AsyncStorage.getItem('@api_Key');
        if (value !== null) {
          setApiKey(value);
        }
      } catch (e) {
        console.error(e);
      }
    }
    getApiKey();
  }, []);

  const onChangeText = async (text) => {
    try {
      await AsyncStorage.setItem('@api_Key', text)
    } catch (e) {
      // 保存错误处理
      console.error(e);
    }
    setApiKey(text)
  }

  const onFocusChange = () => {
    setIsFocused(true);
  };

  const onBlurChange = () => {
    setIsFocused(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.apiInput}>
        <Text>API Key设置</Text>
        <TextInput
          style={{ height: 40, borderColor: isFocused ? '#a5e89f' : 'gray', borderWidth: 1, marginVertical: 10, padding: 10, borderRadius: 20 }}
          onChangeText={text => onChangeText(text)}
          value={apiKey}
          placeholder='请输入API Key'
          autoFocus={false}
          onFocus={onFocusChange}
          onBlur={onBlurChange}
        />
      </View>
      <View style={styles.theme}>
        <Text>主题设置</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
    display: 'flex',
    alignItems: 'center',
  },

  apiInput: {
    width: '90%',
    marginVertical: 30,
  },
  theme: {

  }
});
