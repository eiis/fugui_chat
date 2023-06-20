/*
 * @Author: zhangdi 1258956799@qq.com
 * @Date: 2023-06-20 14:46:26
 * @LastEditors: zhangdi 1258956799@qq.com
 * @LastEditTime: 2023-06-20 16:09:49
 * @FilePath: /Chat-Bot/screens/Setting.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { StatusBar } from "expo-status-bar";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/curve.png")}
        style={{
          position: "absolute",
          top: 0,
          height: 100,
          width: "100%",
          backgroundColor: "#a5e89f",
        }}
      />
      {/* <Image source={require("../assets/bot.jpg")} style={styles.image} /> */}
      <Text style={styles.text}>Hey there! This is Elsa</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile", { name: "Jane" })}
      >
        <Text style={styles.button}>Ask Me Anything</Text>
      </TouchableOpacity>
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
    alignItems: "center",
    justifyContent: "center",
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
