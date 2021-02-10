module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', nom: '', prenom: '', age: '', genre: '', email: '', password: ''}

    //On teste tout les cas de figure d'erreur pour retourner un msg clair et precis a l'utilisateur 

    if(err.message.includes('pseudo'))
        errors.pseudo = "Pseudo incorrect";

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo') )
        errors.email = 'Ce pseudo est déjà pris';

    if(err.message.includes('email'))
        errors.email = "Email incorrect";
    
    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes('email') )
        errors.email = 'Cet email est déjà pris';

    if(err.message.includes('password'))
        errors.password = "Le mot de passe doit faire au moin 6 carracteres";
    
    if(err.message.includes('nom'))
        errors.nom = "Le nom doit faire au moin 2 carracteres";
    
    if(err.message.includes('prenom'))
        errors.prenom = "Le prenom doit faire au moin 2 carracteres";
    
    if(err.message.includes('age'))
        errors.age = "Veuillez entrer un age valide";
    
    if(err.message.includes('genre'))
        errors.genre = "Veuillez selectionner Homme ou Femme";

    return errors
}

module.exports.signInErrors = (err) => {
    let errors = { email: '', password: '' }
    
    if(err.message.includes('email'))
        errors.email = "Email inconnu";

    if(err.message.includes('mdp'))
        errors.password = "Le mot de passe est incorrect";

    return errors
}

module.exports.uploadErrors = (err) => {
    let errors = {format: '', size: ''};

    if(err.message.includes('Format invalid'))
        errors.format = "Format invalid";

    if(err.message.includes('Fichier trop lourd'))
        errors.size = "Fichier trop lourd";

    return errors
}

