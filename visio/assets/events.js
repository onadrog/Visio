import { EventSourcePolyfill } from "event-source-polyfill";
import store from "./redux";
import {
  DISCONNECTED_USERS,
  UPDATE_CONNECTED_USERS,
} from "./redux/usersReducer";
import { sendConnectUserHook, setUsersInRoom } from "./hooks";
import { removeVideoSrc } from "./component/Video";

const hub = "http://localhost:3000/.well-known/mercure";

/**
 * Fetch route to get user jwt token synchronously
 */
let tokenUser;
let id;
(function fetchToken() {
  var request = new XMLHttpRequest();
  request.open("GET", "/get_authentication", false);
  request.send(null);
  let response = JSON.parse(request.responseText);
  tokenUser = response.tokenSub;
  id = response.id;
})();

// ----------------------------------- Mercure hub Topics sub ----------------------------------- \\

const hubSub = new URL(hub);
hubSub.searchParams.append("topic", "https://aaa/user");
hubSub.searchParams.append("topic", `https://aaa/user/${id}`);
hubSub.searchParams.append("topic", "https://aaa/disconnected");
hubSub.searchParams.append("topic", `https://aaa/join`);

// -------------------------------- Subscribe to Mercure hub topics -------------------------------- \\

const evtHub = new EventSourcePolyfill(hubSub, {
  headers: {
    Authorization: `Bearer ${tokenUser}`,
  },
});

/**
 * Listen to Mercure hub events / Dispatch to redux store
 *
 * @param {String} peerId
 */
export const eventsHub = (peerId) => {
  evtHub.onmessage = ({ data }) => {
    const dataRecieved = JSON.parse(data);
    switch (dataRecieved.type) {
      case "connection":
        if (dataRecieved.peerId !== peerId) {
          setTimeout(() => {
            delete dataRecieved.type;
            sendConnectUserHook(dataRecieved, peerId);
          }, 1500);
        }
        break;
      case "disconnect":
        delete dataRecieved.type;
        store.dispatch({
          type: DISCONNECTED_USERS,
          payload: dataRecieved,
        });
        break;
      case "update":
        delete dataRecieved.type;
        store.dispatch({
          type: UPDATE_CONNECTED_USERS,
          payload: dataRecieved,
        });
        break;
      case "join":
        if (dataRecieved.peerId !== peerId) {
          delete dataRecieved.type;
          setUsersInRoom(dataRecieved);
          !dataRecieved.inRoom ? removeVideoSrc(dataRecieved.peerId) : null;
        }
        break;
      default:
        break;
    }
  };
};
