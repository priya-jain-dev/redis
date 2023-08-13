import axios, { AxiosResponse } from "axios";
import redisClient from "./cache";
import UserCache from "./cache/user";

import express, { Request, Response, NextFunction } from "express";

const app = express();
const USERS_API = "https://jsonplaceholder.typicode.com/users/";

app.get("/users", async (req: Request, res: Response) => {
  try {
    let users = await UserCache.fetchAll();
    if (!users) {
      console.info("Users Cache miss");
      const response = await axios.get(`${USERS_API}`);
      if (response && response.data) {
        users = response.data;
        if (users) {
          await UserCache.saveAll(users);
        }
      }
    } else {
      console.info("Users Cache hit");
    }
    res.status(200).send(users);
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    let user = await UserCache.fetchById(parseInt(req.params.id));
    if (!user) {
      console.info("User Cache miss");
      const response = await axios.get(`${USERS_API}/${req.params.id}`);
      if (response && response.data) {
        user = response.data;
        if (user) {
          await UserCache.save(user);
        }
      }
    } else {
      console.info("User Cache hit");
    }
    res.status(200).send(user);
  } catch (err: any) {
    res.status(500).send({ error: err.message });
  }
});
const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
