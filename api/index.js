const express = require('express');
const cors = require('cors');
const Constants = require('../controllers/constants');
const pjson = require('../package.json');
const path = require('path');

// App definition
const app = express();

// To read body correctly 
app.use(express.json());

// Access Permission between client and server
app.use(cors());

const port = process.env.PORT || Constants.DEFAULT_PORT;

app.get('/api', (req, res) => {
    res.send('Server ' + pjson.name + ' version ' + pjson.version + ' is running on port ' + port);
});

// Ruta para servir el archivo index.html
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../index.html'));
});

console.log('Starting Server ...... ');

app.listen(port, () => {
    console.log('Server ' + pjson.name + ' version ' + pjson.version + ' is running on port ' + port)
});