const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const idolRoutes = require('./routes/idols');
const groupRoutes = require('./routes/groups');

const db = require('./models');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/idols', idolRoutes);
app.use('/api/groups', groupRoutes);

app.use(express.static(path.join(__dirname, 'frontend')));
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API de K-pop' });
});

db.sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al sincronizar la base de datos:', err);
    });