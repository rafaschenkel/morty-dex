document.addEventListener("DOMContentLoaded", main);
const cards = document.getElementById("cards");

const totalCharactersSpan = document.getElementById("totalCharacters");
const totalLocationsSpan = document.getElementById("totalLocations");
const totalEpisodesSpan = document.getElementById("totalEpisodes");

const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");

function getStatus(status) {
  switch (status) {
    case "Alive":
      return "Vivo";
    case "Dead":
      return "Morto";
    default:
      return "Desconhecido";
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
    default:
      return "Desconhecido";
  }
}

async function createCard(character) {
  const status = getStatus(character.status);
  const specie = getSpecie(character.species);

  const lastEpisode = await getLastEpisode(character.episode.length);

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
                    character.status === "Alive"
                      ? "alive"
                      : character.status === "Dead"
                      ? "dead"
                      : "unknown"
                  }">
                  </i>
                </span>
                <p class="card-text condition text-light m-0">
                  ${status} - ${specie}
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
                ${lastEpisode}
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  `;

  return card;
}

async function renderCharacters(characters) {
  cards.innerHTML = "";
  characters.forEach(async (character) => {
    const characterCard = await createCard(character);
    cards.appendChild(characterCard);
  });
}

async function searchCharacter(e) {
  try {
    if (e.key === "Enter") {
      const response = await getCharacterByName(searchInput.value);

      await renderCharacters(response.ListCharacters);
      location.href = "#cards";

      nextPage = response.nextPage;
      prevPage = response.prevPage;

      nextButton.addEventListener("click", () =>
        pageChangeWithCharacterSearch(nextPage)
      );
      previousButton.addEventListener("click", () =>
        pageChangeWithCharacterSearch(prevPage)
      );

      if (prevPage === null) previousButton.classList.add("disabled");
      else previousButton.classList.remove("disabled");
      if (nextPage === null) nextButton.classList.add("disabled");
      else nextButton.classList.remove("disabled");
    }
  } catch (error) {
    alert("Personagem não encontrado");
  }
}

const searchInput = document.getElementById("searchCharacter");
searchInput.addEventListener("keydown", async (e) => searchCharacter(e));

async function main() {
  totalCharactersSpan.textContent = await getInfoByFeature("character");
  totalLocationsSpan.textContent = await getInfoByFeature("location");
  totalEpisodesSpan.textContent = await getInfoByFeature("episode");

  const response = await getCharactersByPage();
  await renderCharacters(response.ListCharacters);

  nextPage = response.nextPage;
  prevPage = response.prevPage;

  nextButton.addEventListener("click", () => pageChange(nextPage));
  previousButton.addEventListener("click", () => pageChange(prevPage));
}
