import { COMMAND_TYPE } from "../constants/command-types";

export type updateWinners = {
  type: typeof COMMAND_TYPE.UPDATE_WINNERS;
  data: {
    name: string;
    wins: number;
  }[];
  id: number;
};
