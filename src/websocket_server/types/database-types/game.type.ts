import { user } from "../user.type";

export type game = {
  gameId: string;
  stage: string;
  users: user[];
};
