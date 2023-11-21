const express = require('express');
const cors = require('cors');
const Constants = require('../controllers/constants');
const pjson = require('../package.json');
const path = require('path');
const fetch = require('node-fetch');

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
app.get('/', async function(req, res) {
    try {
        const response = await fetch('https://quotes-api-pi.vercel.app/api/randomimage?language=es');
        const data = await response.json();

        const quoteImage = data.image;
        const quoteText = data.text;

        res.send(`
            <html>
            <head>
                <title>Frases Aleatorias</title>
                <style>
                    /* Agrega tus estilos CSS aquí */
                </style>
            </head>
            <body>
                <h1>Frases Aleatorias</h1>
                <div id="quote-container">
                    <img id="quote-image" src="${quoteImage}" alt="Imagen Aleatoria">
                    <p id="quote-text">${quoteText}</p>
                </div>
                <button id="new-quote-btn">Nueva Frase</button>
        
                <script>
                    const newQuoteButton = document.getElementById('new-quote-btn');
        
                    // Función para obtener una nueva frase aleatoria
                    function getNewQuote() {
                        fetch('https://quotes-api-pi.vercel.app/api/randomimage?language=es')
                            .then(response => response.json())
                            .then(data => {
                                const quoteImage = data.image;
                                const quoteText = data.text;
        
                                document.getElementById('quote-image').src = quoteImage;
                                document.getElementById('quote-text').textContent = quoteText;
                            })
                            .catch(error => {
                                console.error('Error al obtener la frase:', error);
                            });
                    }
        
                    // Llama a la función para mostrar una frase al cargar la página
                    getNewQuote();
        
                    // Agrega un event listener al botón para obtener una nueva frase al hacer clic
                    newQuoteButton.addEventListener('click', getNewQuote);
                </script>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error al obtener la frase:', error);
        res.status(500).send('Error al obtener la frase');
    }
});

console.log('Starting Server ...... ');

app.listen(port, () => {
    console.log('Server ' + pjson.name + ' version ' + pjson.version + ' is running on port ' + port)
});