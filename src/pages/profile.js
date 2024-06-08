import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfileSetting from "../components/Profile-Setting";
import AdressCard from "../components/adress-card";
import Buttom from "../components/Buttom";
import { logoutUser } from "../redux/actions/actionAuth";

export default function Profile({ navigation }) {
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
  const dispatch = useDispatch();
  function logout() {
    dispatch(logoutUser());
  }

  // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <View>
      <View className="mt-5  font-bold mb-6 ">
        <Text className=" ml-6 text-lg font-bold">
          Welcome, {userData && userData.Email}
        </Text>
      </View>
      {console.log(userData)}
      <View>
        {userData && (
          <ProfileSetting
            name={"Adem"}
            Phonenumber={userData.TelMobile}
            password={userData.Password}
          />
        )}
      </View>

      <View>
        {userData && (
          <AdressCard adress={userData.Address} region={userData.Governorate} />
        )}
      </View>
    </View>
  );
}