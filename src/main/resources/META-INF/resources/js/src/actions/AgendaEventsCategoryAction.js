import LFS from "../utils/FetchService/LiferayFetchService";

let groupId = Liferay.ThemeDisplay.getScopeGroupId();

export const getAgendaEventsCategory = async id => {
  let returnVal = await LFS.apiCall(
    "getAgendaEventsCategory",
    "agendaeventcategory",
    {
      id
    }
  );
  return returnVal;
};

export const getAllAgendaEventsCategories = async () => {
  let returnVal = await LFS.apiCall(
    "getAllAgendaEventsCategories",
    "agendaeventcategory",
    {
      groupId
    }
  );
  return returnVal;
};

export const createAgendaEventsCategory = async jsonData => {
  let returnVal = await LFS.apiCall(
    "createAgendaEventsCategory",
    "agendaeventcategory",
    {
      jsonData: JSON.stringify(jsonData)
    }
  );
  return returnVal;
};

export const updateAgendaEventsCategory = async jsonData => {
  let returnVal = await LFS.apiCall(
    "updateAgendaEventsCategory",
    "agendaeventcategory",
    {
      jsonData: JSON.stringify(jsonData)
    }
  );
  return returnVal;
};

export const deleteAgendaEventsCategory = async id => {
  let returnVal = await LFS.apiCall(
    "deleteAgendaEventsCategory",
    "agendaeventcategory",
    {
      id
    }
  );
  return returnVal;
};
