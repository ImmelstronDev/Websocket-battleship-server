import { WebSocket, WebSocketServer } from "ws";
import { COMMAND_TYPE } from "../constants/command-types";
import { commonPackage } from "../types/common-package.type";
import { dataTypeRequest } from "../types/data-type.type";
import { regRequest } from "../types/reg.type";
import { validUser } from "../types/valid-user.type";
import { IWebsocketClient } from "../types/websocket-client.type";
import { ResponseController } from "./response-controller";
import { createRoom } from "../types/create-room.type";
import { addUserToRoom } from "../types/add-user-to-room.type";
import { addShips } from "../types/add-ships.type";

export class DataController {
  constructor(wsClient: IWebsocketClient, wss: WebSocketServer) {
    this.responseController = new ResponseController(wsClient);
    this.wss = wss;
    this.wsClientState = wsClient;
  }
  protected responseController: ResponseController;
  protected wss: WebSocketServer;
  public wsClientState: IWebsocketClient;

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

    if (
      requestData &&
      typeof requestData === "object" &&
      "indexRoom" in requestData
    ) {
      return requestData as T;
    }

    if (
      requestData &&
      typeof requestData === "object" &&
      "indexPlayer" in requestData &&
      typeof requestData.indexPlayer === "string" &&
      "gameId" in requestData &&
      typeof requestData.gameId === "string" &&
      "ships" in requestData &&
      Array.isArray(requestData.ships)
    ) {
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

        const responseObject = this.responseController.registration(
          this.isValid<regRequest["data"]>(wsData)
        );
        this.wsClientState.send(responseObject);
        const rooms = this.responseController.createUpdateRoom();
        this.wsClientState.send(rooms);

        return;
      }
      case COMMAND_TYPE.CREATE_ROOM: {
        const wsData = requestData.data;
        const clients = this.wss.clients as Set<IWebsocketClient>;
        const validData = this.isValid<createRoom["data"]>(wsData);

        const isError = this.responseController.createRoom(validData);
        if (isError) {
          return JSON.stringify({
            ...isError,
            type: COMMAND_TYPE.CREATE_ROOM,
          });
        }

        for (const client of clients) {
          if (client.readyState === WebSocket.OPEN && client.playerState) {
            const rooms = this.responseController.createUpdateRoom();
            client.send(rooms);
          }
        }
        return;
      }
      case COMMAND_TYPE.ADD_USER_TO_ROOM: {
        const wsData =
          typeof requestData.data === "string"
            ? JSON.parse(requestData.data)
            : requestData.data;

        const isValidData = this.isValid<addUserToRoom["data"]>(wsData);
        if ("error" in isValidData) {
          return JSON.stringify({
            ...this.responseController.createErrorResponseObject(isValidData),
            type: COMMAND_TYPE.ADD_USER_TO_ROOM,
          });
        }

        const isGame = this.responseController.createGame(isValidData);

        if (!isGame) {
          return JSON.stringify({
            ...this.responseController.createErrorResponseObject,
            type: COMMAND_TYPE.ADD_USER_TO_ROOM,
            errorText: "Can not add user to room",
          });
        }

        const clients = this.wss.clients as Set<IWebsocketClient>;
        const rooms = this.responseController.createUpdateRoom();
        for (const client of clients) {
          if (
            client.readyState === WebSocket.OPEN &&
            client.playerState.roomId ===
              this.wsClientState.playerState.roomId &&
            client.playerState
          ) {
            client.playerState.idGame = this.wsClientState.playerState.idGame;
            const responseObject =
              this.responseController.createGameResponseObject(client);

            client.send(rooms);
            client.send(responseObject);
          } else if (client.readyState === WebSocket.OPEN) {
            client.send(rooms);
          }
        }
        return;
      }
      case COMMAND_TYPE.ADD_SHIPS: {
        const wsData =
          typeof requestData.data === "string"
            ? JSON.parse(requestData.data)
            : requestData.data;

        const isValidData = this.isValid<addShips["data"]>(wsData);
        if ("error" in isValidData) {
          return JSON.stringify({
            ...this.responseController.createErrorResponseObject(isValidData),
            type: COMMAND_TYPE.ADD_SHIPS,
          });
        }
        const ships = this.responseController.addShips(isValidData);
        console.log("SHIPS: %s", JSON.stringify(isValidData));
        if (!ships) {
          return JSON.stringify({
            type: COMMAND_TYPE.ADD_SHIPS,
            error: true,
            errorText: "invalid ships data",
          });
        }
        if (ships === "don't ready") {
          return;
        } else if (ships) {
          const clients = this.wss.clients as Set<IWebsocketClient>;

          for (const client of clients) {
            if (
              client.readyState === WebSocket.OPEN &&
              client.playerState.idGame ===
                this.wsClientState.playerState.idGame
            ) {
              client.send(client.playerState.startPosition);
              const gameId = client.playerState.idGame;
              const playerResponse =
                this.responseController.updatePlayer(gameId);
              client.send(playerResponse);
            }
          }
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
