/*
 * @Author: zhangdi 1258956799@qq.com
 * @Date: 2023-06-19 20:19:38
 * @LastEditors: zhangdi 1258956799@qq.com
 * @LastEditTime: 2023-06-20 16:20:11
 * @FilePath: /Chat-Bot/babel.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'module:metro-react-native-babel-preset'],
    plugins: [
      'module:react-native-dotenv',
    ],
  };
};
