//Singleton "FetchService" to fetch data from Liferay's Remote Services delivered by Service Builder

export default class FetchService {
  static instance = null;

  static instance = null;

  //Routes du service builder
  static api = {
    //permission
    getPermissionsByPortletId: "get-all-by-portlet-id",
    checkIfIsAdmin: "check-if-is-admin",
    checkIfHasRole: "check-if-has-role",
    //Search
    searchQuery: "search-query",
    //HeaderConfig
    getHeaderUtilByModule: "get-header-util-by-module",
    createHeaderUtil: "create-header-util",
    updateHeaderUtil: "update-header-util",
    deleteHeaderUtil: "delete-header-util",
    //Util
    getUserAvatarByMail: "get-user-avatar-by-mail",

    //Agenda Event
    getAgendaEvents: "get-agenda-events",
    getAllAgendaEvents: "get-all-agenda-events",
    updateAgendaEvents: "update-agenda-events",
    createAgendaEvents: "create-agenda-events",
    deleteAgendaEvents: "delete-agenda-events",
    updateAgendaEventStatus: "update-agenda-event-status",
    getEventDetail: "get-event-detail",
    duplicateEvent: "duplicate-event",
    unarchiveEvent: "unarchive-event",

    //Agenda Event Category
    getAgendaEventsCategory: "get-agenda-event-category",
    getAllAgendaEventsCategories: "get-all-agenda-event-categories",
    updateAgendaEventsCategory: "update-agenda-event-category",
    createAgendaEventsCategory: "create-agenda-event-category",
    deleteAgendaEventsCategory: "delete-agenda-event-category",

    //Agenda Event User Paticipation
    setUserEventParticipation: "set-user-event-participation",
    getUserParticipations: "get-user-participations",
    getEventParticipantUsers: "get-event-participant-users",
    //Inscription
    addEventInscription: "add-event-inscription",
    getAllEventInscriptions: "get-all-event-inscriptions",
    deleteEventInscriptionbyId: "delete-event-inscriptionby-id",
    updateEventInscription: "update-event-inscription",
    //Bleumind
    addUserEvent: "add-user-event"
  };

  static serviceURI = "/servicebuilder";

  static createInstance() {
    var o = new FetchService();
    return o;
  }

  static getInstance() {
    if (!FetchService.instance)
      FetchService.instance = FetchService.createInstance();
    return FetchService.instance;
  }

  //apiCall: on appelle cette fonction en spécifiant une route ci dessus, des paramètres (ou vide si pas de params)
  //Return : l'objet, que quand elle l'a car asynchrone
  static async apiCall(route, entity, params = {}) {
    let object = [];
    let fullRoute = this.getRoute(route, entity);
    params.portletid = await Liferay.Portlet.list.filter(portlet =>
      portlet.includes("agiiragenda_INSTANCE")
    )[0];
    try {
      await Liferay.Service(fullRoute, params, function(obj) {
        object = obj;
      });
    } catch (e) {
      return 502;
    }
    if (object instanceof Array) {
      if (typeof object[0] === "string") {
        object = this.convertStrArrayToJsonArray(object);
      }
    } else {
      if (typeof object === "string") {
        object = this.convertStrArrayToJsonArray(object);
      }
    }
    return object;
  }

  static getRoute(routeName, entity) {
    let route = this.api[routeName];
    if (route != null) {
      return this.serviceURI + "." + entity + "/" + route;
    } else {
      return "LFS: UNKNOWN_ROUTE_NAME";
    }
  }

  static isUserConnected() {
    return Liferay.ThemeDisplay.isSignedIn();
  }

  static convertStrArrayToJsonArray(array) {
    let returnArray = [];
    if (array instanceof Array) {
      array.map(str => {
        returnArray.push(JSON.parse(str));
      });
      //console.log("Parsed array", returnArray)
      return returnArray;
    }
    return array;
  }
}
