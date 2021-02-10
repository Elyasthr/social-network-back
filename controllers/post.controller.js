const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.readPost = (req, res) => {
    PostModel.find((err, data) => {
        if (!err) res.send(data);
        else console.log('erreur ' + err);
    }).sort({ createdAt: -1 });//permet d'afficher les post dans l'ordre du plus recent
}

module.exports.createPost = async (req, res) => {
    //On verifie que l'ID de la personne qui publie existe dans la base de données
    // if (!ObjectID.isValid(req.body.posterId))
    //     return res.status(400).send('Id inconnu : ' + req.body.posterId)

    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        likers: [],
        comments: []
    })

    try {
        const post = await newPost.save();
        return res.status(201).json(post);

    }
    catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.updatePost = (req, res) => {
    //On verifie que l'ID existe dans la base de données
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id inconnu : ' + req.params.id)

    const updateMessage = {
        message: req.body.message
    }

    PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: updateMessage },
        { new: true },
        (err, data) => {
            if (!err) res.send(data);
            else console.log('Erreur lors de la modification: ' + err);
        }
    )

}

module.exports.deletePost = (req, res) => {
    //On verifie que l'ID existe dans la base de données
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id inconnu : ' + req.params.id)

    PostModel.findByIdAndRemove(
        req.params.id,
        (err, data) => {
            if (!err) res.send(data);
            else console.log('Impossible de supprimer : ' + err);
        }
    )
}

module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id inconnu : ' + req.params.id)

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likers: req.body.id }
            },
            { new: true },
            (err, data) => {
                if (err) return res.status(400).send(err);
            }
        );
        await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $addToSet: { likes: req.params.id }
            },
            { new: true },
            (err, data) => {
                if (!err) return res.send(data);
                else return res.status(400).send(err);
            }
        )
    }
    catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.unLikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id inconnu : ' + req.params.id)

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likers: req.body.id }
            },
            { new: true },
            (err, data) => {
                if (err) return res.status(400).send(err);
            }
        );
        //console.log(req.body.id);
        await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $pull: { likes: req.params.id }
            },
            { new: true },
            (err, data) => {
                if (!err) return res.send(data);
                else return res.status(400).send(err);
            }
        )
    }
    catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.commentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id inconnu : ' + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        message: req.body.message,
                        timestamp: new Date().getTime()
                    }
                }
            },
            { new: true },
            (err, data) => {
                if (!err) return res.send(data);
                else return res.status(400).send(err);
            }
        )
    }
    catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id inconnu : ' + req.params.id)

    try {
        return PostModel.findById(
            req.params.id,
            (err, data) => {
                //on pointe sur le commentaire voulu en les parcourant
                const comment = data.comments.find((comment) =>
                    comment._id.equals(req.body.commentId) //quand je met les crochet sa ne fonctionne pas je comprend pas pk 
                )

                if (!comment) return res.status(404).send('Le commentaire n\'a pas ete trouvé');

                comment.message = req.body.message;


                return data.save((err) => {
                    if (!err) return res.status(200).send(data);
                    return res.status(500).send(err);
                })
            }
        )
    } catch (err) {
        return res.status(400).send(err);
    }

}

module.exports.deleteCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id inconnu : ' + req.params.id)

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId,
                    }
                }
            },
            { new: true },
            (err, data) => {
                if (!err) return res.send(data);
                else return res.status(400).send(err)
            }
        )
    }
    catch (err) {
        return res.status(400).send(err);
    }

}