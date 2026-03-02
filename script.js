const input = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const bordersSection = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searhCountry(countryName){
    if(!countryName) return;
    spinner.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    countryInfo.innerHTML = '';
    bordersSection.innerHTML = '';

    try{
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if(!response.ok) throw new Error('Country not found');

        const data = await response.json();
        const country = data[0];

        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital?.[0] || 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
        `;

        if(country.borders){
            for(const code of country.borders){
                const borderRes = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderRes.json();
                const neighbour = borderData[0];

                const div = document.createElement('div');
                div.innerHTML = `
                    <p>${neighbour.name.common}</p>
                    <img src="${neighbour.flags.svg}" width="80">
                `;
                bordersSection.appendChild(div);
            }
        }
    } catch(error){
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally{
        spinner.classList.add('hidden');
    }
}