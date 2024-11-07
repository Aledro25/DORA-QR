const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const app = express();
const port = 3000;

// Connetti al database (MongoDB)
mongoose.connect('mongodb://localhost/urlshortener', { useNewUrlParser: true, useUnifiedTopology: true });

// Definisci lo schema per il modello URL
const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortenedUrl: String
});

const Url = mongoose.model('Url', urlSchema);

// Middleware per interpretare il corpo della richiesta
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint per accorciare l'URL
app.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  
  // Crea una stringa accorciata
  const shortened = crypto.randomBytes(6).toString('hex'); // Crea un "slug" unico
  
  const newUrl = new Url({
    originalUrl,
    shortenedUrl: shortened
  });
  
  await newUrl.save();
  
  res.json({ shortenedUrl: `http://localhost:${port}/${shortened}` });
});

// Endpoint per il reindirizzamento
app.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  
  const url = await Url.findOne({ shortenedUrl: slug });
  
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
