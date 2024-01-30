const express = require("express");
var bodyParser = require("body-parser");
const app = express();

export function startServer() {
  const PORT = 3000;
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.get("/", (req: any, res: any) => {
    res.send("Hello World!!");
  });
  app.listen(PORT, () => {
    console.log("listen on Port: " + PORT);
  });
}
