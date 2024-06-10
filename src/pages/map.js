import React, { useState, useEffect } from "react";
import { Button, View, Alert, Image } from "react-native";
import MapView, { Marker as MapMarker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { useIsFocused } from "@react-navigation/native";

export default function Map({ route }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const isFocused = useIsFocused();

  const { destination } = route.params;
  const [waypoints, setWaypoints] = useState(destination); // Array of locations

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    fetchRoute();
  }, [currentLocation, waypoints]);

  async function fetchRoute() {
    if (currentLocation && waypoints && waypoints.length > 0) {
      const waypointsString = waypoints
        .map((waypoint) => `${waypoint.longitude},${waypoint.latitude}`)
        .join(";");
      const { latitude, longitude } = currentLocation;
      const apiKey =
        "pk.eyJ1Ijoic2FpZm1zayIsImEiOiJjbHVyZnUzbmkwODJrMnJwYWZyem0ybXNoIn0.aSQunMAR3GWfJpVBaJkaEg"; // Replace with your actual Mapbox API key
      const apiUrl = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${longitude},${latitude};${waypointsString}?geometries=geojson&access_token=${apiKey}`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.trips && data.trips.length) {
          const coordinates = data.trips[0].geometry.coordinates.map(
            (coord) => ({
              latitude: coord[1],
              longitude: coord[0],
            })
          );
          setRouteCoordinates(coordinates);
        }
      } catch (error) {
        console.error("Error fetching optimized route:", error);
        Alert.alert("Routing Error", "Failed to fetch optimized route.");
      }
    }
  }

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please enable location services to use this app."
        );
      } else {
        getCurrentLocation(); // Automatically fetch the location if permission is granted
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const options = {
        accuracy: Location.Accuracy.BestForNavigation,
        timeout: 5000,
        maximumAge: 0,
      };
      const location = await Location.getCurrentPositionAsync(options);
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error("Error fetching current location:", error);
      Alert.alert(
        "Location Error",
        "Failed to fetch current location. Please ensure your location settings are enabled and try again."
      );
    }
  };
  useEffect(() => {
    if (isFocused) {
      setWaypoints(destination); // Update waypoints when the screen is focused
      fetchRoute(); // Optionally, fetch the route again if needed
    }
  }, [isFocused, destination]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 36.8065,
          longitude: 10.1815,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {currentLocation && (
          <MapMarker
            coordinate={currentLocation}
            title="Current Location"
            description="You are here"
            pinColor="blue"
          />
        )}
        {console.log(waypoints)}
        {waypoints &&
          waypoints.map((waypoint, index) => (
            <MapMarker
              key={index}
              coordinate={waypoint}
              title={waypoint.labName}
              pinColor="red"
            />
          ))}
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={4}
          strokeColor="red"
        />
      </MapView>
      <Button title="Get Current Location" onPress={getCurrentLocation} />
    </View>
  );
}
