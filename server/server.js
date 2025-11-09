const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRoutes = require('./server/api');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Servir archivos estáticos de Angular
app.use(express.static(path.join(__dirname, 'dist/cloud_movie_proyect/browser')));

// Todas las demás rutas redirigen a Angular
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/cloud_movie_proyect/browser/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});