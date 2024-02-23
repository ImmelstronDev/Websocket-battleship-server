import { COMMAND_TYPE } from "../constants/command-types";

export type regRequest = {
  type: typeof COMMAND_TYPE.REG;
  data: {
    name: string;
    password: string;
  };
  id: number;
};

export type regResponse = {
  type: typeof COMMAND_TYPE.REG;
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
  id: number;
};
