const baseURL = "https://rickandmortyapi.com/api";

const api = axios.create({
  baseURL,
});

async function getCharactersByPage(page = 1) {
  try {
    const response = await api.get("/character", {
      params: {
        page,
      },
    });
    return {
      ListCharacters: response.data.results,
      nextPage: response.data.info.next,
      prevPage: response.data.info.prev,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getCharacterByName(name, page = 1) {
  try {
    const response = await api.get(`/character`, {
      params: {
        page,
        name,
      },
    });

    return {
      ListCharacters: response.data.results,
      nextPage: response.data.info.next,
      prevPage: response.data.info.prev,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getInfoByFeature(feature) {
  try {
    const response = await api.get(`/${feature}`);
    return response.data.info.count;
  } catch (error) {
    console.log(error);
  }
}

async function getLastEpisode(id) {
  try {
    const response = await api.get(`/episode/${id}`);
    return response.data.name;
  } catch (error) {
    console.log(error);
  }
}
