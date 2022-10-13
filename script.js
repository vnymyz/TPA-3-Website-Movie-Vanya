// Menggunakan API TMDB
// API key e376e0252a356a4b7a0cbc70ca636f72
// BASE URL https://api.themoviedb.org/3/
// /discover/movie?api_key=your_api_key&sort_by=popularity.desc
// https://image.tmdb.org/t/p/w500/ atau https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg

const API_KEY = 'api_key=e376e0252a356a4b7a0cbc70ca636f72';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500/';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');

let currentpage = 1;
let nextpage = 2;
let prevpage = 3;
let lastUrl = '';
let totalpages = 100;

getMovies(API_URL);

function getMovies(url) {
    lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if (data.results.length !== 0) {
            showMovies(data.results);
            currentpage = data.page;
            nextpage = currentpage + 1;
            prevpage = currentpage - 1;
            totalpages = data.total_pages;

            current.innerText = currentpage;

            if (currentpage <= 1) {
                prev.classList.add('disabled');
                next.classList.remove('disabled')
            } else if (currentpage >= totalpages) {
                prev.classList.remove('disabled');
                next.classList.add('disabled')
            } else {
                prev.classList.remove('disabled');
                next.classList.remove('disabled')
            }
        } else {
            main.innerHTML = `<h1 class="no-results">No Results Found</h1>`
        }
    })
}

function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const { title, poster_path, vote_average, release_date, overview } = movie
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
        <img src="${IMG_URL+poster_path}" alt="${title}">
        <div class="movie-info">
            <div class="container">    
                <h3 class="title">${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="date">
                <h4>Release: ${release_date}</h4>
            </div>
        </div>
        <div class="overview">
            ${overview}
        </div>
        `

        main.appendChild(movieEl);
    })
}

function getColor(vote) {
    if (vote >= 8) {
        return 'green'
    } else if (vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

document.getElementById('logo').addEventListener('click', () => {
    getMovies(API_URL);
})


form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm) {
        getMovies(searchURL + '&query=' + searchTerm)
    } else {
        getMovies(API_URL);
    }
})

prev.addEventListener('click', () => {
    if (prevpage > 0) {
        pageCall(prevpage);
    }
})

next.addEventListener('click', () => {
    if (nextpage <= totalpages) {
        pageCall(nextpage);
    }
})

function pageCall(page) {
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length - 1].split('=');
    if (key[0] != 'page') {
        let url = lastUrl + '&page=' + page
        getMovies(url);
    } else {
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + '?' + b
        getMovies(url);
    }
}