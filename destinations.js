async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function getDashboardData(query) {
  const destinationsPromise = fetchJson(`http://localhost:3333/destinations?search=${query}`)
  const weathersPromise = fetchJson(`http://localhost:3333/weathers?search=${query}`)
  const airportsPromise = fetchJson(`http://localhost:3333/airports?search=${query}`)

  const [destinations, weathers, airports] = await Promise.all([destinationsPromise, weathersPromise, airportsPromise]);

  return {
    city: destinations[0].name,
    country: destinations[0].country,
    temperature: weathers[0].temperature,
    weather: weathers[0].weather_description,
    airport: airports[0].name
  }
}

(async () => {
  try {
    const result = await getDashboardData('london')
    console.log('Dashboard: ', result)
    console.log(
      `${result.city} is in ${result.country}.\n` +
      `Today there are ${result.temperature} degrees and the weather is ${result.weather}.\n` +
      `The main airport is ${result.airport}.\n`
    );
  }
  catch (error) {
    console.error(error)
  }
})()