import { v4 as uuidv4 } from "uuid";

export const uniqId = () => uuidv4();

export const compareId = (id1, id2) => String(id1) === String(id2);
