async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function getDashboardData(query) {
  const destinationsPromise = fetchJson(`http://localhost:3333/destinations?search=${query}`)
  const weathersPromise = fetchJson(`http://localhost:3333/weathers?search=${query}`)
  const airportsPromise = fetchJson(`http://localhost:3333/airports?search=${query}`)

  Promise.all([destinationsPromise, weathersPromise, airportsPromise])
    .then(res => console.log(res))
    .catch(error => console.error(error))
}

getDashboardData('london')