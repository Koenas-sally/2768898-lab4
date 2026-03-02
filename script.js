const input = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const bordersSection = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searhCountry(countryName){
    try{
        if(!countryName.trim()){
            throw new Error('Country not found');
        }

        spinner.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        countryInfo.classList.add('hidden');
        bordersSection.classList.add('hidden');
        bordersSection.innerHTML = '';
        countryInfo.innerHTML = '';


        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        if(!response.ok) {
            throw new Error('Country not found');
        }

        const data = await response.json();
        const country = data[0];

        const countryNameCommon = country.name?.common || "N/A";
        const capital = country.capital? country.capital[0] : "N/A";
        const population = country.population ? country.population.toLocaleString() : "N/A";
        const region = country.region || "N/A";
        const flag = country.flags?.svg || "";

        countryInfo.innerHTML = `
            <h2>${countryNameCommon}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Region:</strong> ${region}</p>
            <img src="${flag}" alt="${countryNameCommon} flag" width="150">
        `;

        countryInfo.classList.remove('hidden');

        if(country.borders && country.borders.length > 0){
            const boarderPromises = country.borders.map(code =>
                fetch(`https://restcountries.com/v3.1/alpha/${code}`)
                .then(res =>{
                    if(!res.ok){
                        throw new Error("Error fetching bordering countries");
                    }
                    return res.json();
                })
            );

            const borderData = await Promise.all(boarderPromises);

            borderData.fetch(boarderArray =>{
                const borderCountry = boarderArray[0];

                const borderDiv = document.createElement('div');
                borderDiv.innerHTML = `
                    <p>${borderCountry.name.common}</p>
                    <img src="${borderCountry.flags.svg}"
                        alt="${borderCountry.common.name} flag" width="80">
                `;

                bordersSection.appendChild(borderDiv);
            });

            bordersSection.classList.remove('hidden');
        }else{
            bordersSection.innerHTML = "<p>No bordering countries</p>";
            bordersSection.classList.remove('hidden');
        }
    } catch(error){
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally{
        spinner.classList.add('hidden');
    }
}

searchBtn.addEventListener('click', () => {
    searchCountry(input.value.trim());
});

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCountry(input.value.trim());
    }
});
