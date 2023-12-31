import app from "./app";

import { config } from "./config";
const { service, port } = config;

app.listen(port, () => {
  console.log(`${service} is running at http://localhost:${port}`);
});
