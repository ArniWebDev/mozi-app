import { movieList, seatsDetails } from "./db.js";

const movieSelected = document.getElementById("movie");
const seatsContainer = document.querySelector(".cinema-container .seats");
const resetButton = document.querySelector(".price-reset-container .reset");
const counter = document.getElementById("counter");
const price = document.getElementById("price");

let ticketPrice = null;
let allSeats = null;

function updateCounterAndPrice() {
    const selectedSeats = document.querySelectorAll(
        ".seats .available-seat.selected"
    );

    counter.innerText = selectedSeats.length;
    price.innerText = selectedSeats.length * ticketPrice;
}

const updateSelectedSeatsList = () => {
    const selectedSeats = document.querySelectorAll(
        ".seats .available-seat.selected"
    );

    const selectedSeatsIndexes = [...selectedSeats].map(seat =>
        [...allSeats].indexOf(seat)
    );

    localStorage.setItem(
        "selectedSeatsIndexes",
        JSON.stringify(selectedSeatsIndexes)
    );
};

const populateMovieList = () => {
    movieList.movies.forEach(movie => {
        const option = document.createElement("option");
        option.setAttribute("value", movie.price);
        option.innerText = `${movie.title} (${movie.price} ${movieList.currency})`;
        movieSelected.appendChild(option);
    });

    ticketPrice = movieSelected.value;
};

const populateSeats = () => {
    const seatsNumber = seatsDetails.rows * seatsDetails.columns;
    for (let i = 0; i < seatsNumber; i++) {
        const seat = document.createElement("div");
        seat.classList.add("available-seat");
        if (seatsDetails.occupied.includes(i)) {
            seat.classList.add("occupied");
        }
        seatsContainer.appendChild(seat);
    }

    allSeats = document.querySelectorAll(".seats .available-seat");
};

const populateFromLocalStorage = () => {
    const selectedSeatsIndexes = JSON.parse(
        localStorage.getItem("selectedSeatsIndexes")
    );

    if (selectedSeatsIndexes !== null && selectedSeatsIndexes.length > 0) {
        allSeats.forEach((seat, index) => {
            if (selectedSeatsIndexes.indexOf(index) > -1) {
                seat.classList.add("selected");
            }
        });
    }

    const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");

    if (selectedMovieIndex !== null) {
        movieSelected.selectedIndex = selectedMovieIndex;
        ticketPrice = movieSelected.value;
    }

    updateCounterAndPrice();
};

const populateUI = () => {
    populateMovieList();
    populateSeats();

    populateFromLocalStorage();
};

populateUI();

movieSelected.addEventListener("change", e => {
    ticketPrice = e.target.value;
    localStorage.setItem("selectedMovieIndex", movieSelected.selectedIndex);
    updateCounterAndPrice();
});

seatsContainer.addEventListener("click", e => {
    if (
        e.target.classList.contains("available-seat") &&
        !e.target.classList.contains("occupied")
    ) {
        e.target.classList.toggle("selected");
        updateCounterAndPrice();
        updateSelectedSeatsList();
    }
});

resetButton.addEventListener("click", () => {
    document
        .querySelectorAll(".seats .available-seat.selected")
        .forEach(seat => seat.classList.remove("selected"));

    counter.innerText = 0;
    price.innerText = 0;

    movieSelected.selectedIndex = 0;
    ticketPrice = movieSelected.value;

    localStorage.clear();
});
