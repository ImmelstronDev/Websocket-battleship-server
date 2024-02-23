import { COMMAND_TYPE } from "../constants/command-types";

export type finish = {
  type: typeof COMMAND_TYPE.FINISH;
  data: {
    winPlayer: number;
  };
  id: number;
};
