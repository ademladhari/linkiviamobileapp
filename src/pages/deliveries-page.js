import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import Carddelivery from "../components/Carddelivery";
import { data } from "../services/ServiceData";
import {
  handleCheckBoxPress,
  handleShowCheckedIds,
  updateDemandes,
} from "../utils/api/CardDeliveryFunctions";
import { ShowCheckedIdsButton } from "../components/checkedbutton";
import SearchBar from "../components/search-bar";
import NotificationButton from "../components/notificationbutton";
import { useDispatch } from "react-redux";

export default function DeliveryPage({ navigation }) {
  const [checkedCards, setCheckedCards] = useState([]);
  const [showCheckbox, setshowCheckbox] = useState(false);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDemandes, setfilteredDemandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchBy, setSearchBy] = useState("requestName");
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [allDemandes, setAllDemandes] = useState([]); // State to hold all demandes

  useEffect(() => {
    fetchData(page);
  }, [page]);

  useEffect(() => {
    filterDemandes(searchQuery);
  }, [searchQuery, searchBy, allDemandes]);

  const fetchData = async (pageNum) => {
    try {
      setLoading(true);
      const response = await data(pageNum);
      setLoading(false);
      if (pageNum === 1) {
        setAllDemandes(response.demandes);
      } else {
        setAllDemandes((prevDemandes) => [
          ...prevDemandes,
          ...response.demandes,
        ]);
      }
      console.log("Data fetched successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  console.log(page);
  const onRefresh = () => {
    setRefreshing(true);
    resetCheckBoxs();
    fetchData(1).then(() => {
      setRefreshing(false);
    });
    setPage(1);
  };

  const resetCheckBoxs = () => {
    setshowCheckbox(false);
    setCheckedCards([]);
  };

  const updateStatusForChecked = () => {
    const updatedDemandes = allDemandes
      .map((demande) => {
        if (checkedCards.includes(demande.DemandID)) {
          return { ...demande, Status: "affected" };
        }
        return demande;
      })
      .filter((demande) => demande.Status !== "affected");

    setAllDemandes(updatedDemandes);
    setfilteredDemandes(
      updatedDemandes.filter(
        (demande) =>
          searchQuery === "" ||
          demande[searchBy].toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const filterDemandes = (query) => {
    if (query.trim() === "") {
      setfilteredDemandes(allDemandes);
    } else {
      setfilteredDemandes(
        allDemandes.filter((demande) =>
          demande[searchBy].toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const handleDoublePress = (demande) => {
    navigation.navigate("DetailsScreen", {
      demande: demande,
      updateDemandes: updateDemandeInState,
      page: "Delivery",
    })
  };

  const updateDemandeInState = (updatedDemande) => {
    setAllDemandes((prevDemandes) =>
      prevDemandes.map((demande) =>
        demande.DemandID === updatedDemande.DemandID ? updatedDemande : demande
      )
    );
    setfilteredDemandes((prevDemandes) =>
      prevDemandes.map((demande) =>
        demande.DemandID === updatedDemande.DemandID ? updatedDemande : demande
      )
    );
  };

  const handleScrollToEnd = () => {
    if (!loading && searchQuery === "") {
      setPage(page + 1);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{
          position: "absolute",
          top: -45,
          right: 15,
          zIndex: 60,
          flex: 1,
          width: 50,
        }}
      >
        <NotificationButton navigate={navigation.navigate} />
      </KeyboardAvoidingView>
      <TouchableOpacity
        activeOpacity={1}
        className="h-[92%]"
        onPress={() => {
          setshowCheckbox(false);
          resetCheckBoxs();
        }}
      >
        <SearchBar
          setSearchBy={setSearchBy}
          setSearchQuery={setSearchQuery}
          searchBy={searchBy}
        />
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={filteredDemandes}
          keyExtractor={(item) => item.DemandID.toString()}
          renderItem={({ item }) => (
            <View className="h-[90px] my-3">
              <TouchableOpacity
                onLongPress={() => handleDoublePress(item)}
                onPress={() => {
                  handleCheckBoxPress(
                    item.DemandID,
                    checkedCards,
                    setCheckedCards
                  );
                  setshowCheckbox(true);
                }}
                style={styles.cardContainer}
              >
                <Carddelivery
                  showCheckbox={showCheckbox}
                  demande={item}
                  setCheckedCards={setCheckedCards}
                  checkedCards={checkedCards}
                  handleCheckBoxPress={handleCheckBoxPress}
                  matrecule={item.ArrivalLabName}
                  name={item.requestName}
                  price={item.price}
                  place={item.DepartureAddress}
                  Governorate={item.Governorate}
                  DepartureGovernorate={item.DepartureGovernorate}
                  color={"p"}
                />
              </TouchableOpacity>
            </View>
          )}
          onEndReachedThreshold={0.1}
          onEndReached={handleScrollToEnd}
        />
      </TouchableOpacity>
      {showCheckbox && (
        <ShowCheckedIdsButton
          checkedIds={checkedCards}
          onPress={() => {
            handleShowCheckedIds(checkedCards, dispatch, "affected");
            updateStatusForChecked();
            resetCheckBoxs();
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
