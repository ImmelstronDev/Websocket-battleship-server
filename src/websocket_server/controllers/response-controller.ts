import { randomUUID } from "node:crypto";
import { COMMAND_TYPE } from "../constants/command-types";
import { regRequest } from "../types/reg.type";
import { validUser } from "../types/valid-user.type";
import { IWebsocketClient } from "../types/websocket-client.type";
import { dataUsers } from "../../db/users";
import { room } from "../types/database-types/room.type";
import { rooms } from "../../db/rooms";
import { addUserToRoom } from "../types/add-user-to-room.type";
import { user } from "../types/user.type";
import { games } from "../../db/games";
import { addShips } from "../types/add-ships.type";

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
      ships: [],
      startPosition: "",
      shipPlacement: [],
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

  public createRoom(wsDataRequest: string | validUser) {
    if (typeof wsDataRequest === "string") {
      this.wsClientState.playerState.roomId = randomUUID();
      const { name, index, roomId } = this.wsClientState.playerState;

      const room: room = {
        roomId: roomId,
        roomUsers: [{ name: name, index: index, shipsPlacement: [] }],
      };

      const isRoom = rooms.find(
        (room) =>
          room.roomUsers.find((user) => user.index === index)?.index === index
      );
      if (isRoom) {
        return this.createErrorResponseObject;
      }
      rooms.push(room);
      console.log("rooms: %s", JSON.stringify(rooms));

      return;
    }
    return this.createErrorResponseObject(wsDataRequest);
  }

  public createGame(wsDataRequest: addUserToRoom["data"]): boolean | string {
    const idGame = randomUUID();
    const { indexRoom: roomId } = wsDataRequest;
    const { index, name } = this.wsClientState.playerState;

    if (this.wsClientState.playerState.roomId === roomId) {
      return false;
    }

    this.wsClientState.playerState.roomId = roomId;
    this.wsClientState.playerState.idGame = idGame;

    const room = rooms.find((room) => room.roomId === roomId);

    room?.roomUsers.push({ index, name, shipsPlacement: [] });
    const usersGame = [...(room?.roomUsers as user[])];
    games.push({
      stage: "prepare",
      idGame: idGame,
      users: usersGame,
      currentPlayer: "",
    });
    for (const user of usersGame) {
      rooms.splice(
        rooms.findIndex(
          (room) =>
            room.roomUsers.find(
              (userOutRoom) => userOutRoom.index === user.index
            )?.index === user.index
        ),
        1
      );
    }

    return true;
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

  public addShips(wsDataRequest: addShips["data"]) {
    const { gameId, indexPlayer, ships } = wsDataRequest;
    const { index, idGame } = this.wsClientState.playerState;

    const game = games.find((game) => game.idGame === gameId);
    console.log("Index player: %s", indexPlayer);
    console.log("Index : %s", index);

    if (idGame === gameId && game) {
      this.wsClientState.playerState.ships = ships;

      console.log("Game: %s:", JSON.stringify(game));
      const players = game.users;
      const player = players.find((player) => player.index === indexPlayer);
      if (player) {
        player.shipsPlacement = ships;
      }
      console.log("Game.stage: %s:", JSON.stringify(game.stage));

      const isReady = game.stage === "ready";

      if (isReady) {
        const responseObject = {
          type: COMMAND_TYPE.START_GAME,
          data: JSON.stringify({ ships, currentPlayerIndex: indexPlayer }),
          id: 0,
        };
        this.wsClientState.playerState.startPosition =
          JSON.stringify(responseObject);
        game.stage = "start";
        return JSON.stringify(responseObject);
      }

      game.stage = "ready";
      game.currentPlayer = index;
      const responseObject = {
        type: COMMAND_TYPE.START_GAME,
        data: JSON.stringify({ ships, currentPlayerIndex: indexPlayer }),
        id: 0,
      };
      this.wsClientState.playerState.startPosition =
        JSON.stringify(responseObject);
      return "don't ready";
    }
    return "";
  }

  public updatePlayer(gameId: string) {
    const game = games.find((game) => game.idGame === gameId);
    const player = game && game.currentPlayer;
    const responseObject = {
      type: COMMAND_TYPE.TURN,
      data: JSON.stringify({ currentPlayer: player }),
      id: 0,
    };
    return JSON.stringify(responseObject);
  }

  public createGameResponseObject(client: IWebsocketClient) {
    const { idGame, index } = client.playerState;

    const responseObject = {
      type: COMMAND_TYPE.CREATE_GAME,
      data: JSON.stringify({ idGame: idGame, idPlayer: index }),
      id: 0,
    };
    return JSON.stringify(responseObject);
  }
}
