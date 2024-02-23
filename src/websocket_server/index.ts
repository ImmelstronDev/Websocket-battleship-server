import { WebSocketServer } from "ws";
import { WebSocketController } from "./controllers/web-socket-controller";
// const WS_PORT = Number(process.env.WS_PORT) || 3000;

// export const wss = new WebSocketServer({ port: WS_PORT });

export class Wss {
  constructor(public port: number) {
    this.wss = new WebSocketServer({ port });
    this.wsController = new WebSocketController();
    this.connection();
  }
  public wss: WebSocketServer;
  protected wsController: WebSocketController;

  private connection() {
    this.wss.on(
      "connection",
      this.wsController.connection
      // ws.on("error", console.error);
      // ws.on("message", function message(data: RawData) {
      //   console.log("reserved: %s", data);
      //   const requestObject = JSON.parse(JSON.stringify(data));
      //   const responseObject = {
      //     type: "reg",
      //     data: JSON.stringify({
      //       name: requestObject.name,
      //       index: 1,
      //       error: false,
      //       errorText: "no error",
      //     }),
      //     id: 0,
      //   };
      //   ws.send(JSON.stringify(responseObject));
      // });
    );
  }
}

const a = {
  type: "finish",
  data: {
    winPlayer: 1 /* id of the player in the current game session */,
  },
  id: 0,
};
