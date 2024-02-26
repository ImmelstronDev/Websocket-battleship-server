import { COMMAND_TYPE } from "../constants/command-types";

export type updateRoom = {
  type: typeof COMMAND_TYPE.UPDATE_ROOM;
  data: {
    roomId: number;
    roomUsers: {
      name: string;
      index: number;
    }[];
  }[];
  id: number;
};
