import { RawData, WebSocketServer } from "ws";
import { IWebsocketClient } from "../types/websocket-client.type";
import { DataController } from "./data-controller";

export class WebSocketController {
  constructor(wss: WebSocketServer) {
    this.wss = wss;
  }
  public wss: WebSocketServer;
  public wsClientState: IWebsocketClient;
  public dataController: DataController;

  public connection = (wsClientState: IWebsocketClient) => {
    this.wsClientState = wsClientState;
    this.dataController = new DataController(this.wsClientState, this.wss);
    wsClientState.on("error", console.error);
    wsClientState.on("message", this.message);
    wsClientState.on("close", function close() {
      console.log("websocket connection was closed");
    });
  };

  private message = (data: RawData): void => {
    const requestObject = JSON.parse(data.toString());
    console.log("reserved: %s", data);
    const responseObject =
      this.dataController.wsRequestDataHandler(requestObject);
    console.log("responseObj: %s", responseObject);

    if (responseObject) {
      this.wsClientState.send(responseObject);
    }
  };
}
