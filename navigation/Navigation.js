import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Search from "../components/Search";
import Assets from "../definitions/Assets";
import Colors from "../definitions/Colors";
import { Image } from "react-native";
import Actor from "../components/Actor";
import FavActors from "../components/FavActors";

const SearchNavigation = createStackNavigator();
const FavNavigation = createStackNavigator();
const TabNavigation = createBottomTabNavigator();

function searchStackScreens() {
  return (
    <SearchNavigation.Navigator initialRouteName="ViewSearch">
      <SearchNavigation.Screen
        name="ViewSearch"
        component={Search}
        options={{ title: "Recherche" }}
      />
      <SearchNavigation.Screen
        name="ViewActor"
        component={Actor}
        options={{ title: "Actor" }}
      />
    </SearchNavigation.Navigator>
  );
}

function favStackScreens() {
  return (
    <FavNavigation.Navigator initialRouteName="ViewFav">
      <FavNavigation.Screen
        name="ViewFav"
        component={FavActors}
        options={{ title: "Favoris" }}
      />
      <FavNavigation.Screen
        name="ViewActor"
        component={Actor}
        options={{ title: "Actor" }}
      />
    </FavNavigation.Navigator>
  );
}

function Navigation() {
  return (
    <TabNavigation.Navigator
      tabBarOptions={{
        activeTintColor: Colors.mainGreen,
      }}
    >
      <TabNavigation.Screen
        name="Recherche"
        component={searchStackScreens}
        options={() => ({
          tabBarIcon: ({ color }) => {
            return (
              <Image
                source={Assets.icons.search}
                style={{ tintColor: color }}
              />
            );
          },
        })}
      />
      <TabNavigation.Screen
        name="Favoris"
        component={favStackScreens}
        options={() => ({
          tabBarIcon: ({ color }) => {
            return (
              <Image source={Assets.icons.fav} style={{ tintColor: color }} />
            );
          },
        })}
      />
    </TabNavigation.Navigator>
  );
}

export default Navigation;
