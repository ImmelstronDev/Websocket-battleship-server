import { COMMAND_TYPE } from "../constants/command-types";
import { ship } from "./ship.type";

export type addShips = {
  type: COMMAND_TYPE.ADD_SHIPS;
  data: {
    gameId: number;
    ships: ship[];
    indexPlayer: number;
  };
  id: number;
};
