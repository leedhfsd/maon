import { apiClient } from "../customAxios";
import useAuthStore from "../store/AuthStore";
export const getPracticeRoomIdWithRoute = async (routeId, memberId) => {
  try {
    const response = await apiClient.post(
      `/route/running/createRunning`,
      {
        routeId: routeId,
        memberId: memberId,
        recordType: "PRACTICE",
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
        },
      }
    );
    // console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getPracticeRoomId = async (memberId, accessToken) => {
  try {
    const response = await apiClient.post(
      `/route/running/createRunning`,
      {
        routeId: "",
        memberId: memberId,
        recordType: "PRACTICE",
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
        },
      }
    );
    // console.log(response.data.data);
    return response.data.data.recordId;
  } catch (error) {
    console.error("getPracticeRoomId Error:", error);
  }
};

export const getRaceRoomId = async (routeId, memberId) => {
  try {
    const response = await apiClient.post(
      `/route/running/createRunning`,
      {
        routeId: routeId,
        memberId: memberId,
        recordType: "RACE",
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.accessToken}`, // Authorization 헤더에 Bearer 토큰 추가
        },
      }
    );
    // console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
