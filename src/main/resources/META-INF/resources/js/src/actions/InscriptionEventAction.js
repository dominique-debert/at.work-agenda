import LFS from "../utils/FetchService/LiferayFetchService";
import { STATUS_REQUEST } from "../constants/constants";

export const addEventInscription = async jsonData => {
  let returnVal = await LFS.apiCall(
    "addEventInscription",
    "agendaeventinscription",
    {
      jsonData: JSON.stringify(jsonData)
    }
  );
  return returnVal;
};

export const updateEventInscription = async jsonData => {
  let returnVal = await LFS.apiCall(
    "updateEventInscription",
    "agendaeventinscription",
    {
      jsonData: JSON.stringify(jsonData)
    }
  );
  return returnVal;
};

export const getAllEventInscriptions = async () => {
  let returnVal = await LFS.apiCall(
    "getAllEventInscriptions",
    "agendaeventinscription"
  );
  return returnVal;
};

//eventInstanceId
export const getAllSubscribersByEventInstanceId = async id => {
  let res = await LFS.apiCall(
    "getAllEventInscriptions",
    "agendaeventinscription"
  );
  //let returnVal=res.filter(item=>item.eventInstanceId==id && item.status==STATUS_REQUEST.accepted)
  return res /*turnVal*/;
};
export const getAllSubscribersByEvent = async id => {
  let res = await LFS.apiCall(
    "getAllEventInscriptions",
    "agendaeventinscription"
  );
  let returnVal = res.filter(item => item.eventId == id);
  return returnVal;
};
export const getAllSubscribersByEventInstanceIdbyuser = async id => {
  let res = await LFS.apiCall(
    "getAllEventInscriptions",
    "agendaeventinscription"
  );
  let returnVal = res.filter(item => item.userId == id);
  return returnVal;
};
export const getAllSubscribersByEventInstanceIdpending = async id => {
  let res = await LFS.apiCall(
    "getAllEventInscriptions",
    "agendaeventinscription"
  );
  let returnVal = res.filter(
    item => item.eventInstanceId == id && item.status == STATUS_REQUEST.pending
  );
  return returnVal;
};
export const deleteEventInscriptionbyId = async id => {
  let returnVal = await LFS.apiCall(
    "deleteEventInscriptionbyId",
    "agendaeventinscription",
    {
      inscriptionId: parseInt(id)
    }
  );
  return returnVal;
};
