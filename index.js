/*
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
*/

import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
//const request = require('request-promise');
import request from 'request-promise'


const app = express();

//Middelware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))  //application/x-www-form-urlencoded


// Rutas
app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
  //app.get('/getProducts', cache.route({ expire: { 200: 120 , 503 : 1, xxx: 1}}), function (req, res) {
    app.get('/getnames', function (req, res) {
    if (Math.random() < 0.5) {
      res.status(503).send('Service No disponible');
    } else {
      //request('https://simple.ripley.cl/api/v2/products/?partNumbers=' + cSKU.join(','), { json: true }, (err, res2, body) => {
      request('https://randomuser.me/api/', { json: true }, (err, res2, body) => {
        if (err) { res.status(503).send(err); }
        res.status(200).send(body);
      });
    }
  });

  // Middleware para Vue.js router modo history
  const history = require('connect-history-api-fallback');
  app.use(history());
  app.use(express.static(path.join(__dirname, 'public')));

// Para acceder al directorio actual
app.set('puerto', process.env.PORT || 3000);
app.listen(app.get('puerto'), function () {
  console.log('Example app listening on port '+ app.get('puerto'));
});

