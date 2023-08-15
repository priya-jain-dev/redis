import { getJson, setJson } from "../query";
import { User } from "../../types/user";
import { DynamicKey, Key, getDynamicKey } from "../keys";
import { caching } from "../../config";
import { addMillisToCurrentDate } from "../../helper/utils";

function getKeyForId(userId: number) {
  return getDynamicKey(DynamicKey.USER, userId.toString());
}

function getKeyForAll() {
  return Key.USERS;
}

async function save(user: User) {
  return setJson(
    getKeyForId(user.id),
    { ...user },
    addMillisToCurrentDate(caching.contentCacheDuration)
  );
}

async function fetchById(userId: number) {
  return getJson<User>(getKeyForId(userId));
}

async function fetchAll() {
  return getJson<User[]>(getKeyForAll());
}

async function saveAll(users: User[]) {
  return setJson(
    getKeyForAll(),
    { ...users },
    addMillisToCurrentDate(caching.contentCacheDuration)
  );
}

export default {
  save,
  fetchById,
  fetchAll,
  saveAll,
};
