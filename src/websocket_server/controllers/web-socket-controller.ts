import { RawData, WebSocket } from "ws";

export class WebSocketController {
  constructor() {}
  public ws: WebSocket;

  public connection(ws: WebSocket) {
    this.ws = ws;

    ws.on("error", console.error);

    ws.on("message", function message(data: RawData) {
      console.log("reserved: %s", data);
      const requestObject = JSON.parse(JSON.stringify(data));
      const responseObject = {
        type: "reg",
        data: JSON.stringify({
          name: requestObject.name,
          index: 1,
          error: false,
          errorText: "no error",
        }),
        id: 0,
      };
      ws.send(JSON.stringify(responseObject));
    });
  }
}
