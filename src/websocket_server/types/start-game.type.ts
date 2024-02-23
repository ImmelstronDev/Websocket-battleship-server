import { COMMAND_TYPE } from "../constants/command-types";
import { ship } from "./ship.type";

export type startGame = {
  type: typeof COMMAND_TYPE.START_GAME;
  data: {
    ships: ship[];
    currentPlayerIndex: number;
  };
  id: number;
};
