import LFS from "../utils/FetchService/LiferayFetchService";
import { USER_ID } from "../constants/constants";

export const setUserEventParticipation = async jsonData => {
  let returnVal = await LFS.apiCall(
    "setUserEventParticipation",
    "agendaeventuserpaticipation",
    {
      jsonData: JSON.stringify(jsonData)
    }
  );
  return returnVal;
};

export const addEventInBluemind = async (login, jsonData) => {
  let returnVal = await LFS.apiCall("addUserEvent", "bluemindclient", {
    login: login,
    password: "",
    jsonData: JSON.stringify(jsonData)
  });
  return returnVal;
};

export const getUserParticipations = async () => {
  let returnVal = await LFS.apiCall(
    "getUserParticipations",
    "agendaeventuserpaticipation",
    {
      userId: USER_ID
    }
  );
  return returnVal;
};

export const getEventParticipantUsers = async eventId => {
  let returnVal = await LFS.apiCall(
    "getEventParticipantUsers",
    "agendaeventuserpaticipation",
    {
      eventId
    }
  );
  return returnVal;
};
