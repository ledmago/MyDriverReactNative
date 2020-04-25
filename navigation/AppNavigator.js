import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import MainTabNavigator from './MainTabNavigator';
import MainDriverTabNavigator from './MainDriverTabnavigator';
import { fromRight } from 'react-navigation-transitions';
import SplashPage from '../screens/SplashPage';
import LoginScreen from '../screens/login/LoginScreen';
import AppInitialController from '../Controller/AppInitial';
import RegisterSplash from '../screens/login/RegisterSplashScreen';
import RegisterCustomer from '../screens/login/RegisterCustomerScreen';
import userCreditCardScreen from '../screens/CustomerSide/UserCreditCardScreen';
import BalanceScreen from '../screens/CustomerSide/BalanceScreen';
import EslestirmeScreen from '../screens/CustomerSide/EslestirmeScreen';
import RegisterDriver from '../screens/login/RegisterDriverScreen';
import ChatScreen from '../screens/Chat';
import HaritaforTripDriver from '../screens/DriverSide/HaritaforTripDriver';
import HaritaforTripUser from '../screens/CustomerSide/HaritaforTripUser';
import ConnectionErrorScreen from '../screens/ConnectionErrorScreen';
import UploadProfilePhotoScreen from '../screens/UploadProfilePictureScreen';
const AuthScreen = createStackNavigator({ Login: LoginScreen, RegisterSplash: RegisterSplash, RegisterCustomer: RegisterCustomer, RegisterDriver: RegisterDriver });
export default createAppContainer(
  createSwitchNavigator({
    AppInitial: AppInitialController,
    Splash: SplashPage,
    ConnectionError:ConnectionErrorScreen,
    Auth: AuthScreen,
    App: createStackNavigator({
      // You could add another route here for authentication.
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html

      Main: MainTabNavigator,
      userCreditCard: createStackNavigator({ userCreditCard: userCreditCardScreen }),
      BalanceScreen: createStackNavigator({ BalanceScreen: BalanceScreen }),
      EslestirmeScreen: createStackNavigator({ EslestirmeScreen: EslestirmeScreen }),
      ChatScreen: createStackNavigator({ ChatScreen: ChatScreen }),
      HaritaforTripUser: createStackNavigator({ HaritaforTripUser: HaritaforTripUser }),
      UploadProfilePhoto:createStackNavigator({UploadProfilePhoto:UploadProfilePhotoScreen}),
    },
      {
        transitionConfig: () => fromRight(),
        headerMode: 'none'
      }),




      // Driver Kısmı İçin Notification

    AppDriver: createStackNavigator({
      // You could add another route here for authentication.
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html

      Main: MainDriverTabNavigator,
      userCreditCard: createStackNavigator({ userCreditCard: userCreditCardScreen }, { transitionConfig: () => fromRight(), }),
      BalanceScreen: createStackNavigator({ BalanceScreen: BalanceScreen }, { transitionConfig: () => fromRight(), }),
      EslestirmeScreen: createStackNavigator({ EslestirmeScreen: EslestirmeScreen }, { transitionConfig: () => fromRight(), }),
      ChatScreen: createStackNavigator({ ChatScreen: ChatScreen }, { transitionConfig: () => fromRight(), }),
      HaritaforTripDriver: createStackNavigator({ HaritaforTripDriver: HaritaforTripDriver }, { transitionConfig: () => fromRight(), }),
      UploadProfilePhoto:createStackNavigator({UploadProfilePhoto:UploadProfilePhotoScreen}),

    }, {
      transitionConfig: () => fromRight(),
      headerMode: 'none'
    })
  })
);
