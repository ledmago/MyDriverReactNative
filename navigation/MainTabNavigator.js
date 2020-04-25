import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import HaritaScreenforCustomer from '../screens/CustomerSide/Harita';
import SettingsScreen from '../screens/SettingsScreen';
import StartTripScreen from '../screens/CustomerSide/StartTripScreen';
import GelenKutusu_CustomerScreen from '../screens/GelenKutusu';
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

export default createMaterialTopTabNavigator({
  HomeStack: { screen: HomeScreen, navigationOptions: { tabBarLabel: 'Anasayfa', tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name={'ios-home'} />), } },
  
  GelenKutusu: { screen: GelenKutusu_CustomerScreen, navigationOptions: { tabBarLabel: 'Mesajlar', tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name={'ios-mail'} />), } },

  // StartTripStack: { screen: StartTripScreen, navigationOptions: { tabBarLabel: 'Yolculuk', tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name={'md-navigate'} />), } },
 
  LinksStack: { screen: HaritaScreenforCustomer, navigationOptions: { tabBarLabel: 'Harita', tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name={'ios-map'} />), } },
  
  SettingsStack: { screen: SettingsScreen, navigationOptions: { tabBarLabel: 'Ayarlar', tabBarIcon: ({ focused }) => (<TabBarIcon focused={focused} name={'ios-settings'} />), } },

}, {

  tabBarPosition: 'bottom',
  tabBarOptions: {

    showLabel: true,
    labelStyle:{fontSize:8},
    activeColor: '#f0edf6',
    inactiveColor: '#CCC',
    style: { backgroundColor: '#2b3138', paddingVertical: -2,borderTopColor:'#000',borderTopWidth:0.1 },

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
