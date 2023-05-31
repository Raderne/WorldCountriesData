const countriesWrapper = document.querySelector(".countries-wrapper");
const searchInput = document.getElementById("search");
const numOfCriteria = document.getElementById("numOfCriteria");
const orderButtons = document.querySelectorAll(".order-btns button");

const countriesAPI =
  "https://restcountries.com/v2/all?fields=name,flags,capital,languages,population";

let userInput = "";
let userIsSearching = false,
  btnClicked = false;

// Inject country card into Html

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

// Get Countries data from API

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

// search countries
searchInput.addEventListener("input", (e) => {
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

// rearrange order according to filter buttons
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

// Countries chart using ChartJs
const ctx = document.getElementById("myChart");
let chart;

function getCountriesChartInfo(context) {
  const countryInfo = getChartData();

  const labels = countryInfo.map((country) => country.name);
  const data = {
    labels: labels,
    datasets: [
      {
        axis: "y",
        data: [...countryInfo.map((country) => country.population)],
        fill: false,
        backgroundColor: "#eb7b62",
      },
    ],
  };

  const config = {
    type: "bar",
    data,
    options: {
      indexAxis: "y",
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  chart = new Chart(context, config);
}
setTimeout(() => {
  getCountriesChartInfo(ctx);
}, 1000);

function getChartData() {
  const boxes = countriesWrapper.querySelectorAll(".box");

  let countryInfo = [];

  boxes.forEach((box) => {
    let country = {
      name: box.querySelector(".name").innerText,
      languages: box.querySelector(".languages").innerText,
      population: box.querySelector(".population").innerText,
    };
    countryInfo.push(country);
  });

  countryInfo.sort((a, b) => b["population"] - a["population"]);

  let worldPopulation = countryInfo
    .map((num) => num.population)
    .reduce((total, num) => {
      return total + parseFloat(num);
    }, 0);

  let chartData = [
    {
      name: "World",
      languages: "",
      population: worldPopulation,
    },
  ];

  for (let i = 0; i < 9; i++) {
    if (countryInfo[i] == null) return;
    chartData.push(countryInfo[i]);
  }

  console.log("chart :", chartData);

  return chartData;
}
