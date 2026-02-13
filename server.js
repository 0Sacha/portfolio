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

app.get('/api/messages/:id', (req, res) => {
    const messageId = req.params.id;
    const sql = "SELECT * FROM messages WHERE id = ?";

    db.query(sql, [messageId], (err, result) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).json({ error: "Erreur serveur" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Message introuvable" });
        }
        res.json(result[0]);
    });
});

app.patch('/api/messages/:id', (req, res) => {
    console.log("Requête reçue pour l'ID :", req.params.id);
    console.log("Corps de la requête :", req.body);

    const messageId = req.params.id;

    // On exécute la mise à jour
    db.query("UPDATE messages SET is_new = 0 WHERE id = ?", [messageId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erreur lors de la mise à jour" });
        }

        res.json({ message: "Statut mis à jour avec succès" });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});