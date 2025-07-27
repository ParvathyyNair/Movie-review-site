const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    movieId: String,
    title: String,  
    reviewerName: String,
    rating: Number,
    comment: String,
    userId: mongoose.Schema.Types.ObjectId  
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);

