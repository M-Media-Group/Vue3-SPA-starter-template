import { Listeners } from "../events";

// import analytics from "./analytics";
import console from "./console";
import notifications from "./notifications";
import broadcastChannel from "./broadcastChannel";
// import postMessage from "./postMessage";

export default new Listeners(notifications, broadcastChannel, console);
