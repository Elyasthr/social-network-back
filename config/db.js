const mongoose = require('mongoose');

mongoose
    .connect(
        'mongodb+srv://' + process.env.DB_USER_PASS + '@cluster0.emzi2.mongodb.net/social-project',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    )
    .then(() => console.log('Connexion à la base de donnée etablie'))
    .catch((err) => console.log('Erreur lors de la connexion à la base de donnée', err));