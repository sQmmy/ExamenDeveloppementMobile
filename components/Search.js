import React, { useEffect, useState } from "react";
import {
  Button,
  TextInput,
  View,
  StyleSheet,
  FlatList,
  Keyboard,
  Text,
} from "react-native";
import Colors from "../definitions/Colors";
import DisplayError from "./DisplayError";
import { connect } from "react-redux";
import { getPopularActors, getActorsFromFilter } from "../api/themoviedb";
import ActorListItem from "../components/ActorListItem";

const Search = ({ navigation, favActors }) => {
  const [actors, setActors] = useState([]);
  const [entete, setEntete] = useState("Trending");
  const [filter, setFilter] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [isMoreResults, setIsMoreResults] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (filter.length < 1) {
      setEntete("Trending");
    } else {
      setEntete('Résultats de recherche pour : " ' + filter + '"');
    }
  }, [filter]);

  useEffect(() => {
    requestPopular([], 1);
  }, []);

  useEffect(() => {
    if (filter.length < 1) {
      searchPopular();
    }
  }, [filter]);

  const isFavoriteActor = (actorId) => {
    if (favActors.findIndex((i) => i === actorId) !== -1) {
      return true;
    }
    return false;
  };

  const requestActors = async (prevActors, pageNumber) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const apiResult = await getActorsFromFilter(filter, pageNumber);
      setActors([...prevActors, ...apiResult.results]);
      if (apiResult.total_pages > pageNumber) {
        setIsMoreResults(true);
        setPageNumber(apiResult.page);
      } else {
        setIsMoreResults(false);
      }
    } catch (error) {
      setIsError(true);
      setActors([]);
      setIsMoreResults(true);
      setPageNumber(0);
    }
    setIsLoading(false);
  };

  const requestPopular = async (prevActors, pageNumber) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const apiResult = await getPopularActors(pageNumber);
      setActors([...prevActors, ...apiResult.results]);
      if (apiResult.total_pages > pageNumber) {
        setIsMoreResults(true);
        setPageNumber(apiResult.page);
      } else {
        setIsMoreResults(false);
      }
    } catch (error) {
      setIsError(true);
      setActors([]);
    }
    setIsLoading(false);
  };

  const searchActors = () => {
    Keyboard.dismiss();
    requestActors([], 1);
  };

  const searchPopular = () => {
    Keyboard.dismiss();
    requestPopular([], 1);
  };

  const loadMoreActors = async () => {
    if (isMoreResults) {
      if (filter.length < 1) {
        requestPopular(actors, pageNumber + 1);
      } else {
        requestActors(actors, pageNumber + 1);
      }
    }
  };

  const navigateToActorDetails = (actorID) => {
    navigation.navigate("ViewActor", { actorID });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Nom du people"
          style={styles.inputActorName}
          onChangeText={(text) => setFilter(text)}
          onSubmitEditing={filter.length < 1 ? searchPopular : searchActors}
        />
        <Button
          title="Rechercher"
          color={Colors.mainGreen}
          onPress={searchActors}
          disabled={filter.length < 1}
        />
      </View>
      <Text>{entete}</Text>
      {isError ? (
        <DisplayError message="Impossible de récupérer les acteurs/trices" />
      ) : (
        <FlatList
          data={actors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ActorListItem
              actorData={item}
              onClick={navigateToActorDetails}
              isFav={isFavoriteActor(item.id)}
            />
          )}
          onEndReached={loadMoreActors}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          onRefresh={filter.length < 1 ? searchPopular : searchActors}
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

export default connect(mapStateToProps)(Search);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  inputActorName: {
    marginBottom: 8,
  },
});
