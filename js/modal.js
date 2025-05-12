const characterName = document.getElementById("characterName");
const characterImage = document.getElementById("characterImage");
const characterStatus = document.getElementById("characterStatus");
const characterStatusIcon = document.getElementById("characterStatusIcon");
const characterSpecies = document.getElementById("characterSpecies");
const characterLocation = document.getElementById("characterLocation");
const characterLastEpisode = document.getElementById("characterLastEpisode");

const modal = new bootstrap.Modal(document.getElementById("detailCharacter"));

const btnCloseModal = document.getElementById("btnCloseModal");

async function selectCharacter(id) {
  const response = await api.get(`/character/${id}`);
  const character = response.data;
  const lastEpisode = await getLastEpisode(
    character.episode[character.episode.length - 1]
  );
  const status = getStatus(character.status);
  const specie = getSpecie(character.species);

  characterName.textContent = character.name;
  characterImage.src = character.image;
  characterStatus.textContent = status;
  characterStatusIcon.classList.add(character.status.toLowerCase());
  characterSpecies.textContent = specie;
  characterLocation.textContent = character.location.name;
  characterLastEpisode.textContent = lastEpisode;

  modal.show();
}

function closeModal() {
  document
    .getElementById("detailCharacter")
    .addEventListener("hide.bs.modal", () => {
      document.activeElement.blur(); // Remove o foco de qualquer elemento do modal
    });
  modal.hide();
}

btnCloseModal.addEventListener("click", closeModal);
