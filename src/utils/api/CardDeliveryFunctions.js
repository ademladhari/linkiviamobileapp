import { patchData } from "../../redux/actions/ActionUpdate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApi } from "./api";
import { Alert } from "react-native";

export const handleCheckBoxPress = (cardId, checkedCards, setCheckedCards) => {
  if (checkedCards.includes(cardId)) {
    setCheckedCards(checkedCards.filter((id) => id !== cardId));
  } else {
    setCheckedCards([...checkedCards, cardId]);
  }
};
export const handleCheckBoxPressForPending = (
  cardId,
  departureLab,
  checkedCards,
  setCheckedCards,
  allDemands
) => {
  // Get the departure lab of the first checked card, if any are checked
  const firstCheckedCardDepartureLab =
    checkedCards.length > 0
      ? allDemands.find((demand) => demand.DemandID === checkedCards[0])
          .departurelab
      : null;

  if (checkedCards.includes(cardId)) {
    // Allow unchecking of any card
    setCheckedCards(checkedCards.filter((id) => id !== cardId));
  } else if (
    checkedCards.length === 0 ||
    departureLab === firstCheckedCardDepartureLab
  ) {
    // Allow checking if no cards are checked or if the departure labs match
    setCheckedCards([...checkedCards, cardId]);
  } else {
    // Optionally, handle feedback for the user here if the labs do not match
    alert("You can only select demands with the same departure lab.");
  }
};

/*<Image
source={{
  uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOYSURBVO3BMY7jSAAEwcyG/v/lOhlrlEWAEDW7c6gI88bMH4eZcpgph5lymCmHmXKYKYeZcpgph5lymCmHmXKYKYeZcpgph5ny4kMqPykJTaUloal8UxKuqPykJHziMFMOM+UwU148LAlPUvmbknBFpSXhShKepPKkw0w5zJTDTHnxZSp3JOGOJDSVK0loKi0JP0nljiR802GmHGbKYaa8+OVUWhKaypUkXFG5koT/k8NMOcyUw0x58csloal8UxKaSkvCb3aYKYeZcpgpL74sCX9TEprKHUloKk9Kwr/kMFMOM+UwU148TOUnqbQkNJWWhKbSktBUWhKayh0q/7LDTDnMlMNMMW/8YipXktBUWhLuULmShN/sMFMOM+UwU158SKUloalcSUJTuSMJTaWptCQ0lStJ+IRKS8IVlZaEpnIlCZ84zJTDTDnMFPPGB1RaEu5QuZKEpnJHEppKS0JTuSMJd6i0JDSVK0n4psNMOcyUw0x58TCVloSm0pLQVJrKlSQ0lStJuCMJT0pCU2lJ+JsOM+UwUw4zxbzxIJUrSfiESktCU2lJaCotCZ9QuZKEpvKkJDzpMFMOM+UwU8wbD1L5piQ8SaUloam0JFxRuZKEpvKkJHziMFMOM+UwU148LAlXVO5IwhWVn6TyCZU7ktBUvukwUw4z5TBTzBsPUmlJaCqfSMIVlTuS0FRaEj6h0pJwReWOJDzpMFMOM+UwU158SKUloam0JDSVK0loKnckoalcSUJTuSMJV1RaEloS7lBpSfjEYaYcZsphppg3/mEqLQlPUmlJaCotCU3lSUloKnck4ROHmXKYKYeZ8uIfl4QrKi0JTaUloSXhSUm4Q+VKEq6oPOkwUw4z5TBTXnxI5Scl4ZtUnqTSknBFpSWhqXzTYaYcZsphprx4WBKepHKHSktCU2lJuEPljiQ8KQlN5UmHmXKYKYeZ8uLLVO5Iwh1JaCpXkvCJJDSVpvKJJFxR+abDTDnMlMNMefHLqTwpCVdUWhKaypUkNJU7ktBUnnSYKYeZcpgpL/5nktBUWhLuUGlJaCp3qFxRaUloKi0JTzrMlMNMOcyUF1+WhG9KQlO5ovKkJDSVloSm0pLQVJpKS8I3HWbKYaYcZsqLh6n8JJUrSWgqLQnfpNKS0FTuULmShE8cZsphphxminlj5o/DTDnMlMNMOcyUw0w5zJTDTDnMlMNMOcyUw0w5zJTDTDnMlMNM+Q9KQZUffwDbdwAAAABJRU5ErkJggg==",
}}
style={{ width: 10, height: 10 }}
/>*/
// Function to display checked card IDs
export const handleShowCheckedIds = async (
  checkedCards,
  dispatch,
  status,
  filteredDemandes
) => {
  // Check if there are checked cards
  const userJson = await AsyncStorage.getItem("userData");
  const user = JSON.parse(userJson);
  if (checkedCards.length > 0) {
    // If updateDemande and demandId are available, dispatch patchData action
    if (status === "collected") {
      const demandeWithId10 = filteredDemandes.find(
        (demande) => demande.DemandID === checkedCards[0]
      );

      if (demandeWithId10) {
        updateDemandes(
          demandeWithId10.departurelab,
          demandeWithId10.arrivallab,
          checkedCards
        );
      } else {
        console.log("No demande found with the specified ID.");
      }
      return;
    }
    // Iterate over the checked card IDs and update their status
    checkedCards.forEach((cardId) => {
      // Dispatch patchData a ction to update status

      if (status === "affected") {
        dispatch(
          patchData(cardId, {
            Status: status,
            agentUserID: user.UserID,
          })
        );
      } else {
        dispatch(
          patchData(cardId, {
            Status: status,
          })
        );
      }
    });

    // If updateDemande and demandId are not available, show alert with checked card IDs
    alert("Checked IDs: " + checkedCards.join(", "));
  } else {
    // If no cards are checked, show alert
    alert("No cards are checked.");
  }
};
export const handleCardLongPress = (cardId) => {
  // Toggle selection of the card
  handleCheckBoxPress(cardId);
};
export const updateDemandes = async (
  departurelab,
  arrivallab,
  checkedCards
) => {
  try {
    const response = await getApi.post(
      "/MobileDemand/AffectGroop",
      {
        arrivalLabId: arrivallab,
        departureLabId: departurelab,
        demandIDS: checkedCards,
      },
      {
        headers: {
          "x-api-key": "1111", // Assuming the header key for the API key is 'API-Key'
        },
      }
    );
    console.log(response); // Assuming you want to return the response data

    return response;
  } catch (error) {
    Alert.alert(
      "Error", // Title of the alert
      "The User Doesn't have the necessary Quota.", // Message of the alert
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
    throw "error"; // Re-throw the error to handle it elsewhere if needed
  }
};
