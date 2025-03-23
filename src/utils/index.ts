import { v4 } from "uuid";
export const getUniqueKey = (): string => {
  return v4();
};
