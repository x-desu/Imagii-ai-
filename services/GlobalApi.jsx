import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://strapiai-dqw1j.kinsta.app/api",
  headers: {
    Authorization: "Bearer " + process.env.EXPO_PUBLIC_STRAPI_API_KEY,
  },
});

const GetUserInfo = async (email) => {
  try {
    const res = await axiosClient.get(
      "user-lists?filters[userEmail][$eq]=" + email
    );
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const CreateUser = async (data) => {
  try {
    const res = await axiosClient.post("user-lists", { data: data });
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const GetFeaturedCategoryList = async () => {
  try {
    const res = await axiosClient.get(
      "/ai-models?filters[isFeatured][$eq]=true&populate=*"
    );
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const GetAiModels = async (type) => {
  try {
    const res = await axiosClient.get(
      "ai-models?filters[" + type + "][$eq]=true&populate=*"
    );
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const AiGenImage = async (data) => {
  try {
    const res = await axios.post("http://192.168.1.5:8082/aimodel", data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

export const UpdateUserCredits = async (id, data) => {
  console.log(data, id);
  try {
    const res = await axiosClient.put(`user-lists/` + id, {
      data: data,
    });

    return res.data;
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

export const AddAiImageRecord = async (data) => {
  try {
    const res = await axiosClient.post("/ai-generated-images", { data: data });
    return res.data;
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

export const GetAllAiImages = async (page) => {
  try {
    const res = await axiosClient.get(
      "/ai-generated-images?pagination[page]=" +
        (page - 8) +
        "&pagination[pageSize]=" +
        page
    );
    if (!res.data || res.data.data.length === 0) {
      console.log("No more data available");
      return [];
    }
    return res.data.data;
  } catch (error) {
    console.error("Axios Error:", error.response?.data || error.message);
    throw error;
  }
};

export default GetUserInfo;
