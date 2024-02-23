import { COMMAND_TYPE } from "../constants/command-types";

export type addUserToRoom = {
  type: typeof COMMAND_TYPE.ADD_USER_TO_ROOM;
  data: {
    indexRoom: number;
  };
  id: number;
};
