import WebSocket from "ws";
import { ship } from "./ship.type";

export interface IWebsocketClient extends WebSocket {
  playerState: {
    name: string;
    password: string;
    index: string;
    roomId: string;
    idGame: string;
    ships: ship[];
    startPosition: string;
    // currentPlayer: string;
    shipPlacement: number[][];
  };
}
