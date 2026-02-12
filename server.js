const express = require('express');
const path = require('path');
const db = require('./database');
const app = express();

app.use(express.urlencoded({extended: true}));
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
                res.send('Erreur serveur');
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
app.post('/contact', (req, res) => {
    const {nom, email, sujet, contenu} = req.body;

    if (nom && email && sujet && contenu) {
        db.query('INSERT INTO messages (nom, email, sujet, contenu) VALUES (?, ?, ?, ?)', [nom, email, sujet, contenu], (error, results) => {
            if (error) {
                console.error("Détail de l'erreur SQL :", error);
                return res.send('Erreur serveur');
            }
            if (results.affectedRows > 0) {
                console.log(error + "sent true");
                res.redirect('index.html?sent=true');
            } else {
                console.log(error + "else if error");
                res.redirect('index.html?error=1');
            }
        });
    } else {
        console.log("else error");
        res.redirect('index.html?error=1');
    }
});

app.get('/api/messages', (req, res) => {
    db.query('SELECT * FROM messages ORDER BY date_envoi DESC', (error, results) => {
        if (error) {
            console.error("Erreur lors de la récupération :", error);
            return res.status(500).json({error: "Erreur serveur"});
        }

        res.json(results);
    })
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});