const express = require('express');
const path = require('path');
const db = require('./database');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
            if (error) {
                console.error("Détail de l'erreur SQL :", error);
                res.send('Erreur serveu');
                return;
            }
            if (results.length > 0) {
                res.redirect('/dashboard.html');
            } else {
                console.log('Pseudo ou mot de passe incorrect !');
                res.redirect('/login.html?error=1');
            }
        });
    } else {
        console.log('Veuillez entrer un pseudo et un mot de passe !');
        res.redirect('/login.html?error=1');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});