import { user } from "../user.type";

export type room = {
  roomId: string;
  roomUsers: user[];
};
