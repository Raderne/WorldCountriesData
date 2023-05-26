const numOfCountries = document.getElementById("numOfCountries");
const countriesWrapper = document.querySelector(".countries-wrapper");
const countriesAPI = "https://restcountries.com/v2/all";

function countriesHtml(country) {
  let language = country.languages.map((lan) => {
    return lan.name + " ";
  });
  return `
        <div class="box">
            <img src="${country.flags.png}" alt="flag" id="flag">
            <h3 id="country-name">${country.name}</h3>
            <div class="info">
                <p id="capital">capital: <span>${
                  country.capital !== undefined ? country.capital : ""
                }</span></p>
                <p id="languages">languages: <span>${language}</span></p>
                <p id="population">population: <span>${
                  country.population
                }</span></p>
            </div>
        </div>
    `;
}

function countriesData() {
  fetch(countriesAPI)
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data[8]);
      numOfCountries.innerText = data.length;

      data.forEach((country) => {
        countriesWrapper.innerHTML += countriesHtml(country);
      });
    });
}
countriesData();
