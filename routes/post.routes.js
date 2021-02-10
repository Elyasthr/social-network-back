const router = require('express').Router();
const postController = require('../controllers/post.controller');

//Routes principales qui permettront de lire, ecrire, modifier et supprimer des post
router.get('/', postController.readPost);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

//Je creer 2 routes qui permetteron de liker ou non un contenu avec patch pour intervenir sur le array de likes/likers
router.patch('/like/:id', postController.likePost);
router.patch('/unlike/:id', postController.unLikePost);

//Routes des commentaire
router.patch('/comment/:id', postController.commentPost);
router.patch('/edit-comment/:id', postController.editCommentPost);
router.patch('/delete-comment/:id', postController.deleteCommentPost);

module.exports = router;