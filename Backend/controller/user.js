const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe sont requis." });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "L'e-mail est invalide !" });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: "Le mot de passe doit contenir au moins 12 caractères, une majuscule, un chiffre et un symbole." });
    }

    bcrypt.hash(password, 10)
        .then(hash => {
            const user = new User({
                email: email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé" }))
                .catch(error => {
                    if (error.name === 'ValidationError') {
                        return res.status(400).json({ error: "Email déjà utilisé." });
                    }
                    res.status(500).json({ error: "Erreur lors de la création de l'utilisateur." });
                });
        })
        .catch(error => res.status(500).json({ error: "Erreur lors du hachage du mot de passe." }));
};

exports.login = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe sont requis." });
    }

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "Paire identifiant/mot de passe incorrecte" });
            }
            bcrypt.compare(password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Paire identifiant/mot de passe incorrecte" });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error: "Erreur lors de la comparaison des mots de passe." }));
        })
        .catch(error => res.status(500).json({ error: "Erreur lors de la recherche de l'utilisateur." }));
};

