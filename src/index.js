import "./database";
import server from "./app";
import path from "path";

const port = 3000;
const host = "localhost";
// console.log(path.join(__dirname+"/migrations/"))
server.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`);
});
