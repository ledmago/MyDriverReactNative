import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/DriverSide/HomeScreen';
import HaritaScreenforCustomer from '../screens/DriverSide/Harita';
import SettingsScreen from '../screens/SettingsScreen';
import GelenKutusuScreen from '../screens/GelenKutusu';
import StartTripScreen from '../screens/CustomerSide/StartTripScreen';
import TripforHaritaScreen from '../screens/DriverSide/HaritaforTripDriver';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import { fromRight } from 'react-navigation-transitions';

export default createMaterialTopTabNavigator({
  Home: { screen: HomeScreen, navigationOptions: { tabBarLabel: 'Anasayfa', tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name={'ios-home'} />), } },
  GelenKutusu: { screen: GelenKutusuScreen, navigationOptions: { tabBarLabel: 'Gelen Kutusu', tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name={'ios-mail'} />), } },
  TripforHarita: { screen: TripforHaritaScreen, navigationOptions: { tabBarLabel: 'Harita', tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name={'ios-map'} />), } },

  Settings: { screen: SettingsScreen, navigationOptions: { tabBarLabel: 'Ayarlar', tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name={'ios-settings'} />), } },

}, {

  tabBarPosition: 'bottom',
  tabBarOptions: {

    showLabel: false,
    activeColor: '#f0edf6',
    inactiveColor: '#CCC',
    style: { backgroundColor: '#2b3138', paddingVertical: 5 },

    indicatorStyle: { height: 0 },
    showIcon: true,


  },
 
  /*
      transitionConfig: () => fromRight(),
      shifting:true,
      sceneAnimationEnabled:true,
      initialRouteName: 'Home',
      activeColor: '#f0edf6',
      inactiveColor: '#CCC',
      barStyle: { backgroundColor: '#2b3138' },
  
      */

});
