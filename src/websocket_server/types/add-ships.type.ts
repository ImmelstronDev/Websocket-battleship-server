import { COMMAND_TYPE } from "../constants/command-types";
import { SHIP_SIZE } from "../constants/ship-size";

export type addShips = {
  type: COMMAND_TYPE.ADD_SHIPS;
  data: {
    gameId: number;
    ships: {
      position: {
        x: number;
        y: number;
      };
      direction: boolean;
      length: number;
      type: typeof SHIP_SIZE;
    }[];
    indexPlayer: number;
  };
  id: number;
};
