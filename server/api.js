const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// Configuración de PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Crear tabla movies si no existe
const initDB = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS movies (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      director VARCHAR(255) NOT NULL,
      year INTEGER NOT NULL,
      genre VARCHAR(100) NOT NULL,
      duration INTEGER NOT NULL,
      rating DECIMAL(3,1) NOT NULL,
      poster TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    await pool.query(createTableQuery);
    console.log('✅ Tabla movies verificada/creada');
    
    // Verificar si hay datos
    const countResult = await pool.query('SELECT COUNT(*) FROM movies');
    const count = parseInt(countResult.rows[0].count);
    
    if (count === 0) {
      console.log('⚙️ Insertando datos iniciales...');
      await insertInitialMovies();
    } else {
      console.log(`📊 Base de datos ya tiene ${count} películas`);
    }
  } catch (err) {
    console.error('❌ Error al inicializar base de datos:', err);
  }
};

// Insertar películas iniciales
const insertInitialMovies = async () => {
  const movies = [
    ['El Padrino', 'Francis Ford Coppola', 1972, 'Drama', 175, 9.2, 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 'La historia de una familia mafiosa en Nueva York.'],
    ['Inception', 'Christopher Nolan', 2010, 'Ciencia Ficción', 148, 8.8, 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg', 'Un ladrón que roba secretos corporativos a través de los sueños.'],
    ['Pulp Fiction', 'Quentin Tarantino', 1994, 'Crimen', 154, 8.9, 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 'Historias entrelazadas del mundo criminal de Los Ángeles.'],
    ['El Caballero de la Noche', 'Christopher Nolan', 2008, 'Acción', 152, 9.0, 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 'Batman enfrenta al Joker en una batalla por el alma de Gotham.'],
    ['Forrest Gump', 'Robert Zemeckis', 1994, 'Drama', 142, 8.8, 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', 'La vida extraordinaria de un hombre con un corazón puro.'],
    ['Matrix', 'Lana y Lilly Wachowski', 1999, 'Ciencia Ficción', 136, 8.7, 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', 'Un hacker descubre la verdad sobre su realidad.'],
    ['El Señor de los Anillos: El Retorno del Rey', 'Peter Jackson', 2003, 'Fantasía', 201, 9.0, 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg', 'La batalla final por la Tierra Media.'],
    ['Interstellar', 'Christopher Nolan', 2014, 'Ciencia Ficción', 169, 8.6, 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 'Un grupo de exploradores viaja a través de un agujero de gusano.'],
    ['Gladiador', 'Ridley Scott', 2000, 'Acción', 155, 8.5, 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg', 'Un general romano busca venganza.'],
    ['Titanic', 'James Cameron', 1997, 'Romance', 194, 7.9, 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg', 'Una historia de amor épica en el Titanic.'],
    ['Avatar', 'James Cameron', 2009, 'Ciencia Ficción', 162, 7.8, 'https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg', 'Un marine es enviado a Pandora.'],
    ['El Silencio de los Inocentes', 'Jonathan Demme', 1991, 'Thriller', 118, 8.6, 'https://image.tmdb.org/t/p/w500/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg', 'Una agente del FBI busca ayuda de un asesino.'],
    ['La Lista de Schindler', 'Steven Spielberg', 1993, 'Drama', 195, 9.0, 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg', 'Oskar Schindler salvó a más de mil judíos.'],
    ['Fight Club', 'David Fincher', 1999, 'Drama', 139, 8.8, 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', 'Un oficinista forma un club de pelea clandestino.'],
    ['Star Wars: El Imperio Contraataca', 'Irvin Kershner', 1980, 'Ciencia Ficción', 124, 8.7, 'https://image.tmdb.org/t/p/w500/2l05cFWJacyIsTpsqSgH0wQXe4V.jpg', 'Los rebeldes luchan contra el Imperio.'],
    ['Jurassic Park', 'Steven Spielberg', 1993, 'Aventura', 127, 8.2, 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg', 'Un parque de dinosaurios se convierte en pesadilla.'],
    ['El Rey León', 'Roger Allers, Rob Minkoff', 1994, 'Animación', 88, 8.5, 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', 'Un joven león debe reclamar su lugar como rey.'],
    ['Volver al Futuro', 'Robert Zemeckis', 1985, 'Ciencia Ficción', 116, 8.5, 'https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg', 'Un adolescente viaja 30 años al pasado.'],
    ['Los Vengadores', 'Joss Whedon', 2012, 'Acción', 143, 8.0, 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg', 'Los héroes más poderosos se unen.'],
    ['Toy Story', 'John Lasseter', 1995, 'Animación', 81, 8.3, 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg', 'Los juguetes cobran vida.'],
    ['El Pianista', 'Roman Polanski', 2002, 'Drama', 150, 8.5, 'https://image.tmdb.org/t/p/w500/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg', 'Un pianista lucha por sobrevivir durante el Holocausto.'],
    ['El Resplandor', 'Stanley Kubrick', 1980, 'Terror', 146, 8.4, 'https://image.tmdb.org/t/p/w500/xazWoLealQwEgqZ89MLZklLZD3k.jpg', 'Un escritor cuida un hotel aislado durante el invierno.'],
    ['Parásitos', 'Bong Joon-ho', 2019, 'Thriller', 132, 8.5, 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', 'Una familia pobre se infiltra en la vida de una familia rica.'],
    ['Coco', 'Lee Unkrich', 2017, 'Animación', 105, 8.4, 'https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg', 'Un niño descubre el misterio detrás de su familia.']
  ];

  const query = `
    INSERT INTO movies (title, director, year, genre, duration, rating, poster, description)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;

  for (const movie of movies) {
    try {
      await pool.query(query, movie);
    } catch (err) {
      console.error('Error al insertar película:', err);
    }
  }
  console.log('✅ 24 películas insertadas correctamente');
};

// Inicializar BD al cargar el módulo
initDB();

// **RUTAS API**

// GET - Obtener todas las películas
router.get('/movies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error GET /movies:', err);
    res.status(500).json({ error: 'Error al obtener películas' });
  }
});

// GET - Obtener una película por ID
router.get('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error GET /movies/:id:', err);
    res.status(500).json({ error: 'Error al obtener película' });
  }
});

// POST - Crear nueva película
router.post('/movies', async (req, res) => {
  try {
    const { title, director, year, genre, duration, rating, poster, description } = req.body;
    
    const result = await pool.query(
      `INSERT INTO movies (title, director, year, genre, duration, rating, poster, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, director, year, genre, duration, rating, poster, description]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error POST /movies:', err);
    res.status(500).json({ error: 'Error al crear película' });
  }
});

// PUT - Actualizar película
router.put('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, director, year, genre, duration, rating, poster, description } = req.body;
    
    const result = await pool.query(
      `UPDATE movies 
       SET title=$1, director=$2, year=$3, genre=$4, duration=$5, rating=$6, poster=$7, description=$8
       WHERE id=$9 RETURNING *`,
      [title, director, year, genre, duration, rating, poster, description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error PUT /movies/:id:', err);
    res.status(500).json({ error: 'Error al actualizar película' });
  }
});

// DELETE - Eliminar película
router.delete('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM movies WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }
    
    res.json({ message: 'Película eliminada correctamente', movie: result.rows[0] });
  } catch (err) {
    console.error('Error DELETE /movies/:id:', err);
    res.status(500).json({ error: 'Error al eliminar película' });
  }
});

module.exports = router;