import LFS from "../utils/FetchService/LiferayFetchService";

let groupId = Liferay.ThemeDisplay.getScopeGroupId();

export const getModuleHeaderConfig = async moduleId => {
  let returnVal = await LFS.apiCall("getHeaderUtilByModule", "headerutil", {
    moduleId
  });
  return returnVal;
};

export const addPageHeaderConfig = async pageHeaderConfig => {
  let returnVal = await LFS.apiCall("createHeaderUtil", "headerutil", {
    jsonData: JSON.stringify(pageHeaderConfig)
  });
  return returnVal;
};

export const updatePageHeaderConfig = async pageHeaderConfig => {
  let returnVal = await LFS.apiCall("updateHeaderUtil", "headerutil", {
    jsonData: JSON.stringify(pageHeaderConfig)
  });
  return returnVal;
};

export const deletePageHeaderConfig = async id => {
  let returnVal = await LFS.apiCall("deleteHeaderUtil", "headerutil", {
    id
  });
  return returnVal;
};

export const getCurrentSite = async () => {
  let currentSite = "";
  await Liferay.Service("/group/get-group", { groupId: groupId }, function(
    obj
  ) {
    currentSite = obj;
  });
  return currentSite;
};
