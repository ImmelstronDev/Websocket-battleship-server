import { WebSocket, WebSocketServer } from "ws";
import { COMMAND_TYPE } from "../constants/command-types";
import { commonPackage } from "../types/common-package.type";
import { dataTypeRequest } from "../types/data-type.type";
import { regRequest } from "../types/reg.type";
import { validUser } from "../types/valid-user.type";
import { IWebsocketClient } from "../types/websocket-client.type";
import { ResponseController } from "./response-controller";
import { createRoom } from "../types/create-room.type";

export class DataController {
  constructor(wsClient: IWebsocketClient, wss: WebSocketServer) {
    this.responseController = new ResponseController(wsClient);
    this.wss = wss;
  }
  protected responseController: ResponseController;
  protected wss: WebSocketServer;

  protected isValid<T extends dataTypeRequest>(
    requestData: dataTypeRequest
  ): T | validUser {
    if (
      requestData &&
      typeof requestData === "object" &&
      "name" in requestData &&
      typeof requestData.name === "string" &&
      requestData.name.length >= 5 &&
      "password" in requestData &&
      typeof requestData.password === "string" &&
      requestData.password.length >= 5
    ) {
      return requestData as T;
    }

    if (typeof requestData === "string") {
      return requestData as T;
    }
    return { error: true, errorText: "invalid data" };
  }

  public wsRequestDataHandler(requestData: commonPackage): string | void {
    switch (requestData.type) {
      case COMMAND_TYPE.REG: {
        const wsData =
          typeof requestData.data === "string"
            ? JSON.parse(requestData.data)
            : requestData.data;
        return this.responseController.registration(
          this.isValid<regRequest["data"]>(wsData)
        );
      }
      case COMMAND_TYPE.CREATE_ROOM: {
        const wsData = requestData.data;
        const clients = this.wss.clients as Set<IWebsocketClient>;
        const validData = this.isValid<createRoom["data"]>(wsData);

        if (typeof validData !== "string") {
          return JSON.stringify({
            type: COMMAND_TYPE.CREATE_ROOM,
            ...validData,
          });
        }

        const rooms = this.responseController.createRoom(validData);
        for (const client of clients) {
          if (client.readyState === WebSocket.OPEN) client.send(rooms);
        }
        return;
      }

      default: {
        break;
      }
    }
    return;
  }
}
