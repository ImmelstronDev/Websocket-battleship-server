import WebSocket from "ws";

export interface IWebsocketClient extends WebSocket {
  playerState: {
    name: string;
    password: string;
    index: string;
    roomId: string;
    idGame: string;
  };
}
