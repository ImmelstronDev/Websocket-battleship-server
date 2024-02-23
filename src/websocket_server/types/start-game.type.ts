import { COMMAND_TYPE } from "../constants/command-types";
import { SHIP_SIZE } from "../constants/ship-size";

export type startGame = {
  type: typeof COMMAND_TYPE.START_GAME;
  data: {
    ships: {
      position: {
        x: number;
        y: number;
      };
      direction: boolean;
      length: number;
      type: typeof SHIP_SIZE;
    }[];
    currentPlayerIndex: number;
  };
  id: number;
};
