const BASE_URL = 'https://restcountries.com/v3.1/name';
const REQUIRED_FIELDS = ['name', 'capital', 'population', 'flags', 'languages'];

export const fetchCountries = name => fetch(`${BASE_URL}/${name}?fields=${REQUIRED_FIELDS.join()}`);
