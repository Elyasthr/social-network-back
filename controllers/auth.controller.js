//Ce controleur sert à gerer l'inscription, la connexion et la deconnexion de l'utilisateur
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/error.utils');
const ageToken = 24 * 60 * 60 * 1000;


const createToken = (_id)=>{
    return jwt.sign({_id}, process.env.TOKEN_PASS, {
        expiresIn: ageToken //le jeton expire dans 24h
    })
}

module.exports.signUp = async(req,res) => {
    const {pseudo, nom, prenom, age, genre, email, password} = req.body //rajoutez les elmts du cahier des charges

    try{
        const user = await UserModel.create({pseudo, nom, prenom, age, genre, email, password});
        res.status(201).json({user: user._id});
    }
    catch(err){
        const errors = signUpErrors(err);
        res.status(200).send({errors})
    }
}

module.exports.signIn = async (req, res) =>{
    const {email, password} = req.body
    
    try {
        const user = await UserModel.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: ageToken}); //Le cookie sera consultable que par le server
        res.status(200).json({user : user._id});
    } 
    catch(err){
        const errors = signInErrors(err);
        res.status(200).json({errors})
    }
}

module.exports.logOut = (req, res) =>{
    res.cookie('jwt', '', { maxAge: 1});
    res.redirect('/'); //On redirigera vers la page d'acceuil du site
}