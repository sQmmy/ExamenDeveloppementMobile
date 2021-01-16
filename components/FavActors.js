import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { connect } from "react-redux";
import { getActorByActorId } from "../api/themoviedb";
import ActorListItem from "./ActorListItem";
import DisplayError from "./DisplayError";

const FavActors = ({ navigation, favActors }) => {
  const [actors, setActors] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    refreshFavActors();
  }, []);

  useEffect(() => {
    refreshFavActors();
  }, [favActors]);

  const refreshFavActors = async () => {
    setIsRefreshing(true);
    setIsError(false);
    let actors = [];
    try {
      for (const id of favActors) {
        const apiResult = await getActorByActorId(id);
        actors.push(apiResult);
      }
      setActors(actors);
    } catch (error) {
      setIsError(true);
      setActors([]);
    }
    setIsRefreshing(false);
  };

  const isFavoriteActor = (actorId) => {
    if (favActors.findIndex((i) => i === actorId) !== -1) {
      return true;
    }
    return false;
  };

  const navigateToActorDetails = (actorID) => {
    navigation.navigate("ViewActor", { actorID });
  };

  return (
    <View style={styles.container}>
      {isError ? (
        <DisplayError message="Impossible de récupérer les acteurs/trices" />
      ) : (
        <FlatList
          data={actors}
          extraData={favActors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ActorListItem
              actorData={item}
              onClick={navigateToActorDetails}
              isFav={isFavoriteActor(item.id)}
            />
          )}
          refreshing={isRefreshing}
          onRefresh={refreshFavActors}
        />
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    favActors: state.favoriteActorsIds,
  };
};

export default connect(mapStateToProps)(FavActors);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 16,
  },
});
