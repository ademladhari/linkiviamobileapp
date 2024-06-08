import { getApi } from "../utils/api/api";

export const NotificationData = async () => {
  try {
    const response = await getApi.get(`/NotificationTokens`); // Adjust the URL as per your API endpoint

    return response.data;
    // Assuming you want to return the data from the response
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
};
export const NotificationTokenPost = async (UserID, NotificationToken) => {
  try {
    const response = await getApi.post("/NotificationTokens", {
      UserID: UserID,
      NotificationToken: NotificationToken,
    });
    return response; // Assuming you want to return the response data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
};

// prettier-ignore
export const NotificationTokenDelete = async (NotifcationID) => {
  try {
    const response = await getApi.delete(`/NotificationTokens/${NotifcationID}`);
    return response; // Assuming you want to return the response data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
};
export const NotificationHistoryData = async (page) => {
  try {
    const response = await getApi.get(`/NotificationMsg`, {
      params: {
        page: page, // Start with page 1
        // Add any other query parameters as needed
        // Example:
        // sort: "desc", // Sorting order
        // includeAssigned: true // Whether to include assigned items
      },
    }); // Adjust the URL as per your API endpoint

    return response.data;
    // Assuming you want to return the data from the response
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
};
