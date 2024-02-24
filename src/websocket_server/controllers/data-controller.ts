import { COMMAND_TYPE } from "../constants/command-types";
import { commonPackage } from "../types/common-package.type";
import { dataTypeRequest } from "../types/data-type.type";
import { regRequest } from "../types/reg.type";
import { validUser } from "../types/valid-user.type";
import { IWebsocketClient } from "../types/websocket-client.type";
import { ResponseController } from "./response-controller";

export class DataController {
  constructor(wsClient: IWebsocketClient) {
    this.responseController = new ResponseController(wsClient);
  }
  protected responseController: ResponseController;

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
    return { error: true, errorText: "invalid data" };
  }

  public wsRequestDataHandler(requestData: commonPackage): string | void {
    const wsData =
      typeof requestData.data === "string"
        ? JSON.parse(requestData.data)
        : requestData.data;
    if (requestData.type === COMMAND_TYPE.REG) {
      return this.responseController.registration(
        this.isValid<regRequest["data"]>(wsData)
      );
    }
    return;
  }
}
