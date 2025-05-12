let prevPage = null;
let nextPage = null;

function pageChange(url) {
  if (url.split("name=")[1] !== undefined) {
    return pageChangeWithCharacterSearch(url);
  } else {
    return pageChangeWithCharacterList(url);
  }
}

async function pageChangeWithCharacterList(url) {
  try {
    const page = url.split("page=")[1];
    const response = await getCharactersByPage(page);
    const charactersList = await normalizeCharacterList([
      ...response.ListCharacters,
    ]);

    location.href = "#cards";
    renderCharacters(charactersList);

    setLinkPages(response.prevPage, response.nextPage);
  } catch (error) {
    console.log(error);
  }
}

async function pageChangeWithCharacterSearch(url) {
  try {
    const character = url.split("name=")[1];
    const page = url.split("page=")[1].split("&")[0];
    const response = await getCharacterByName(character, page);
    const charactersList = await normalizeCharacterList([
      ...response.ListCharacters,
    ]);

    location.href = "#cards";
    renderCharacters(charactersList);

    setLinkPages(response.prevPage, response.nextPage);
  } catch (error) {
    console.log(error);
  }
}
