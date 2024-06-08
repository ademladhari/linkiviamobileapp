import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import DeliveryDetailsCard from "../components/DeliveryDetailsCard";
import CustomerDetails from "../components/CustomerDetails";
import {
  getCoordinatesForMap,
  getStatusAddressForMap,
  getStatusLabName,
} from "../utils/api/functions";
import { patchData } from "../redux/actions/ActionUpdate";
import { fetchMedications } from "../redux/actions/actiondata";

export default function DetailsScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { demande, updateDemande, page } = route.params;
  const [localDemande, setLocalDemande] = useState(demande);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userJson = await AsyncStorage.getItem("userData");
        const user = JSON.parse(userJson);
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handlePatch = async () => {
    const demandId = localDemande.DemandID;
    let updatedStatus = "";

    // Determine the next status based on the current status
    switch (localDemande.Status) {
      case "en cours":
        updatedStatus = "affected";
        break;
      case "affected":
        updatedStatus = "collected";
        break;
      case "collected":
        updatedStatus = "livre";
        break;
      case "livre":
        updatedStatus = "livre";
        break;
      default:
        updatedStatus = "en cours";
        break;
    }

    const updatedDemande = {
      ...localDemande,
      Status: updatedStatus,
      Address: getStatusAddressForMap(localDemande),
      name: getStatusLabName(localDemande),
      agentUserID: userData?.UserID,
    };

    // Update local state
    setLocalDemande(updatedDemande);
    console.log(updateDemande);
    if (updateDemande) {
      // Call the update function passed from DeliveryPage
      updateDemande(updatedDemande);
    }
    // Dispatch the action to update the data
    if (localDemande.Status === "en cours") {
      dispatch(
        patchData(demandId, {
          Status: updatedStatus,
          agentUserID: userData.UserID,
        })
      );
    } else {
      dispatch(
        patchData(demandId, {
          Status: updatedStatus,
        })
      );
    }

    // Add a short delay before fetching the data again
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Refetch data after patching
    dispatch(fetchMedications());
  };

  return (
    <View className="h-screen ">
      <View className="w-full h-[5%]  bg-blue-600 text-red-400"></View>
      <View className=" flex flex-row mb-4 ">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(page);
          }}
        >
          <Ionicons
            className=" mt-48   "
            name="chevron-back"
            size={34}
            color="blue"
          />
        </TouchableOpacity>
        <Text className="text-3xl text-blue-700 text-center border-b-[2.2px] w-[60%] m-auto  border-[blue]   mt-8">
          Delivery Details
        </Text>
      </View>
      <View className="h-[35%]">
        {userData && (
          <CustomerDetails
            number={localDemande.DeparturePhoneNumber}
            Address={getStatusAddressForMap(localDemande)}
            name={getStatusLabName(localDemande)}
            statusdate={localDemande.Statusdate}
            qrcode={localDemande.codeQr}
            Coordinates={getCoordinatesForMap(localDemande)}
          />
        )}
      </View>

      <View className="h-[13%]">
        <Text className="text-3xl text-blue-700 text-center border-b-[2.2px] w-[60%] m-auto  border-[blue]   mt-8">
          Demande Details
        </Text>
      </View>
      <View>
        <DeliveryDetailsCard demande={localDemande}></DeliveryDetailsCard>
      </View>

      <View className="h-[10%] w-[90%] m-auto mt-7">
        <Button
          title={localDemande.Status}
          className="rounded-lg "
          onPress={handlePatch}
        ></Button>
      </View>
    </View>
  );
}
