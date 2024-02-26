import { addShips } from "./add-ships.type";
import { addUserToRoom } from "./add-user-to-room.type";
import { attackRequest } from "./attack.type";
import { createRoom } from "./create-room.type";
import { randomAttack } from "./random-attack.type";
import { regRequest } from "./reg.type";

export type dataTypeRequest =
  | regRequest["data"]
  | createRoom["data"]
  | addUserToRoom["data"]
  | addShips["data"]
  | attackRequest["data"]
  | randomAttack["data"];
