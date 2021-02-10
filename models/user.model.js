const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        pseudo: { 
            type: String,
            required: true,
            minlength: 3,
            maxlength: 20,
            unique: true,
            trim: true //Pour supprimer les espaces et eviter des err bete
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail], //controller si l'email est correct avec la bibliotheque validator
            lowercase: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            maxlength: 1024,
            minlength: 6
        },
        presentation: {
            type: String,
            maxlength: 1024,
        },
        nom: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 20,
            trim: true,
        },
        prenom: {
            type: String,
            require: true,
            minlength: 2,
            maxlength: 20,
            trim: true,
        },
        age: {
            type: Number,
            require: true,
            validate : Number.isInteger,
            min: 1,
            max: 99,
            trim: true,
        },
        genre: {
            type: String,
            require: true,
            minlength: 5,
            maxlength: 5,
            trim: true,
        },
        followers:{
            type: [String],
        },
        following:{
            type:[String],
        },
        likes:{
            type:[String],
        }
    },
    {
        timestamps: true,
    }
)

//On crypte le mot de passe avec bcrypt
userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//De la meme maniere on crypte le mdp entrer lors d'une connexion pour le comparer avec celui dans la bdd
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('mdp incorrect');
    }
    throw Error('email incorrect');
};

const UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;