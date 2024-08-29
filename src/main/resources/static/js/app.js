const API_KEY = "***";
const API_URL_POPULAR =
    "***";
const API_URL_SEARCH =
    "***";
const API_URL_MOVIE_DETAILS = "***"

getMovies(API_URL_POPULAR);

async function getMovies(url) {
    const resp = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });
    const respData = await resp.json();
    showMovies(respData);
}

function getClassByRate(vote) {
    if (vote >= 7) {
        return "green";
    } else if (vote > 5) {
        return "orange";
    } else if (vote < 5) {
        return "red";
    } else {
        return "purple"
    }
}

function showMovies(data) {

    const moviesEl = document.querySelector(".movies");

    // Очищаем предыдущие фильмы
    document.querySelector(".movies").innerHTML = "";

    data.films.forEach((movie) => {
        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
        <div class="movie__cover-inner">
        <img
          src="${movie.posterUrlPreview}"
          class="movie__cover"
          alt="${movie.nameRu}"
        />
        <div class="movie__cover--darkened"></div>
      </div>
      <div class="movie__info">
        <div class="movie__title">${movie.nameRu}</div>
        <div class="movie__category">${movie.genres.map(
            (genre) => ` ${genre.genre}`
        )}</div>
        ${
            movie.rating &&
            `
        <div class="movie__average movie__average--${getClassByRate(
                movie.rating
            )}">${movie.rating}</div>
        `
        }
      </div>
        `;
        movieEl.addEventListener("click", () => openModal(movie.filmId));
        moviesEl.appendChild(movieEl);
    });
}

const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
    if (search.value) {
        getMovies(apiSearchUrl);

        search.value = "";
    }
});

// Modal
const modalEl = document.querySelector(".modal");

async function openModal(id) {
    console.log(id);
    const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
        },
    });
    const respData = await resp.json();

    modalEl.classList.add("modal--show");
    document.body.classList.add("stop-scrolling");

    modalEl.innerHTML = `
    <div class="modal__card">
      <img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="">
      <h2>
        <span class="modal__movie-title">${respData.nameRu}</span>
        <span class="modal__movie-release-year"> - ${respData.year}</span>
      </h2>
      <ul class="modal__movie-info">
        <div class="loader"></div>
        <li class="modal__movie-genre">Жанр - ${respData.genres.map((el) => `<span>${el.genre}</span>`)}</li>
        ${respData.filmLength ? `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут</li>` : ''}
        <li >Сайт: <a class="modal__movie-site" href="${respData.webUrl}">${respData.webUrl}</a></li>
        <li class="modal__movie-overview">Описание - ${respData.description}</li>
      </ul>
      <button type="button" class="modal__button-close">Закрыть</button>
      <button href="/player" type="button" class="modal__button-watch" data-movie-id="${respData.filmId}">Смотреть</button>

    </div>
  `;

    const btnClose = document.querySelector(".modal__button-close");
    btnClose.addEventListener("click", () => closeModal());


    const btnWatch = document.querySelector(".modal__button-watch");
    btnWatch.addEventListener("click", () => {
        const movieId = btnWatch.getAttribute("data-movie-id");
        console.log(id);
        // Отправить AJAX-запрос
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "/player/" + id, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Перенаправить на страницу плеера
                window.location.href = "/player/" + id;
            } else if (xhr.status !== 200) {
                console.error("Ошибка при получении данных фильма");
            }
        };
        xhr.send();
    });
}

function closeModal() {
    modalEl.classList.remove("modal--show");
    document.body.classList.remove("stop-scrolling");
}

const movieId = "123";

// отправить AJAX-запрос
$.ajax({
    url: "/player/" + movieId,
    /* type: "GET",
     success: function (response) {
         // перенаправить на страницу /player
         window.location.href = "/player/" + movieId;
     },
     error: function (xhr, status, error) {
         console.error(error);
     }*/
});

window.addEventListener("click", (e) => {
    if (e.target === modalEl) {
        closeModal();
    }
})

window.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
        closeModal();
    }
})