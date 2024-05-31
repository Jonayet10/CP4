const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname)));
app.use(express.json());

const REVIEWS_FILE = './reviews.json';

// Helper function to read reviews from file
async function readReviews() {
  const data = await fs.readFile(REVIEWS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Helper function to write reviews to file
async function writeReviews(reviews) {
  const data = JSON.stringify(reviews, null, 2);
  await fs.writeFile(REVIEWS_FILE, data, 'utf-8');
}

// Endpoint to get all reviews
app.get('/reviews', async (req, res) => {
  try {
    const reviews = await readReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load reviews' });
  }
});

// Endpoint to search reviews by game title
app.get('/reviews/search', async (req, res) => {
  try {
    const { gameTitle } = req.query;
    const reviews = await readReviews();
    const filteredReviews = reviews.filter(review => 
      review.gameTitle.toLowerCase().includes(gameTitle.toLowerCase())
    );
    res.json(filteredReviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search reviews' });
  }
});

// Endpoint to post a new review
app.post('/reviews', async (req, res) => {
  try {
    const newReview = req.body;
    const reviews = await readReviews();
    reviews.push(newReview);
    await writeReviews(reviews);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save review' });
  }
});

// Handle 404
app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
