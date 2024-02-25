import { user } from "../user.type";

export type game = {
  idGame: string;
  stage: string;
  users: user[];
};
