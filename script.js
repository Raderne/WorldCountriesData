const countriesWrapper = document.querySelector(".countries-wrapper");
const searchInput = document.getElementById("search");
const numOfCriteria = document.getElementById("numOfCriteria");
const orderButtons = document.querySelectorAll(".order-btns button");

const countriesAPI =
  "https://restcountries.com/v2/all?fields=name,flags,capital,languages,population";

let userInput = "";

function showCountries(country) {
  let language = country.languages.map((lan) => lan.name + " ");

  let box = document.createElement("div");
  box.classList.add("box");

  box.innerHTML = `
            <img src="${country.flags.png}" alt="flag" id="flag">
            <h3 id="country-name">${country.name}</h3>
            <div class="info">
                <p id="capital"><span>${
                  country.capital !== undefined
                    ? "capital: " + country.capital
                    : ""
                }</span></p>
                <p id="languages">languages: <span>${language}</span></p>
                <p id="population">population: <span>${
                  country.population
                }</span></p>
            </div>
    `;

  countriesWrapper.appendChild(box);
}

getCountriesData(countriesAPI, null);

function getCountriesData(countriesApi, search) {
  countriesWrapper.innerHTML = "";
  fetch(countriesApi)
    .then((resp) => resp.json())
    .then((data) => {
      data.forEach((country) => {
        let language = "";
        country.languages.map((lan) => {
          language += lan.name + ", ";
        });
        if (
          (country.capital != null && country.capital.match(search)) ||
          language.match(search)
        ) {
          showCountries(country);
          numOfCriteria.parentElement.classList.add("active");
        } else if (search === null) {
          numOfCriteria.parentElement.classList.remove("active");
          showCountries(country);
        }
      });
      numOfCriteria.textContent = countriesWrapper.childElementCount;
    })
    .catch((err) => {
      countriesWrapper.innerHTML = "Can't connect to the data";
    });
}

searchInput.addEventListener("input", (e) => {
  e.preventDefault();

  userInput = e.target.value;
  let searchTarget = new RegExp(userInput, "gi");

  if (userInput && userInput !== "") {
    getCountriesData(countriesAPI, searchTarget);
  } else {
    window.location.reload();
  }
});

function removeArrows() {
  orderButtons.forEach((btn) => {
    btn.classList.remove("showArrow");
  });
}

let rotate = 0;
orderButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    removeArrows();

    const arrow = btn.querySelector("span");
    btn.classList.add("showArrow");
    if (btn.classList.contains("showArrow")) {
      arrow.style.transform = `rotate(${rotate}deg)`;
      rotate += 180;
    }
  });
});
