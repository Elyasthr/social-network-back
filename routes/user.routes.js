const router = require('express').Router(); //On appel le router d'express
const multer = require('multer');
const authController = require('../controllers/auth.controller'); //On appel le controleur d'authentification
const userController = require('../controllers/user.controller');

const upload = multer();

//Routes de gestion d'authentification
router.post('/register', authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout',authController.logOut); //On lui retire le token pour quil ne puisse plus s'identifier

//Routes de gestion d'utilisateur
router.get('/', userController.getAllUsers); //Route qui nous enverra les utilisateurs existant dans la base de données
router.get('/:id', userController.userInfo); //Route qui renvoie les données d'un utilisateur
router.put('/:id', userController.updateUser); //Route avec un put qui permet de faire un update
router.delete('/:id', userController.deleteUser); //Route qui permet de supprimer un utilisateur
router.patch('/follow/:id', userController.follow); //Route patch pour majle tableau a linterieur de l'utilisateur
router.patch('/unfollow/:id', userController.unfollow);



module.exports = router;