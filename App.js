import React, { Component, useEffect } from "react";
import { fcmService } from "./src/services/FCMService";
import { localNotificationService } from "./src/services/LocalNotificationService";
import { createAppContainer, NavigationActions } from "react-navigation";
import {
  createStackNavigator,
  TransitionPresets,
} from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import Home from "./src/main/home";
import FirePoint from "./src/main/ListFirePoint";
import FireLevel from "./src/main/ListFireLevel";
import CommuneListFireLevel from "./src/main/CommuneListFireLevel";
import DetailInfoCommune from "./src/main/detailInfoCommune";
import Map from "./src/main/map";
import DetailFirePoint from "./src/main/DetailFirePoint";
import ComfirmFirePoint from "./src/main/comfirmFirePoint";
import Custom from "./src/layout/drawer";
import { Dimensions } from "react-native";
import CallRangers from "./src/main/callRangers";
import ContactSMS from "./src/main/contactSMS";
import ContactEmail from "./src/main/contactEmail";
import selectWMSLayer from "./src/main/SelectWMSLayer";
import appInfo from "./src/main/appInfo";
import Navigation from "./src/main/Navigation";
import messaging from "@react-native-firebase/messaging";

const navOptionHandler = (navigation) => ({
  headerShown: false,
});

const HomeStack = createStackNavigator(
  {
    home: {
      screen: Home,
      navigationOptions: navOptionHandler,
    },
    firepoint: {
      screen: FirePoint,
      navigationOptions: navOptionHandler,
    },
    firelevel: {
      screen: FireLevel,
      navigationOptions: navOptionHandler,
    },
    communeListFireLevel: {
      screen: CommuneListFireLevel,
      navigationOptions: navOptionHandler,
    },
    detailInfoCommune: {
      screen: DetailInfoCommune,
      navigationOptions: navOptionHandler,
    },
    map: {
      screen: Map,
      navigationOptions: navOptionHandler,
    },
    detailFirePoint: {
      screen: DetailFirePoint,
      navigationOptions: navOptionHandler,
    },
    comfirmFirePoint: {
      screen: ComfirmFirePoint,
      navigationOptions: navOptionHandler,
    },
    callRangers: {
      screen: CallRangers,
      navigationOptions: navOptionHandler,
    },
    contactSMS: {
      screen: ContactSMS,
      navigationOptions: navOptionHandler,
    },
    contactEmail: {
      screen: ContactEmail,
      navigationOptions: navOptionHandler,
    },
    SelectWMSLayer: {
      screen: selectWMSLayer,
      navigationOptions: navOptionHandler,
    },
    appInfo: {
      screen: appInfo,
      navigationOptions: navOptionHandler,
    },
  },
  {
    initialRouteName: "home",
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
    },
  }
);

const appDrawer = createDrawerNavigator(
  {
    drawer: HomeStack,
  },
  {
    contentComponent: Custom,
    drawerWidth: (Dimensions.get("window").width * 3) / 4,
  }
);

const CreateApp = createAppContainer(appDrawer);

function App() {
  useEffect(() => {
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    messaging().subscribeToTopic("hanamffw");
  }, []);

  const onRegister = (token) => {
    console.log("[App] onRegister: ", token);
  };
  const onNotification = (notify) => {
    const options = {
      soundName: "default",
      playSound: true,
    };
    localNotificationService.showNotification(
      0,
      notify.notification.title,
      notify.notification.body,
      notify,
      options
    );
  };

  const onOpenNotification = async (notify) => {
    if (notify) {
      // const JsonData = JSON.parse(notify.data)
      console.log("notif ", notify);
      const dataPoint = {
        properties: JSON.parse(notify.properties),
        geometry: JSON.parse(notify.geometry),
        _id: notify._id,
      };
      Navigation.navigate("map", {
        listFirePoint: [dataPoint],
        reselactFirePoint: true,
        lat: dataPoint.geometry.coordinates[0],
        long: dataPoint.geometry.coordinates[1],
      });
    }
  };

  return (
    <CreateApp
      ref={(r) => {
        Navigation.setTopLevelNavigator(r);
      }}
    />
  );
}

export default App;
