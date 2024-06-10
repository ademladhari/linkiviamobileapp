import { NotificationData } from "../../services/Notificaiton";
import { data, fetchData } from "../../services/ServiceData"; // Assuming you renamed the function to fetchData
import {
  FETCH_demands,
  FETCH_NOTITFICATIONS,
  FETCH_NOtITFICATIONS,
} from "../store/types ";
// Action Creator for fetching demands
export const fetchNotifications = () => {
  return async (dispatch) => {
    try {
      // Fetch demands data using the fetchData function
      const response = await NotificationData();

      // Dispatch the action with the demands data
      dispatch({
        type: FETCH_NOTITFICATIONS,
        payload: response,
      });
    } catch (error) {
      // Handle any errors
      console.error("Error fetching demands:", error);
      // Optionally dispatch an error action
      // dispatch({ type: FETCH_demands_ERROR, payload: error.message });
    }
  };
};
