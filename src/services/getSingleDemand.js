import { getApi } from "../utils/api/api";

export const GetSingleDemand = async (demandID) => {
  try {
    const response = await getApi.get(`/MobileDemand/${demandID}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
