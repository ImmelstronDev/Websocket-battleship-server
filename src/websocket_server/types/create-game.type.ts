import { COMMAND_TYPE } from "../constants/command-types";

export type createGame = {
  type: typeof COMMAND_TYPE.CREATE_GAME;
  data: {
    idGame: number;
    idPlayer: number;
  };
  id: number;
};
