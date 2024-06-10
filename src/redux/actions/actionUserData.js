import { userData } from "../../services/ServiceData"; // Assuming you renamed the function to fetchData
import { FETCH_USERDATA } from "../store/types ";
// Action Creator for fetching demands
export const fetchUserData = (userid) => {
  return async (dispatch) => {
    try {
      // Fetch demands data using the fetchData function
      const response = await userData(userid);
      // Dispatch the action with the demands data
      dispatch({
        type: FETCH_USERDATA,
        payload: response,
      });
    } catch (error) {
      // Handle any errors
      console.error("Error fetching demands:", error);
    }
  };
};
