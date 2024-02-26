import { COMMAND_TYPE } from "../constants/command-types";
import { SHOT_STATUS } from "../constants/shots-status";

type ValueOf<T> = T[keyof T];

export type attackRequest = {
  type: typeof COMMAND_TYPE.ATTACK;
  data: {
    gameId: number;
    x: number;
    y: number;
    indexPlayer: number;
  };
  id: number;
};

export type attackResponse = {
  type: typeof COMMAND_TYPE.ATTACK;
  data: {
    position: {
      x: number;
      y: number;
    };
    currentPlayer: number;
    status: ValueOf<typeof SHOT_STATUS>;
  };
  id: number;
};
