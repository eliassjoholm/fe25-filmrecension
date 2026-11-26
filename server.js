require('dotenv').config();

const express = require('express');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const authenticate = require('./middleware/authenticate');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Stop right away with a clear message instead of failing on the first login
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const app = express();
app.use(express.json({ limit: '10kb' }));

// Request flow: route -> validation -> controller -> model -> MySQL
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/watchlist', authenticate, watchlistRoutes); // every watchlist route needs a login

app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
