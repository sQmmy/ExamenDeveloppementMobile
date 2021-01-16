import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Button,
  Image,
  FlatList,
} from "react-native";
import Colors from "../definitions/Colors.js";
import DisplayError from "./DisplayError";
import { ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { getActorByActorId, getCombinedCredits } from "../api/themoviedb.js";
import { imageUrl } from "../api/themoviedb";
import Assets from "../definitions/Assets";

const Actor = ({ route, favActors, dispatch }) => {
  useEffect(() => {
    setIsLoading(true);
    requestActor();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    requestCombinedCredits();
  }, [actor]);

  const [actor, setActor] = useState(null);
  const [credits, setCredits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const saveActor = async () => {
    const action = {
      type: "SAVE_ACTOR",
      value: route.params.actorID,
    };
    dispatch(action);
  };

  const unsaveActor = async () => {
    const action = { type: "POP_ACTOR", value: route.params.actorID };
    dispatch(action);
  };

  const getThumbnail = () => {
    if (actor != null && actor.profile_path != null) {
      return (
        <Image
          style={styles.thumbnail}
          source={{ uri: imageUrl + actor.profile_path }}
        />
      );
    }
    return (
      <View style={styles.noThumbnailContainer}>
        <Image style={styles.errorImg} source={Assets.icons.errorImg} />
      </View>
    );
  };

  const displaySaveActor = () => {
    if (favActors.findIndex((i) => i === route.params.actorID) !== -1) {
      return (
        <Button
          title="Retirer des favoris"
          color={Colors.mainGreen}
          onPress={unsaveActor}
        />
      );
    }
    return (
      <Button
        title="Ajouter aux favoris"
        color={Colors.mainGreen}
        onPress={saveActor}
      />
    );
  };

  const requestActor = async () => {
    try {
      setIsLoading(true);
      const apiResult = await getActorByActorId(route.params.actorID);
      setActor(apiResult);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
    }
  };

  const requestCombinedCredits = async () => {
    try {
      setIsLoading(true);
      const apiResult = await getCombinedCredits(route.params.actorID);
      setCredits(apiResult.cast);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
    }
  };

  return (
    <View style={styles.container}>
      {isError ? (
        <DisplayError message="Impossible de récupérer la data" />
      ) : isLoading ? (
        <View style={styles.containerLoading}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.innerContainer}>
            {getThumbnail()}
            <View style={styles.identityContainerTop}>
              <View style={styles.identityActor}>
                <Text style={styles.name}>{actor.name}</Text>
              </View>
              <View style={styles.reviewActor}>
                <View
                  style={[
                    styles.containerNote,
                    {
                      backgroundColor: "#green",
                    },
                  ]}
                >
                  <Text style={styles.textNote}>{actor.popularity}</Text>
                  <Text style={styles.textMaxNote}>/50</Text>
                </View>
              </View>
            </View>
            <View style={styles.identityContainerBottom}>
              <Text style={styles.title}>Date de naissance</Text>
              <Text style={styles.content}>{actor.birthday}</Text>
              <Text style={styles.title}>Lieu de naissance</Text>
              <Text style={styles.content}>{actor.place_of_birth}</Text>
              <Text style={styles.title}>Biographie</Text>
              <Text style={styles.content}>{actor.biography}</Text>

              <Text style={styles.title}>Médias associés</Text>

              {isError ? (
                <DisplayError message="Impossible de récupérer les médias associés" />
              ) : (
                <FlatList
                  data={credits.sort((a, b) => {
                    var dateA = new Date(a.release_date),
                      dateB = new Date(b.release_date);
                    return dateB - dateA;
                  })}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View style={styles.creditContent}>
                      <Text style={styles.date}>{item.release_date}</Text>
                      <Text style={styles.movieTitle}>
                        {item.original_title}
                      </Text>
                    </View>
                  )}
                />
              )}

              {displaySaveActor()}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    favActors: state.favoriteActorsIds,
  };
};

export default connect(mapStateToProps)(Actor);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  creditContent: {
    flex: 1,
    flexDirection: "row",
  },
  innerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  containerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  movieTitle: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  thumbnail: {
    height: 350,
    backgroundColor: Colors.mainGreen,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  errorImg: {
    height: 128,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: "white",
  },
  identityContainerTop: {
    marginTop: 5,
    padding: 12,
    borderRadius: 5,
    backgroundColor: "white",
    flexDirection: "row",
  },
  identityContainerBottom: {
    marginTop: 16,
    elevation: 1,
    borderRadius: 3,
    padding: 12,
    backgroundColor: "white",
  },
  identityActor: {
    flex: 4,
  },
  name: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  content: {
    fontSize: 16,
  },
  reviewActor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerNote: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  textNote: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  textMaxNote: {
    fontSize: 12,
    marginLeft: 3,
    color: "white",
  },
  title: {
    marginTop: 16,
    color: Colors.mainGreen,
    fontWeight: "bold",
  },
});
