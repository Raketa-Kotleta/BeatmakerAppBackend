import express from "express";
import apiRouter from "./api/apiRouter.js";
import bodyParser from "body-parser";
import cors from "cors";
import state from "./store/state.js";
import { yandexStore } from "./store/yandex.js";
import ParamNotLoaded from './errors/ParamNotLoaded.js'
import { Postgres } from './services/pgconnection.js'
const app = express();

function loadEnviromentParam(key){
  if (!process.env[key]) throw new ParamNotLoaded(key);

  return process.env[key]
}

async function loadAppConfig(){
  (await import('dotenv')).config();

  state.APP_PORT = loadEnviromentParam('APP_PORT');
  state.STOKEN = loadEnviromentParam('SECRET_TOKEN');
  state.DATABASE_ADDRESS = loadEnviromentParam('DATABASE_ADDRESS');
  state.DATABASE_PORT = loadEnviromentParam('DATABASE_PORT');
  state.DATABASE_SCHEMA = loadEnviromentParam('DATABASE_SCHEMA');
  state.DATABASE_PASSWORD = loadEnviromentParam('DATABASE_PASSWORD');
  state.DATABASE_USER = loadEnviromentParam('DATABASE_USER');
  state.PROJECT_PATH = loadEnviromentParam('PROJECT_PATH');
  
  yandexStore.SECRET_API_KEY = loadEnviromentParam('YANDEX_SECRET_ACCESS_KEY');
  yandexStore.SECRET_API_KEY_ID = loadEnviromentParam('YANDEX_SECRET_ACCESS_KEY_ID');
  yandexStore.BUCKET_NAME = loadEnviromentParam('BUCKET_NAME');
  yandexStore.YANDEX_DATABASE_PASSWORD = loadEnviromentParam('YANDEX_DATABASE_PASSWORD');
  yandexStore.YANDEX_DATABASE_USER = loadEnviromentParam('YANDEX_DATABASE_USER');
  yandexStore.YANDEX_DATABASE_SCHEMA = loadEnviromentParam('YANDEX_DATABASE_SCHEMA');
  yandexStore.YANDEX_DATABASE_CRT_PATH = loadEnviromentParam('YANDEX_DATABASE_CRT_PATH');
}

async function initModules(){
  app.use(bodyParser.json());
  app.use(cors());
  // app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/api", apiRouter);
  app.use('/static', express.static('public'));
  
  await Postgres.initYandexCloudConnection();
}

async function runApp() {
    try {
      await loadAppConfig();
      await initModules();
      app.listen(state.APP_PORT, () => {
        console.log(`App is listening to port ${state.APP_PORT}`); 
      });
      
      
    } catch (e) {
      console.error(e);
    }
}

runApp();
