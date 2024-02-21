import { RawData, WebSocketServer } from "ws";
// const WS_PORT = Number(process.env.WS_PORT) || 3000;

// export const wss = new WebSocketServer({ port: WS_PORT });

export class Wss {
  constructor(public port: number) {
    this.wss = new WebSocketServer({ port });
    this.connection();
  }
  public wss: WebSocketServer;

  private connection() {
    this.wss.on("connection", function connection(ws) {
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
    });
  }
}
