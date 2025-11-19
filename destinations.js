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

    const [destinations, weathers, airports] = await Promise.allSettled([destinationsPromise, weathersPromise, airportsPromise]);

    const data = {}

    if (destinations.status === 'rejected') {
      console.error('Errore in destinations: ', destinations.reason)
      data.city = null
      data.country = null
    }
    else {
      data.city = destinations.value[0]?.name ?? null
      data.country = destinations.value[0]?.country ?? null
    }

    if (weathers.status === 'rejected') {
      console.error('Errore in weathers: ', weathers.reason)
      data.temperature = null
      data.weather = null
    }
    else {
      data.temperature = weathers.value[0]?.temperature ?? null
      data.weather = weathers.value[0]?.weather_description ?? null
    }

    if (airports.status === 'rejected') {
      console.error('Errore in airports: ', airports.reason)
      data.airport = null
    }
    else {
      data.airport = airports.value[0]?.name ?? null
    }

    return data;

  } catch (error) {
    throw new Error(`Errore nel recupero dei dati: ${error.message}`)
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