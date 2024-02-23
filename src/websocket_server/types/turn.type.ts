import { COMMAND_TYPE } from "../constants/command-types";

export type turn = {
  type: typeof COMMAND_TYPE.TURN;
  data: {
    currentPlayer: number;
  };
  id: number;
};
