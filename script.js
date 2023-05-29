const countriesWrapper = document.querySelector(".countries-wrapper");
const searchInput = document.getElementById("search");
const numOfCriteria = document.getElementById("numOfCriteria");
const orderButtons = document.querySelectorAll(".order-btns button");

const countriesAPI =
  "https://restcountries.com/v2/all?fields=name,flags,capital,languages,population";

let userInput = "";
let userIsSearching = false,
  btnClicked = false;

function showCountries(country) {
  let language = "";
  if (!btnClicked) {
    language = country.languages.map((lan) => lan.name + " ");
  } else {
    language = country.languages;
  }

  let box = document.createElement("div");
  box.classList.add("box");

  box.innerHTML = `
            <img src="${country.flags.png}" alt="flag" id="flag">
            <h3 class="name">${country.name}</h3>
            <div class="info">
                <p>capital: <span class="capital">${country.capital}</span></p>
                <p>languages: <span class="languages">${language}</span></p>
                <p>population: <span class="population">${country.population}</span></p>
            </div>
    `;

  countriesWrapper.appendChild(box);
}

getCountriesData(countriesAPI, searchInput.value);

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
          ((country.capital != null && country.capital.match(search)) ||
            language.match(search)) &&
          userIsSearching
        ) {
          showCountries(country);
          numOfCriteria.parentElement.classList.add("active");
        } else if (!userIsSearching && !btnClicked) {
          showCountries(country);
        }
      });
      numOfCriteria.innerText = countriesWrapper.childElementCount;
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
    userIsSearching = true;
    getCountriesData(countriesAPI, searchTarget);
  } else {
    userIsSearching = false;
    window.location.reload();
  }
});

function removeArrows() {
  orderButtons.forEach((btn) => {
    btn.classList.remove("showArrow");
  });
}

function rearrangeOrder(criteria, direction) {
  const boxes = countriesWrapper.querySelectorAll(".box");

  let objectArr = [];

  boxes.forEach((box) => {
    let country = {
      flags: {
        png: box.querySelector("img").src,
      },
      name: box.querySelector(".name").innerText,
      capital: box.querySelector(".capital").innerText,
      languages: box.querySelector(".languages").innerText,
      population: box.querySelector(".population").innerText,
    };
    objectArr.push(country);
  });

  if (criteria === "population") {
    if (direction == 1) {
      objectArr.sort((a, b) => b[criteria] - a[criteria]);
    } else {
      objectArr.sort((a, b) => a[criteria] - b[criteria]);
    }
  } else {
    objectArr.sort((a, b) => {
      const nameA = a[criteria].toLowerCase();
      const nameB = b[criteria].toLowerCase();

      if (nameA > nameB) return -direction;
      if (nameA < nameB) return direction;
      return 0;
    });
  }

  countriesWrapper.innerHTML = "";
  objectArr.forEach((country) => {
    showCountries(country);
  });

  btnClicked = false;
}

let rotate = 0;
orderButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    btnClicked = true;
    removeArrows();

    const arrow = btn.querySelector("span");
    btn.classList.add("showArrow");

    if (btn.classList.contains("showArrow")) {
      arrow.style.transform = `rotate(${rotate}deg)`;
      rotate += 180;
    }

    if ((rotate / 180) % 2 !== 0) {
      btn.classList.add("orderDown");
    } else {
      btn.classList.remove("orderDown");
    }

    if (!btn.classList.contains("orderDown")) {
      rearrangeOrder(btn.id, 1);
    } else {
      rearrangeOrder(btn.id, -1);
    }
  });
});
