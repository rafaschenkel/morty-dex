let prevPage = null;
let nextPage = null;

function pageChange(url) {
  if (url.split("name=")[1]) {
    return () => pageChangeWithCharacterSearch(url);
  } else {
    return pageChangeWithCharacterList(url);
  }
}

async function pageChangeWithCharacterList(url) {
  try {
    const page = url.split("page=")[1];
    const response = await getCharactersByPage(page);
    await renderCharacters(response.ListCharacters);
    location.href = "#cards";
    nextPage = response.nextPage;
    prevPage = response.prevPage;
    if (prevPage === null) previousButton.classList.add("disabled");
    else previousButton.classList.remove("disabled");
    if (nextPage === null) nextButton.classList.add("disabled");
    else nextButton.classList.remove("disabled");
  } catch (error) {
    console.log(error);
  }
}

async function pageChangeWithCharacterSearch(url) {
  try {
    const character = url.split("name=")[1];
    const page = url.split("page=")[1].split("&")[0];
    const response = await getCharacterByName(character, page);
    await renderCharacters(response.ListCharacters);
    location.href = "#cards";
    nextPage = response.nextPage;
    prevPage = response.prevPage;
    if (prevPage === null) previousButton.classList.add("disabled");
    else previousButton.classList.remove("disabled");
    if (nextPage === null) nextButton.classList.add("disabled");
    else nextButton.classList.remove("disabled");
  } catch (error) {
    console.log(error);
  }
}
