// ormconfig.ts

import { DatabaseConfig } from "../interfaces/DatabaseConfig";

  let databaseConfig: DatabaseConfig = require("../databaseConfig.json");
  let config = require("../config.json");
export default {
  type: 'postgres',
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.database,
  entities: [config.STRUCTS_LOCATION],
  synchronize: true,
  logging: false
};
