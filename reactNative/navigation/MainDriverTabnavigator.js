import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/DriverSide/HomeScreen';
import HaritaScreenforCustomer from '../screens/DriverSide/Harita';
import SettingsScreen from '../screens/SettingsScreen';
import StartTripScreen from '../screens/CustomerSide/StartTripScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Giriş',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'ios-home'}
    />
  ),
};

HomeStack.path = '';

const LinksStack = createStackNavigator(
  {
    Links: HaritaScreenforCustomer,
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: 'Harita',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'ios-map'} />
  ),
};

LinksStack.path = '';

const StartTripStack = createStackNavigator(
  {
    StartTrip: StartTripScreen,
  },
  config
);


StartTripStack.navigationOptions = {
  tabBarLabel: 'Yolculuk İstekleri',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'md-navigate'} />
  ),
};

StartTripStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Ayarlar',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={'ios-settings'} />
  ),
}; 

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  StartTripStack,
  LinksStack,
  SettingsStack,
},{
  tabBarOptions: {
    style: {
     backgroundColor: '#2b3138',

    }
  }
});

tabNavigator.path = '';

export default tabNavigator;
