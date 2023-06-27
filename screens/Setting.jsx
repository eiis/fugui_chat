import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';

export default function Home({ navigation }) {
  const [isFocused, setIsFocused] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const getApiKey = async () => {
      const apiKeyFromStorage = await AsyncStorage.getItem('@api_Key');
      setApiKey(apiKeyFromStorage || "");
    };

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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.apiInput}>
          <Text>API Key设置</Text>
          <TextInput
            style={{ height: 40, borderColor: isFocused ? '#EEE3CB' : 'gray', borderWidth: 1, marginVertical: 10, padding: 10, borderRadius: 20 }}
            onChangeText={text => onChangeText(text)}
            value={apiKey}
            placeholder='请输入API Key'
            autoFocus={false}
            onFocus={onFocusChange}
            onBlur={onBlurChange}
          />
        </View>
        {/* <TouchableOpacity style={styles.theme} onPress={toggleModal}>
          <Text>主题设置</Text>
        </TouchableOpacity> */}
      </View>
      <View>
        <Text
          style={{
            textAlign: 'center',
            marginBottom: 10
          }}
        >
          Version 1.0.0
        </Text>
      </View>

      <Modal isVisible={isModalVisible} style={styles.bottomModal} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <Text>Hello!</Text>

          {/* <Button title="Hide modal" onPress={toggleModal} /> */}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  apiInput: {
    width: '90%',
    marginVertical: 30,
  },
  theme: {
    width: '90%',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
});
