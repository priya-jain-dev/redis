import express, { Response, Request } from "express";

import { tokenBucketMiddleware } from "./middleware/rate-limiter";

const app = express();

app.get(
  "/token-route",
  tokenBucketMiddleware(),
  (req: Request, res: Response) => {
    return res.send("Request Accepted");
  }
);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
