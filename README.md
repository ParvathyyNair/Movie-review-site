# 🎬 MovieHub – Movie Review & Recommendation App

MovieHub is a full-stack web application that allows users to:

- Browse and search for popular movies using the TMDB API
- Add and view reviews for movies
- Receive personalized recommendations in a "Because you liked..." section

---

## 🌟 Features

- 🔐 **User Authentication** (Sign Up & Login)
- 📝 **Add & View Reviews** for each movie
- 🎯 **Personalized Movie Recommendations** based on genres liked by the user
- 🔍 **Search Functionality** for movies
- 🎨 **Responsive UI** with clean styling

---

## 🗂️ Project Structure

project-root/
├── backend/
│ ├── server.js
│ ├── .env
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ └── ...
│
├── frontend/
│ ├── index.html
│ ├── ind.html
│ ├── login.html
│ ├── signup.html
│ ├── scr.js
│ └── style.css

yaml
Copy
Edit

---

## ⚙️ Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
Install dependencies:

bash
Copy
Edit
npm install
Create a .env file in the backend folder with the following content:

env
Copy
Edit
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
Start the server:

bash
Copy
Edit
node server.js


🌐 Frontend Setup
Place your frontend files (index.html, ind.html, login.html, scr.js, etc.) inside the frontend/ folder.

Ensure server.js serves the frontend by adding this at the end:

js
Copy
Edit
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
Visit the app at:

arduino
Copy
Edit
http://localhost:5000
🧠 How Recommendations Work
When a user reviews a movie, they also submit the genre_ids for that movie.

These genres are saved with the review in MongoDB.

When fetching recommendations (/api/reviews/recommend/:userId), the backend identifies the user's most liked genres.

Similar movies from those genres are fetched via the TMDB API.

These are shown under a "Because you liked..." section on the frontend.

🔁 API Endpoints
POST /api/users/register – Register a new user

POST /api/users/login – Log in and get JWT token

POST /api/reviews – Add a movie review

GET /api/reviews/:movieId – Get reviews for a specific movie

GET /api/reviews/recommend/:userId – Get genre-based recommendations

🛠️ Technologies Used
Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express.js

Database: MongoDB (via Mongoose)

Authentication: JWT

External API: The Movie Database (TMDB)

📬 Contact
Feel free to reach out if you have any feedback or feature suggestions.

📌 Future Improvements
 Add user profile pages

 Implement likes/dislikes for reviews

 Improve genre matching algorithm for recommendations

 Add pagination or infinite scroll for movies
