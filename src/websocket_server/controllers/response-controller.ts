import { randomUUID } from "node:crypto";
import { COMMAND_TYPE } from "../constants/command-types";
import { regRequest } from "../types/reg.type";
import { validUser } from "../types/valid-user.type";
import { IWebsocketClient } from "../types/websocket-client.type";
import { dataUsers } from "../../db/users";
import { createRoom } from "../types/create-room.type";
import { room } from "../types/database-types/room.type";
import { rooms } from "../../db/rooms";
import { addUserToRoom } from "../types/add-user-to-room.type";
import { createGame } from "../types/create-game.type";
import { user } from "../types/user.type";
import { games } from "../../db/games";

export class ResponseController {
  constructor(wsClient: IWebsocketClient) {
    this.wsClientState = wsClient;
  }
  public wsClientState: IWebsocketClient;

  public registration(wsDataRequest: regRequest["data"] | validUser): string {
    if ("error" in wsDataRequest) {
      return JSON.stringify(this.createErrorResponseObject(wsDataRequest));
    }

    const { name, password } = wsDataRequest;

    const user = {
      name: name,
      password: password,
    };

    dataUsers.push(user);
    console.log("dataUsers: %s", JSON.stringify(dataUsers));

    this.wsClientState.playerState = {
      ...user,
      index: randomUUID(),
      roomId: "",
      idGame: "",
    };

    const responseObject = {
      type: COMMAND_TYPE.REG,
      data: JSON.stringify({
        name: user.name,
        index: this.wsClientState.playerState.index,
        error: false,
        errorText: "",
      }),
      id: 0,
    };
    return JSON.stringify(responseObject);
  }

  public createRoom(wsDataRequest: createRoom["data"] | validUser) {
    if (typeof wsDataRequest === "string") {
      this.wsClientState.playerState.roomId = randomUUID();
      const { name, index, roomId } = this.wsClientState.playerState;

      const room: room = {
        roomId: roomId,
        roomUsers: [{ name: name, index: index }],
      };
      rooms.push(room);
      console.log("rooms: %s", JSON.stringify(rooms));

      const responseObject = {
        type: COMMAND_TYPE.UPDATE_ROOM,
        data: JSON.stringify(rooms),
        id: 0,
      };

      return JSON.stringify(responseObject);
    }
    return JSON.stringify(this.createErrorResponseObject(wsDataRequest));
  }

  public createGame(wsDataRequest: addUserToRoom["data"]) {
    const idGame = randomUUID();
    const { indexRoom: roomId } = wsDataRequest;
    const { index, name } = this.wsClientState.playerState;

    const game: createGame["data"] = {
      idGame: idGame,
      idPlayer: index,
    };

    const responseObject = {
      type: COMMAND_TYPE.CREATE_GAME,
      data: JSON.stringify(game),
      id: 0,
    };

    if (this.wsClientState.playerState.roomId === roomId) {
      return "";
    }

    this.wsClientState.playerState.roomId = roomId;
    this.wsClientState.playerState.idGame = idGame;

    const indexRoom = rooms.findIndex((room) => {
      room.roomId === roomId;
    });
    rooms[indexRoom]?.roomUsers.push({ index, name });
    const usersGame = rooms[indexRoom]?.roomUsers as user[];
    games.push({ stage: "preparing", idGame: idGame, users: usersGame });
    rooms.splice(indexRoom, 1);

    return JSON.stringify(responseObject);
  }

  public createUpdateRoom() {
    const responseObject = {
      type: COMMAND_TYPE.UPDATE_ROOM,
      data: JSON.stringify(rooms),
      id: 0,
    };
    return JSON.stringify(responseObject);
  }

  public createErrorResponseObject(responseData: validUser) {
    const responseObject = {
      type: COMMAND_TYPE.REG,
      data: JSON.stringify({
        name: "",
        index: 0,
        error: true,
        errorText: responseData.errorText,
      }),
      id: 0,
    };

    return responseObject;
  }
}
