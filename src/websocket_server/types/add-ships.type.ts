import { COMMAND_TYPE } from "../constants/command-types";
import { ship } from "./ship.type";

export type addShips = {
  type: COMMAND_TYPE.ADD_SHIPS;
  data: {
    gameId: string;
    ships: ship[];
    indexPlayer: string;
  };
  id: number;
};
