//import { auth } from 'firebase-admin';
import {firebase, auth} from './firebase.js';
//import {verificarAuth} from './middlewares/auth';
const jwtFirebase = auth();

const verificarAuth = async(req, res, next) => {
      
    //const token = req.get('token')
    console.log(req.header)
    const idToken = req.header('authorization');
    //await authService.verifyIdToken(idToken);
        let decodedIdToken;
    
        try {
            decodedIdToken = await jwtFirebase.verifyIdToken(idToken);
        } catch (error) {
            error.status = 403;
            next(error);
            return;
        }
    
        req.user = decodedIdToken;
        next();
    
  }

  module.exports = {verificarAuth}
