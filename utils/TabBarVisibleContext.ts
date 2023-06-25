import React from 'react';

// 创建一个Context
export const TabBarVisibleContext = React.createContext({
  tabBarVisible: true,
  setTabBarVisible: () => { },
});

export default TabBarVisibleContext;
