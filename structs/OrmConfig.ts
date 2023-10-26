// ormconfig.ts

import { DatabaseConfig } from "../interfaces/DatabaseConfig";

  let config: DatabaseConfig = require("../databaseConfig.json");
export default {
  type: 'postgres',
  host: config.host,
  port: config.port,
  username: config.user,
  password: config.password,
  database: config.database,
  entities: ["structs/*.ts"],
  synchronize: true,
  logging: false
};
