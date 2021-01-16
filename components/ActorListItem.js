import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Colors from "../definitions/Colors";
import Assets from "../definitions/Assets";
import { imageUrl } from "../api/themoviedb";

const ActorListItem = ({ onClick, isFav = false, actorData }) => {
  const getThumbnail = () => {
    if (actorData.profile_path) {
      return (
        <Image
          style={styles.thumbnail}
          source={{ uri: imageUrl + actorData.profile_path }}
        />
      );
    }
    return (
      <View style={styles.noThumbnailContainer}>
        <Image style={styles.errorImg} source={Assets.icons.errorImg} />
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        onClick(actorData.id);
      }}
    >
      {getThumbnail()}

      <View style={styles.informationContainer}>
        <Text style={styles.title}>{actorData.name}</Text>
        <Text style={styles.data}>{actorData.known_for_department}</Text>
        <Text style={styles.data}>Popularity : {actorData.popularity}</Text>
        <FlatList
          data={actorData.known_for}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Text>{item.original_title}</Text>}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ActorListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  informationContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  statContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  thumbnail: {
    width: 128,
    height: 128,
    borderRadius: 12,
    backgroundColor: Colors.mainGreen,
  },
  errorImg: {
    width: 128,
    height: 128,
    borderRadius: 12,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  data: {
    fontSize: 16,
  },
  cuisine: {
    fontStyle: "italic",
  },
  icon: {
    tintColor: Colors.mainGreen,
  },
  stat: {
    marginLeft: 4,
  },
});
