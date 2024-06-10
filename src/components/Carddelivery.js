import React, { useEffect, useRef } from "react";
import { Image, Text, View, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CheckBox from "./Checkbox";

const Carddelivery = (props) => {
  const {
    name,
    place,
    price,
    color,
    showCheckbox,
    checkedCards,
    date,
    setCheckedCards,
    handleCheckBoxPress,
    demande,
  } = props;

  const Circle = ({ color = "#F6995C", size = 40 }) => (
    <View
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        borderRadius: size / 2,
        marginLeft: 15,
        marginTop: 20,
        alignItems: "center",
      }}
    >
      {showCheckbox && (
        <CheckBox
          checked={checkedCards.includes(demande.DemandID)}
          onPress={() =>
            handleCheckBoxPress(demande.DemandID, checkedCards, setCheckedCards)
          }
        />
      )}
    </View>
  );

  const CircleOpacity = ({ color = "#F6995C", size = 40 }) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      const animation = Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]);

      const loopAnimation = Animated.loop(animation);
      loopAnimation.start();
      return () => loopAnimation.stop();
    }, []);

    return (
      <Animated.View
        style={{
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: 0.2,
          transform: [{ scale: scaleValue }],
          marginLeft: 10,
          top: -25,
        }}
      />
    );
  };

  return (
    <View
      style={{
        width: "90%",
        height: "100%",
        backgroundColor: "#FFFFFE",
        marginTop: 12,
        marginLeft: 12,
        borderRadius: 8,
      }}
    >
      <View style={{ flexDirection: "row", flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Circle color="red" size={20} />
          <CircleOpacity color="red" size={30} />
        </View>

        <View style={{ flex: 4 }}>
          <Text style={{ fontSize: 18 }} numberOfLines={1} ellipsizeMode="tail">
            {demande.requestName}
          </Text>
          <Text
            style={{ fontSize: 14, marginVertical: 6 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {demande.Statusdate}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="place" size={23} color="green" />
            <Text
              style={{ fontSize: 14, flexShrink: 1 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {place}
            </Text>
          </View>
        </View>

        <View style={{ flex: 2 }}>
          <Text
            style={{
              fontSize: 20,
              marginTop: 18,
              marginLeft: 10,
              color: color,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {price} dt
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Carddelivery;
