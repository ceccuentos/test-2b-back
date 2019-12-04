import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
//import axios from 'axios';
import request from 'request-promise';

import { config } from 'dotenv';


const routeApp = express();
config();

//Middelware
routeApp.use(morgan('tiny'));
routeApp.use(cors());
routeApp.use(express.json());
//application/x-www-form-urlencoded
routeApp.use(express.urlencoded({ extended: true }));

//Middleware
import {verificarAuth} from './middlewares/auth';


// Rutas
routeApp.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
  routeApp.get('/api/getnames', [verificarAuth], async(req, res, next) => {
    if (Math.random() < 0.15) {
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