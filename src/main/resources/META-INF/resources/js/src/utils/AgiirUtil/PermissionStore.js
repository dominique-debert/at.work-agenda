import React from "react";
import LFS from "../FetchService/LiferayFetchService";

export default class PermissionStore {
  static instance = null;
  static permissions = [];
  static CheckIfIsAdmin = false;

  static setPermissions(perms) {
    //console.log("setting permissions");
    PermissionStore.permissions = perms;
  }

  static setCheckIfIsAdmin(isAdmin) {
    //console.log("setting permissions");
    PermissionStore.CheckIfIsAdmin = isAdmin;
  }

  static getCheckIfIsAdmin() {
    //console.log("Getting by instance",PermissionStore.getInstance().permissions );
    //console.log("Getting by static", PermissionStore.permissions);
    return PermissionStore.CheckIfIsAdmin;
  }

  static getPermissions() {
    //console.log("Getting by instance",PermissionStore.getInstance().permissions );
    //console.log("Getting by static", PermissionStore.permissions);
    return PermissionStore.permissions;
  }

  static createInstance() {
    var o = new PermissionStore();
    return o;
  }

  static getInstance() {
    if (!PermissionStore.instance)
      PermissionStore.instance = PermissionStore.createInstance();
    return PermissionStore.instance;
  }

  static hasPermission = async (key, entity) => {
    var res = await PermissionStore.getInstance()
      .getRoles()
      .then(r => {
        let roles = r;
        //console.log("Roles settled", roles);
        //PROBLEME D'INDEXATION ICI
        if (PermissionStore.getPermissions().length != 0) {
          let permissions = PermissionStore.permissions.filter(
            it =>
              it.permKeys.includes(key) &&
              it.entity === entity &&
              roles.includes(it.roleId)
          );
          //console.log("FILTERING", "key=" + key + ", entity=" + entity);
          //console.log("In hasPermissions, permissions=", permissions);
          if (permissions.length != 0) return true;
          return false;
        } else {
          //console.error("no permissions in array");
          return false;
        }
      });

    return res;
  };

  async getRoles() {
    var object = [];
    await Liferay.Service(
      "/role/get-user-roles",
      {
        userId: Liferay.ThemeDisplay.getUserId()
      },
      function(response) {
        //console.log(response);

        var roles = [];
        response.forEach(function(e) {
          roles.push(e);
        });
        //console.log("before returning roles in object", roles);
        object = roles;
      }
    );
    return await object;
  }
}

//  import PermissionStore from "./PermissionStore.js"; Sur chaque composant
// Pour set -> PermissionStore.maVariable = "valeur";
// Pour get -> let maValeur = PermissionStore.maVariable;
// Attention de ne pas faire PermissionStore = null;
//Pour les fonctions: PemrissionStore.hasPermission('GET', 'petiteAnnonces')
