declare const __SOCKET_URL__: string;

import { WS } from "./ws";
const ws = new WS(new WebSocket(__SOCKET_URL__));
