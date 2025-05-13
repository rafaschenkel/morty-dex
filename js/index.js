document.addEventListener("DOMContentLoaded", main);
const cards = document.getElementById("cards");

function getStatus(status) {
  switch (status) {
    case "Alive":
      return "Vivo";
    case "Dead":
      return "Morto";
    case "unknown":
      return "Desconhecido";
    default:
      return status;
  }
}

function getSpecie(specie) {
  switch (specie) {
    case "Human":
      return "Humano";
    case "Alien":
      return "Alienígena";
    case "Humanoid":
      return "Humanoide";
    case "Robot":
      return "Robô";
    default:
      return specie;
  }
}

function createCard(character) {
  const card = document.createElement("div");
  card.classList.add(
    "col-12",
    "col-md-6",
    "col-xl-4",
    "d-flex",
    "justify-content-center"
  );
  card.innerHTML = `
    <div class="card bg-dark border-3 rounded-3" onClick="selectCharacter(${
      character.id
    })">
      <img
        src="${character.image}"
        class="card-img-top"
        alt="imagem do personagem..."
        height="320px"
      />
      <div class="card-body py-3">
        <div class="container">
          <div class="row fs-5 fw-semibold gap-2">
            <div class="col-12">
              <h5 class="card-title fs-3 fw-bold m-0">${character.name}</h5>
              <div class="d-flex align-items-center gap-2">
                <span class="condition-icon">
                  <i class="bi bi-circle-fill ${
                    character.status === "Vivo"
                      ? "alive"
                      : character.status === "Morto"
                      ? "dead"
                      : "unknown"
                  }">
                  </i>
                </span>
                <p class="card-text condition text-light m-0">
                  ${character.status} - ${character.species}
                </p>
              </div>
            </div>
            <div class="col-12">
              <p class="fw-semibold m-0">Última localização conhecida:</p> 
              <p class="card-text">
                ${character.location.name}
              </p>
            </div>
            <div class="col-12">
              <p class="fw-semibold m-0">Visto a última vez em:</p> 
              <p class="card-text">
                ${character.episode.name}
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  `;

  return card;
}

function renderCharacters(characters) {
  cards.innerHTML = "";

  characters.forEach((character) => {
    const characterCard = createCard(character);
    cards.appendChild(characterCard);
  });
}

async function searchCharacter() {
  try {
    const url = `https://rickandmortyapi.com/api/character/?name=${searchInput.value}&page=1`;
    await loadMainContent(url);
    location.href = "#cards";
  } catch (error) {
    alert("Personagem não encontrado");
  }
}

const searchInput = document.getElementById("searchCharacter");
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchCharacter();
  }
});
const searchIcon = document.getElementById("icon-search");
searchIcon.addEventListener("click", () => {
  searchCharacter();
});

async function loadMainContent(url) {
  try {
    const params = new URLSearchParams(new URL(url).search);
    const name = params.get("name");
    const page = params.get("page");

    let charactersList;
    let response;

    if (name) {
      response = await getCharacterByName(name, page);
      charactersList = await normalizeCharacterList([
        ...response.ListCharacters,
      ]);
    } else {
      response = await getCharactersByPage(page);
      charactersList = await normalizeCharacterList([
        ...response.ListCharacters,
      ]);
    }
    renderCharacters(charactersList);
    renderPagination(response.prevPage, response.nextPage);
  } catch (error) {
    console.log(error);
  }
}

async function loadFooterContent() {
  try {
    const totalCharactersSpan = document.getElementById("totalCharacters");
    const totalLocationsSpan = document.getElementById("totalLocations");
    const totalEpisodesSpan = document.getElementById("totalEpisodes");

    const totalCharacters = await getInfoByFeature("character");
    const totalLocations = await getInfoByFeature("location");
    const totalEpisodes = await getInfoByFeature("episode");

    totalCharactersSpan.textContent = totalCharacters;
    totalLocationsSpan.textContent = totalLocations;
    totalEpisodesSpan.textContent = totalEpisodes;
  } catch (error) {
    console.log(error);
  }
}

async function normalizeCharacterList(charactersList) {
  try {
    for (const character of charactersList) {
      const lastEpisodeURL = character.episode[character.episode.length - 1];
      const lastEpisodeName = await getLastEpisode(lastEpisodeURL);
      const status = getStatus(character.status);
      const specie = getSpecie(character.species);

      character.episode = {
        url: lastEpisodeURL,
        name: lastEpisodeName,
      };

      character.status = status;
      character.species = specie;
    }

    return charactersList;
  } catch (error) {
    console.log(error);
  }
}

function renderPagination(prevLink, nextLink) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const ul = document.createElement("ul");
  ul.classList.add("pagination", "gap-3", "justify-content-center");

  const liPrevPage = document.createElement("li");
  liPrevPage.classList.add("page-item");

  const prevButton = document.createElement("button");
  prevButton.classList.add("btn", "btn-lg");
  prevLink === null
    ? prevButton.classList.add("disabled", "btn-outline-success")
    : prevButton.classList.add("btn-success");
  prevButton.innerHTML = "Anterior";
  prevButton.addEventListener("click", async () => {
    await loadMainContent(prevLink);
    location.href = "#cards";
  });

  const liNextPage = document.createElement("li");
  liNextPage.classList.add("page-item");

  const nextButton = document.createElement("button");
  nextButton.classList.add("btn", "btn-lg");
  nextLink === null
    ? nextButton.classList.add("disabled", "btn-outline-success")
    : nextButton.classList.add("btn-success");
  nextButton.innerHTML = "Próximo";
  nextButton.addEventListener("click", async () => {
    await loadMainContent(nextLink);
    location.href = "#cards";
  });

  liPrevPage.appendChild(prevButton);
  liNextPage.appendChild(nextButton);
  ul.appendChild(liPrevPage);
  ul.appendChild(liNextPage);
  pagination.appendChild(ul);
}

async function main() {
  try {
    await loadMainContent("https://rickandmortyapi.com/api/character/?page=1");
    await loadFooterContent();
  } catch (error) {
    console.log(error);
  }
}
