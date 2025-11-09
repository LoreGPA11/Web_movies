const express = require('express');
const path = require('path');
const cors = require('cors');
const apiRoutes = require('./api');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API Routes - DEBE IR ANTES de los archivos estáticos
app.use('/api', apiRoutes);

// Servir archivos estáticos de Angular
const distPath = path.join(__dirname, '../dist/cloud_movie_proyect/browser');
console.log('Serving static files from:', distPath);
app.use(express.static(distPath));

// Catch-all route para Angular (CORREGIDO para Express 5)
app.use('/*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📁 Sirviendo desde: ${distPath}`);
});