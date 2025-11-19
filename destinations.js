async function fetchJson(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function getDashboardData(query) {
  try {
    const destinationsPromise = fetchJson(`http://localhost:3333/destinations?search=${query}`)
    const weathersPromise = fetchJson(`http://localhost:3333/weathers?search=${query}`)
    const airportsPromise = fetchJson(`http://localhost:3333/airports?search=${query}`)

    const [destinations, weathers, airports] = await Promise.all([destinationsPromise, weathersPromise, airportsPromise]);

    return {
      city: destinations[0]?.name ?? null,
      country: destinations[0]?.country ?? null,
      temperature: weathers[0]?.temperature ?? null,
      weather: weathers[0]?.weather_description ?? null,
      airport: airports[0]?.name ?? null
    }
  } catch (error) {
    console.error(error)
  }
}

(async () => {
  try {
    const result = await getDashboardData('vienna')
    console.log('Dashboard: ', result)

    let frase = '';

    if (result.city !== null && result.country !== null) {
      frase += `${result.city} is in ${result.country}.\n`
    }
    if (result.temperature !== null && result.weather !== null) {
      frase += `Today there are ${result.temperature} degrees and the weather is ${result.weather}.\n`
    }
    if (result.airport !== null) {
      frase += `The main airport is ${result.airport}.\n`
    }
    console.log(frase);
  }
  catch (error) {
    console.error(error)
  }
})()