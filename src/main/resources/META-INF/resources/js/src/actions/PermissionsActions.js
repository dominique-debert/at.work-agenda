import LFS from "../utils/FetchService/LiferayFetchService";

export const getPermissionsByPortletId = async pId => {
  let object = await LFS.apiCall("getPermissionsByPortletId", "permission", {
    portletId: pId
  });
  //console.log("Permission List !");
  //console.log(object);
  return object;
};

export const isAdmin = async () => {
  let object = await LFS.apiCall("checkIfIsAdmin", "permission");
  return object;
};

export const checkIfHasRole = async role => {
  let object = await LFS.apiCall("checkIfHasRole", "permission", {
    role: role
  });
  return object;
};
