import { SHIP_SIZE } from "../constants/ship-size";

type ValueOf<T> = T[keyof T];

export type ship = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: ValueOf<typeof SHIP_SIZE>;
};
