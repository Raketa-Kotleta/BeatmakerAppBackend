import express from "express";
import apiRouter from "./api/apiRouter.js";
import bodyParser from "body-parser";
import cors from "cors";
import state from "./store/state.js";
import { googleStore } from "./store/google.js";
import ParamNotLoaded from './errors/ParamNotLoaded.js'
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

  googleStore.CLOUD_API_KEY = loadEnviromentParam('GCLOUD_API_KEY');
}

function useModules(){
  app.use(bodyParser.json());
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/api", apiRouter);
  app.use('/static', express.static('public'))
}

async function runApp() {
    try {
      await loadAppConfig();
      useModules();
      app.listen(state.APP_PORT);
    } catch (e) {
      console.error(e);
    }
}

runApp();
