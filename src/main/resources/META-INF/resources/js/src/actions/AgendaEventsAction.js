import LFS from "../utils/FetchService/LiferayFetchService";

let groupId = Liferay.ThemeDisplay.getScopeGroupId();

export const getAgendaEvents = async id => {
  let returnVal = await LFS.apiCall("getAgendaEvents", "agendaevents", {
    id
  });
  return returnVal;
};

export const getEventDetail = async id => {
  let returnVal = await LFS.apiCall("getEventDetail", "agendaevents", {
    id
  });
  return returnVal;
};

export const getAllAgendaEvents = async () => {
  let returnVal = await LFS.apiCall("getAllAgendaEvents", "agendaevents", {
    groupId
  });
  return returnVal;
};

export const createAgendaEvents = async jsonData => {
  let stringifiedJsonData;
  try {
    stringifiedJsonData = JSON.stringify(jsonData);
  } catch (e) {
    return 502;
  }
  let returnVal = await LFS.apiCall("createAgendaEvents", "agendaevents", {
    jsonData: stringifiedJsonData
  });
  return returnVal;
};

export const updateAgendaEvents = async jsonData => {
  let stringifiedJsonData = JSON.stringify(jsonData);
  try {
    stringifiedJsonData = JSON.stringify(jsonData);
  } catch (e) {
    return 502;
  }
  let returnVal = await LFS.apiCall("updateAgendaEvents", "agendaevents", {
    jsonData: stringifiedJsonData
  });
  return returnVal;
};

export const deleteAgendaEvents = async id => {
  let returnVal = await LFS.apiCall("deleteAgendaEvents", "agendaevents", {
    id
  });
  return returnVal;
};

export const updateAgendaEventStatus = async (id, status, motif) => {
  let returnVal = await LFS.apiCall("updateAgendaEventStatus", "agendaevents", {
    id,
    status,
    motif: motif
  });
  return returnVal;
};
export const duplicateEvent = async eventId => {
  let returnVal = await LFS.apiCall("duplicateEvent", "agendaevents", {
    eventId
  });
  return returnVal;
};

export const unarchiveEvent = async eventId => {
  let returnVal = await LFS.apiCall("unarchiveEvent", "agendaevents", {
    eventId
  });
  return returnVal;
};
