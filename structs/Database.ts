import { Pool } from 'pg';
import {DatabaseConfig} from "../interfaces/DatabaseConfig";

let config = fetchConfig()
export const database = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.port,
});

function fetchConfig(){
  let config: DatabaseConfig = require("../databaseConfig.json")
  return config
}