import server from "./app";
import "./database";
import path from "path";

const port = process.env.PORT || 3000;
const host = "localhost";
// console.log(path.join(__dirname+"/migrations/"))
server.listen(port, () => {
  console.log(`server listening on port http://localhost:${port}`);
});
