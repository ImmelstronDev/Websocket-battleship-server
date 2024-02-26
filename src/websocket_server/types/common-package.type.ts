import { COMMAND_TYPE } from "../constants/command-types";
import { dataTypeRequest } from "./data-type.type";
import { ValueOf } from "./jeneric.type";

export type commonPackage = {
  type: ValueOf<typeof COMMAND_TYPE>;
  data: string | dataTypeRequest;
  id: number;
};
