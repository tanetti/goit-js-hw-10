import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './js/fetch-countries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('input#search-box'),
  countryList: document.querySelector('ul.country-list'),
  countryInfo: document.querySelector('div.country-info'),
};

const clearCountryInfoContainers = () => {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
};

const onSearchBoxInput = ({ target }) => {
  const countryName = target.value.trim();
  countryName && findCountries(countryName);
  clearCountryInfoContainers();
};

const verifyAndUnpackData = response => {
  if (!response.ok) {
    throw new Error(response.status);
  }

  return response.json();
};

const listOfCountriesMarkup = data =>
  data
    .map(
      ({ name, flags }) =>
        `<li>
          <img src="${flags.svg}" alt="${name.official}" width="40">
          <span>${name.official}</span>
        </li>`
    )
    .join('');

const singleCountryMarkup = ([country]) => {
  const { name, flags, capital, population, languages } = country;

  return `<li>
          <img src="${flags.svg}" alt="${name.official}" width="80">
          <span>${name.official}</span>
        </li>`;
};

const renderData = data => {
  if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  if (data.length > 1) {
    refs.countryList.innerHTML = listOfCountriesMarkup(data);
    return;
  }

  refs.countryInfo.innerHTML = singleCountryMarkup(data);
};

const showError = error => Notify.failure(error.message === '404' ? 'Oops, there is no country with that name' : 'Oops, something went wrong');

const findCountries = name => {
  fetchCountries(name).then(verifyAndUnpackData).then(renderData).catch(showError);
};

refs.searchBox.addEventListener('input', debounce(onSearchBoxInput, DEBOUNCE_DELAY));
