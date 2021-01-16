const API_KEY = "73327d65b1d69a81fb46d94eb5c08281";
const apiUrl = "https://api.themoviedb.org/3";
export const imageUrl = "https://image.tmdb.org/t/p/original";

export async function getActorByActorId(id) {
  try {
    const url = apiUrl + `/person/` + id + `?api_key=${API_KEY}`;
    console.log(url);
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.log(`Error with function getActorByActorId ${error.message}`);
    throw error;
  }
}

export async function getPopularActors(requestedPage) {
  try {
    const url =
      apiUrl + `/person/popular?api_key=${API_KEY}&page=${requestedPage}`;
    console.log(url);
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(`Error with function getPopularActors ${error.message}`);
    throw error;
  }
}

export async function getActorsFromFilter(filter, requestedPage) {
  try {
    const url =
      apiUrl +
      `/search/person?api_key=${API_KEY}&page=${requestedPage}&query=${filter}`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(`Error with function getActorsFromFilter ${error.message}`);
    throw error;
  }
}

export async function getCombinedCredits(id) {
  try {
    const url =
      apiUrl + `/person/` + id + `/combined_credits?api_key=${API_KEY}`;
    console.log(url);
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.log(`Error with function getCombinedCredits ${error.message}`);
    throw error;
  }
}
