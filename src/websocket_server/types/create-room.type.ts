import { COMMAND_TYPE } from "../constants/command-types";

export type createRoom = {
  type: typeof COMMAND_TYPE.CREATE_ROOM;
  data: string;
  id: number;
};
