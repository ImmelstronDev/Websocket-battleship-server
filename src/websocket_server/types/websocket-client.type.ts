import WebSocket from "ws";

export interface IWebsocketClient extends WebSocket {
  playerState: {
    name: string;
    password: string;
    id: string;
  };
}
