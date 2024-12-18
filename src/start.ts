require('dotenv').config();

import server from "./server";
import { isDevEnv } from "./utils/helper";
import { isProdEnv, logger } from "./utils/logger";


var https = require("https");
const port = parseInt(process.env.PORT || '4000')

const start = async () => {
  const app = await server();

  if (isDevEnv() || isProdEnv()) {

    const servers = https.createServer(
      {
        // key: fs.readFileSync( `${appRoot}/credentials/server.key` ),
        // cert: fs.readFileSync( `${appRoot}/credentials/server.crt` ),
      },
      app);
    servers.listen(port, "0.0.0.0", () => {
      console.log(`
          ################################################
          #  Server listening on port: ${port}           #
          ################################################
        `);

      logger.info(`Starting server at ${new Date()}`);
    });
  } else {
    app.listen(port, "0.0.0.0", () => {
      console.log(`
        ################################################
        #  Server listening on port: ${port}
        ################################################
      `);
      logger.info(`Starting server at ${new Date()}`);

    });

  }
};

start();