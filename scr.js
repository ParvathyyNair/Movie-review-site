const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=bc5cc3c51a8d6dece0a6e64c4f6eadc8&page=1';

const SEARCHAPI = 'https://api.themoviedb.org/3/search/movie?&api_key=bc5cc3c51a8d6dece0a6e64c4f6eadc8&query=';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const USERS_URL = 'http://localhost:5000/api/users';

const reviewModal = document.getElementById('reviewModal');
const viewReviewsModal = document.getElementById('viewReviewsModal');

const main = document.getElementById('section');
const form = document.getElementById('form');
const query = document.getElementById('query');

const signupModal = document.getElementById('signupModal');
const loginModal = document.getElementById('loginModal');
const signupError = document.getElementById('signupError');
const loginError = document.getElementById('loginError');

window.onload = () => {
    returnMovies(APILINK);
    checkAuth();
    loadRecommendations();

    document.getElementById('closeSignupModal').onclick = closeSignupModal;
    document.getElementById('closeLoginModal').onclick = closeLoginModal;
    document.getElementById('signupBtn').onclick = signup;
    document.getElementById('loginBtn').onclick = login;

    document.getElementById('closeReviewModal').onclick = () => reviewModal.style.display = 'none';
    document.getElementById('closeViewReviewsModal').onclick = () => viewReviewsModal.style.display = 'none';
    document.getElementById('submitReviewBtn').onclick = submitReview;
};
document.querySelectorAll('#starRating span').forEach(star => {
    star.addEventListener('click', () => {
        const rating = star.getAttribute('data-star');
        document.getElementById('reviewRating').value = rating;

        document.querySelectorAll('#starRating span').forEach(s => {
            s.classList.remove('selected');
        });

        star.classList.add('selected');
        let prev = star.previousElementSibling;
        while (prev) {
            prev.classList.add('selected');
            prev = prev.previousElementSibling;
        }
    });

    star.addEventListener('mouseover', () => {
        document.querySelectorAll('#starRating span').forEach(s => {
            s.classList.remove('hover');
        });
        star.classList.add('hover');
        let prev = star.previousElementSibling;
        while (prev) {
            prev.classList.add('hover');
            prev = prev.previousElementSibling;
        }
    });

    star.addEventListener('mouseout', () => {
        document.querySelectorAll('#starRating span').forEach(s => {
            s.classList.remove('hover');
        });
    });
});

function returnMovies(url) {
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; // show spinner
    main.innerHTML = '';

    fetch(url)
        .then(res => res.json())
        .then(data => {
            loader.style.display = 'none'; // hide spinner
            main.innerHTML = '';
            if (data.results.length === 0) {
                main.innerHTML = '<h2 style="text-align:center;">No results found</h2>';
                return;
            }

            data.results.forEach(element => {
                const div_card = document.createElement('div');
                div_card.setAttribute('class', 'card');

                const image = document.createElement('img');
                image.setAttribute('class', 'thumbnail');
                image.src = element.poster_path
                    ? IMG_PATH + element.poster_path
                    : 'https://via.placeholder.com/300x450?text=No+Image';

                const title = document.createElement('h3');
                title.textContent = element.title;

                const addReviewBtn = document.createElement('button');
                addReviewBtn.textContent = 'Add Review';
                addReviewBtn.onclick = () => openReviewModal(element.id, element.title);

                const showReviewsBtn = document.createElement('button');
                showReviewsBtn.textContent = 'Show Reviews';
                showReviewsBtn.onclick = () => showReviews(element.id, element.title);

                div_card.appendChild(image);
                div_card.appendChild(title);
                div_card.appendChild(addReviewBtn);
                div_card.appendChild(showReviewsBtn);

                main.appendChild(div_card);
            });
        })
        .catch(err => {
            console.error('Error fetching movies:', err);
            loader.style.display = 'none';
            main.innerHTML = '<h2 style="text-align:center;">Failed to load movies. Please try again.</h2>';
        });
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchItem = query.value.trim();
    if (searchItem) {
        returnMovies(SEARCHAPI + encodeURIComponent(searchItem));
        query.value = '';
    }
});

function openSignupModal() {
    signupError.textContent = '';
    signupModal.style.display = 'block';
}
function closeSignupModal() {
    signupModal.style.display = 'none';
}
function openLoginModal() {
    loginError.textContent = '';
    loginModal.style.display = 'block';
}
function closeLoginModal() {
    loginModal.style.display = 'none';
}

function signup() {
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    if (!username || !email || !password) return showSignupError('All fields are required.');

    fetch(`${USERS_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    })
        .then(async res => {
            const data = await res.json();
            if (!res.ok) return showSignupError(data.message || 'Registration failed.');
            alert('Registration successful! Please login.');
            closeSignupModal();
        })
        .catch(() => showSignupError('Registration failed. Please try again.'));
}

function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (!email || !password) return showLoginError('All fields are required.');

    fetch(`${USERS_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(async res => {
            const data = await res.json();
            if (res.status !== 200) return showLoginError(data.message || 'Login failed.');
            localStorage.setItem('token', data.token);
            alert(`Welcome, ${data.username}`);
            closeLoginModal();
            checkAuth();
        })
        .catch(() => showLoginError('Login failed. Please try again.'));
}

function showSignupError(txt) {
    signupError.textContent = txt;
}
function showLoginError(txt) {
    loginError.textContent = txt;
}

function logout() {
    localStorage.removeItem('token');
    alert('Logged out.');
    checkAuth();
}

function checkAuth() {
    const token = localStorage.getItem('token');
    document.getElementById('authButtons').style.display = token ? 'none' : 'block';
    document.getElementById('logoutButton').style.display = token ? 'block' : 'none';
}

let currentMovieId = null;

function openReviewModal(movieId, movieTitle) {
    currentMovieId = movieId;
    document.getElementById('reviewMovieTitle').textContent = movieTitle;
    reviewModal.style.display = 'block';
}

function submitReview() {
    const reviewerName = document.getElementById('reviewerName').value.trim();
    const rating = document.getElementById('reviewRating').value;
    const comment = document.getElementById('reviewComment').value.trim();
    const token = localStorage.getItem('token');

    if (!reviewerName || !rating || !comment) {
        alert('All fields are required.');
        return;
    }

    if (!token) {
        alert('You must be logged in to submit a review.');
        return;
    }

    fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movieId: currentMovieId, reviewerName, rating, comment })
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message || 'Review submitted successfully.');
            reviewModal.style.display = 'none';
            document.getElementById('reviewerName').value = '';
            document.getElementById('reviewRating').value = '';
            document.getElementById('reviewComment').value = '';
        })
        .catch(err => {
            console.error(err);
            alert('Failed to submit review.');
        });
}

function showReviews(movieId, movieTitle) {
    document.getElementById('viewMovieTitle').textContent = movieTitle;
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = 'Loading...';

    fetch(`http://localhost:5000/api/reviews/${movieId}`)
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(data => {
            reviewsList.innerHTML = '';
            if (!Array.isArray(data) || data.length === 0) {
                reviewsList.innerHTML = '<p>No reviews yet.</p>';
                return;
            }

            data.forEach(review => {
                const reviewDiv = document.createElement('div');
                reviewDiv.classList.add('review-item');
                reviewDiv.innerHTML = `
                    <strong>${review.reviewerName}</strong> rated it <strong>${review.rating}/5</strong><br>
                    <p>${review.comment}</p>
                    <hr>
                `;
                reviewsList.appendChild(reviewDiv);
            });
        })
        .catch(err => {
            console.error('Failed to load reviews:', err);
            reviewsList.innerHTML = '<p>Failed to load reviews.</p>';
        });

    viewReviewsModal.style.display = 'block';
}
function loadRecommendations() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const userId = parseJwt(token).id;

    fetch(`http://localhost:5000/api/reviews/recommend/${userId}`)
        .then(res => res.json())
        .then(data => {
            const genres = data.recommendedGenres;
            if (!genres || genres.length === 0) return;

            const genreQuery = genres.map(id => `with_genres=${id}`).join('&');
            const recURL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=bc5cc3c51a8d6dece0a6e64c4f6eadc8&${genreQuery}`;

            fetch(recURL)
                .then(res => res.json())
                .then(data => {
                    const container = document.getElementById('recommendationContainer');
                    const section = document.getElementById('recommendationSection');
                    container.innerHTML = '';
                    section.style.display = 'block';

                    data.results.forEach(movie => {
                        const div_card = document.createElement('div');
                        div_card.className = 'card';

                        const image = document.createElement('img');
                        image.className = 'thumbnail';
                        image.src = movie.poster_path
                            ? IMG_PATH + movie.poster_path
                            : 'https://via.placeholder.com/300x450?text=No+Image';

                        const title = document.createElement('h4');
                        title.textContent = movie.title;

                        const addReviewBtn = document.createElement('button');
                        addReviewBtn.textContent = 'Add Review';
                        addReviewBtn.onclick = () => openReviewModal(movie.id, movie.title);

                        const showReviewsBtn = document.createElement('button');
                        showReviewsBtn.textContent = 'Show Reviews';
                        showReviewsBtn.onclick = () => showReviews(movie.id, movie.title);

                        div_card.appendChild(image);
                        div_card.appendChild(title);
                        div_card.appendChild(addReviewBtn);
                        div_card.appendChild(showReviewsBtn);

                        container.appendChild(div_card);
                    });
                });
        })
        .catch(err => console.error('Failed to load recommendations:', err));
}
function renderRecommendationSection(movies) {
    const section = document.createElement('section');
    section.innerHTML = `<h2 style="padding-left: 20px;">Because you liked...</h2>`;

    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'horizontal-scroll';

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'rec-card';

        const img = document.createElement('img');
        img.src = movie.poster_path
            ? IMG_PATH + movie.poster_path
            : 'https://via.placeholder.com/300x450?text=No+Image';

        const title = document.createElement('p');
        title.textContent = movie.title;
        title.style.textAlign = 'center';

        card.appendChild(img);
        card.appendChild(title);
        scrollContainer.appendChild(card);
    });

    section.appendChild(scrollContainer);
    main.prepend(section); // add before normal movies
}


function parseJwt(token) {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
}

