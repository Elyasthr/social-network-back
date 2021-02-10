//C'est de ce fichier que par tout le Back, autrement dit c'est le fichier cerveau
//On recupere les données "caché"
require('dotenv').config({path: './config/.env'});
require('./config/db');
//Utilisation d'express pour simplifier le code Back-end
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const { checkUser, requireAuth } = require('./middleware/auth.middleware');
const cors = require('cors') //permet de creer des api exploitable a lexterieur

const app = express();
//Precision des droit de requete, ce quon autorise (trouver sur stack overflow),
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}

app.use(cors(corsOptions)); //La partie clien du site seulement est autorisé a utilisé l'api
//Permet de parser les données reçu en request
app.use(bodyParser.json());
//Permet de traiter la data qui va transiter
app.use(bodyParser.urlencoded({extended: true})); //A quoi sa sert pouvoir l'explique
app.use(cookieParser());

//Pour toutes les routes on verifie l'authenticité de notre utilisateur avec son jeton
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req,res)=>{
    res.status(200).send(res.locals.user._id)
});

//routes
app.use('/api/user', userRoutes); //routes qui concerne les utilisateur
app.use('/api/post', postRoutes); //routes qui concerne les post


//Lancement du serveur
app.listen(process.env.PORT,()=>{
    console.log('Ecoute du port ' + process.env.PORT)
})