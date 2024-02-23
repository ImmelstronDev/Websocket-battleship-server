import { COMMAND_TYPE } from "../constants/command-types";

export type randomAttack = {
  type: typeof COMMAND_TYPE.RANDOM_ATTACK;
  data: {
    gameId: number;
    indexPlayer: number;
  };
  id: number;
};
