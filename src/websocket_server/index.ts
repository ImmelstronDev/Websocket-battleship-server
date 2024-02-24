import { WebSocketServer } from "ws";
import { WebSocketController } from "./controllers/web-socket-controller";

export class Wss {
  constructor(public port: number) {
    this.wss = new WebSocketServer({ port });
    this.wsController = new WebSocketController(this.wss);
    this.connection();
  }
  public wss: WebSocketServer;
  protected wsController: WebSocketController;

  private connection() {
    this.wss.on("connection", this.wsController.connection);
  }
}
