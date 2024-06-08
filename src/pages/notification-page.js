import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { NotificationHistoryData } from "../services/Notificaiton";
import NotificationCard from "../components/notification-card";
import { GetSingleDemand } from "../services/getSingleDemand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NotificationsPage({ navigation }) {
  const [notificationData, setNotificationData] = useState([]);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { fontScale } = Dimensions.get("window");

  const handlePress = async (demandid) => {
    try {
      console.log("hehehe");
      const userJson = await AsyncStorage.getItem("userData");

      const user = JSON.parse(userJson);
      console.log("heh", user.UserID);

      const response = await GetSingleDemand(demandid);
      const demand = response[0];

      if (user.UserID === demand.agentUserID) {
        navigation.navigate("DetailsScreen", {
          demande: demand, // Assuming you want to pass the fetched demand data
          page: "Notification",
        });
      }
    } catch (error) {
      console.error("Failed to fetch demand:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchNotifications(1, true);
  };

  const fetchNotifications = async (pageNum, isRefreshing = false) => {
    try {
      setLoading(true);
      const data = await NotificationHistoryData(pageNum);
      if (!data.notifications || !Array.isArray(data.notifications)) {
        setError("Invalid notification data");
        return;
      }
      const sortedData = data.notifications.sort(
        (a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate)
      );
      setNotificationData((prevData) =>
        isRefreshing ? sortedData : [...prevData, ...sortedData]
      );
      setLoading(false);
      if (isRefreshing) {
        setRefreshing(false);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
      setLoading(false);
      if (isRefreshing) {
        setRefreshing(false);
      }
    }
  };

  const handleScrollToEnd = () => {
    if (!loading) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchNotifications(nextPage);
        return nextPage;
      });
    }
  };

  useEffect(() => {
    fetchNotifications(page);
  }, []);

  if (error) {
    return (
      <View>
        <Text>There was a problem fetching notifications.</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={notificationData}
        keyExtractor={(item) => item.notificationHistoryID.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item.DemandID)}>
            <NotificationCard message={item.Message} date={item.CreatedDate} />
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReachedThreshold={0.1}
        onEndReached={handleScrollToEnd}
        ListFooterComponent={loading && <Text></Text>}
      />
    </View>
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
