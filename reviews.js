const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, async (req, res) => {
    const { movieId, title, genre_ids, reviewerName, rating, comment } = req.body;

    try {
        const newReview = new Review({
            movieId,
            title,
            reviewerName,
            rating,
            comment,
            userId: req.user.id
        });

        await newReview.save();
        res.status(201).json({ message: 'Review added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Recommend movies based on highly rated genres
// GET reviews for a movie
router.get('/:movieId', async (req, res) => {
    try {
        const reviews = await Review.find({ movieId: req.params.movieId });
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to load reviews' });
    }
});

const jwt = require('jsonwebtoken');

router.get('/recommend/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        const reviews = await Review.find({ userId: userId, rating: { $gte: 4 } });

        const genreCounts = {};

        reviews.forEach(review => {
            if (Array.isArray(review.genre_ids)) {
                review.genre_ids.forEach(id => {
                    genreCounts[id] = (genreCounts[id] || 0) + 1;
                });
            }
        });

        const recommendedGenres = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([id]) => id);

        res.json({ recommendedGenres });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error." });
    }
});


module.exports = router;
