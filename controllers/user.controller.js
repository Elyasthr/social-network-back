const UserModel = require('../models/user.model');
//Permet de controller si les ID son reconnu par la bdd
const ObjectID = require('mongoose').Types.ObjectId;


module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = (req, res) => {
    //On verifie que l'ID existe dans la base de données
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id inconnu : ' + req.params.id)
    //Si l'ID existe afficher les infos de l'utilisateur exepté le mdp meme si il est crypté
    UserModel.findById(req.params.id, (err, data) => {
        if (!err) res.send(data);
        else console.log('Id inconnu : ' + err);
    }).select('-password'); //select(-xxxx) sert a filtrer les infos transmise
}

module.exports.updateUser = async (req, res) => {
    //On verifie que l'ID existe dans la base de données
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id inconnu : ' + req.params.id)

    try {
        await UserModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    presentation: req.body.presentation
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, data) => {
                if (!err) return res.send(data);
                if (err) return res.status(500).send({ message: err });
            }
        )
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
}

module.exports.deleteUser = async (req, res) => {
    //On verifie que l'ID existe dans la base de données
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id inconnu : ' + req.params.id)

    try {
        await UserModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: "Utilisateur correctement supprimer" });
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
}

module.exports.follow = async (req, res) => {
    //On verifie que l'ID existe dans la base de données
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
        return res.status(400).send('Id inconnu : ' + req.params.id)

    try {
        //on rajouter l'utilisateur quon veut suivre  a la liste de lutilisateur qui a cliqué
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow } },
            { new: true, upsert: true },
            (err, data) => {
                if (!err) res.status(201).json(data);
                else return res.status(400).json(err);
            }
        )
        //inverse du haut
        await UserModel.findByIdAndUpdate(
            req.body.idToFollow, //ici on utilise body plutot que params car on recupere les données de celui qui fait l'action
            { $addToSet: { followers: req.params.id } },
            { new: true, upsert: true },
            (err, data) => {
                if (err) return res.status(400).json(err);
            }
        )
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
}

module.exports.unfollow = async (req, res) => {
    //On verifie que l'ID existe dans la base de données
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow))
        return res.status(400).send('Id inconnu : ' + req.params.id)

    try {
        //on rajouter l'utilisateur quon veut suivre  a la liste de lutilisateur qui a cliqué
        await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnfollow } },
            { new: true, upsert: true },
            (err, data) => {
                if (!err) res.status(201).json(data);
                else return res.status(400).json(err);
            }
        )
        //inverse du haut
        await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow, //ici on utilise body plutot que params car on recupere les données de celui qui fait l'action
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true },
            (err, data) => {
                if (err) return res.status(400).json(err);
            }
        )
    }
    catch (err) {
        return res.status(500).json({ message: err });
    }
}