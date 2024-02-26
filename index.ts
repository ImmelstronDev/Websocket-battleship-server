import { Wss } from "./src/websocket_server";
import { httpServer } from "./src/http_server/index";

const HTTP_PORT = process.env.HTTP_PORT || 8181;
const WS_PORT = Number(process.env.WS_PORT) || 3000;

httpServer.listen(HTTP_PORT);
console.log(`Start static http server on the ${HTTP_PORT} port!`);
new Wss(WS_PORT);
console.log(`Start websocket server on the ${WS_PORT} port!`);
// wss.on("connection", function connection(ws) {
//   ws.on("error", console.error);

//   ws.on("message", function message(data) {
//     console.log("reserved: %s", data);
//     if (data) {
//       const respnseData = {
//         type: "reg",
//         data: JSON.stringify({
//           name: "userName",
//           index: 1,
//           error: false,
//           errorText: "no error",
//         }),
//         id: 0,
//       };
//       ws.send(JSON.stringify(respnseData));
//     }
//   });
// });
