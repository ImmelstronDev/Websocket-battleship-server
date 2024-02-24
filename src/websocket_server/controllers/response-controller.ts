import { randomUUID } from "node:crypto";
import { COMMAND_TYPE } from "../constants/command-types";
import { regRequest } from "../types/reg.type";
import { validUser } from "../types/valid-user.type";
import { IWebsocketClient } from "../types/websocket-client.type";

export class ResponseController {
  constructor(wsClient: IWebsocketClient) {
    this.wsClientState = wsClient;
  }
  public wsClientState: IWebsocketClient;

  public registration(wsDataRequest: regRequest["data"] | validUser): string {
    if ("error" in wsDataRequest) {
      const responseObject = {
        type: COMMAND_TYPE.REG,
        data: JSON.stringify({
          name: "",
          index: 0,
          error: true,
          errorText: wsDataRequest.errorText,
        }),
        id: 0,
      };
      return JSON.stringify(responseObject);
    }

    const { name, password } = wsDataRequest;

    const user = {
      name: name,
      password: password,
      id: randomUUID(),
    };

    const responseObject = {
      type: COMMAND_TYPE.REG,
      data: JSON.stringify({
        name: user.name,
        index: user.id,
        error: false,
        errorText: "",
      }),
      id: 0,
    };
    this.wsClientState.playerState = user;
    return JSON.stringify(responseObject);
  }
}
