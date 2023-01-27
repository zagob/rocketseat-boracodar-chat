import { set, ref, db } from ".";

export function writeUserData(name: string) {
  set(ref(db, "anonymous/123/"), {
    name,
  });
}
