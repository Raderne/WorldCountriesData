const countriesWrapper = document.querySelector(".countries-wrapper");
const searchInput = document.getElementById("search");
const numOfCriteria = document.getElementById("numOfCriteria");

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
          numOfCriteria.parentElement.classList.add("active");
          numOfCriteria.innerText = countriesWrapper.children.length + 1;

          showCountries(country);
        } else if (search === null) {
          numOfCriteria.parentElement.classList.remove("active");
          showCountries(country);
        }
      });
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
