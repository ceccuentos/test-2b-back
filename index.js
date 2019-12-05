import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
//import axios from 'axios';
import request from 'request-promise';

import logger from './utils/logger';
import winston from 'winston';

import { config } from 'dotenv';


const routeApp = express();
config();

//Middelware
//routeApp.use(morgan('tiny'));
logger.debug("Overriding 'Express' logger");
routeApp.use(morgan('combined', { stream: winston.stream.write }));

routeApp.use(cors());
routeApp.use(express.json());
//application/x-www-form-urlencoded
routeApp.use(express.urlencoded({ extended: true }));

//Middleware
import {verificarAuth} from './middlewares/auth';


// Rutas
routeApp.get('/', (req, res) => {
    res.send('Test 2B!');
  });
  
  routeApp.get('/api/getnames', [verificarAuth], async(req, res, next) => {
    if (Math.random() < 0.15) {
      let errorMessage = `Error Code: 500\nMessage: Servicio no disponible`;
      logger.error(`500 - ${errorMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      res.status(503).send('Service No disponible');
    } else {
/*         await axios.get(process.env.URL_API,{
          responseType: 'json'
        })
        .then(response => {
          res.status(200).send(response.data);
        })
        .catch(e => {
          res.status(503).send(e); 
        })
        //return res.data || [];
    } */
      request(process.env.URL_API, { json: true }, (err, res2, body) => {  
        if (err) { res.status(503).send(err); }
        res.status(200).send(body);
      });
    }  


  });



// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback');
routeApp.use(history());
routeApp.use(express.static(path.join(__dirname, 'public')));

// Para acceder al directorio actual
routeApp.set('puerto', process.env.PORT || 3000);
routeApp.listen(routeApp.get('puerto'), function () {
  console.log('Example app listening on port '+ routeApp.get('puerto'));
});