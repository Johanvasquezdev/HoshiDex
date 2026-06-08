import { app, prepareBackend } from "./app";
import { env } from "./config/env";

prepareBackend()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`HoshiDex Sequelize API running on http://localhost:${env.port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start HoshiDex Sequelize API");
    console.error(error);
    process.exit(1);
  });
