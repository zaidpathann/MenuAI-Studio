import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const nanoid = customAlphabet(alphabet, 4);

export function generateClientKey() {
  return `MENU-${nanoid()}-${nanoid()}`;
}
