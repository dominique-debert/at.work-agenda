import LFS from "../utils/FetchService/LiferayFetchService";

export const getUserById = async id => {
  var user = {};
  await Liferay.Service(
    "/user/get-user-by-id",
    {
      userId: id
    },
    function(response) {
      user = response;
    }
  );
  if (user != null) {
    return user;
  }
};

export const getAllUsers = async () => {
  var users = [];
  await Liferay.Service("/user/get-users", function(response) {
    users = response;
  });
  if (users != null) {
    return users;
  }
};

export const getUserRoles = async id => {
  Liferay.Service(
    "/role/get-user-roles",
    {
      userId: id
    },
    function(response) {
      var roles = [];
      response.forEach(function(e) {
        roles.push(e.name); // or e.roleId
      });
    }
  );
};

export const getAvatarSrc = async email => {
  let returnVal = await LFS.apiCall("getUserAvatarByMail", "util", {
    email: email
  });
  return JSON.parse(returnVal);
};
