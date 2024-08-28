document.addEventListener('DOMContentLoaded', () => {
    const cities = {
        'miami': 'America/New_York',
        'new-york': 'America/New_York',
        'montevideo': 'America/Montevideo',
        'paris': 'Europe/Paris',
        'berlin': 'Europe/Berlin'
    };

    const updateTime = (city, timezone) => {
        fetch(`https://worldtimeapi.org/api/timezone/${timezone}`)
            .then(response => response.json())
            .then(data => {
                document.querySelector(`#${city} span`).textContent = new Date(data.datetime).toLocaleTimeString();
            })
            .catch(error => console.error('Erro ao buscar a hora:', error));
    };

    Object.keys(cities).forEach(city => {
        updateTime(city, cities[city]);
        setInterval(() => updateTime(city, cities[city]), 60000);
    });

    document.getElementById('add-city').addEventListener('click', () => {
        const cityInput = document.getElementById('city-input');
        const cityName = cityInput.value.trim();
        if (cityName) {
            const cityId = cityName.toLowerCase().replace(' ', '-');
            if (!document.getElementById(cityId)) {
                const newClock = document.createElement('div');
                newClock.className = 'clock';
                newClock.id = cityId;
                newClock.innerHTML = `${cityName}: <span></span> <button class="remove-city">Remover</button>`;
                document.getElementById('clocks').appendChild(newClock);
                fetch(`https://worldtimeapi.org/api/timezone`)
                    .then(response => response.json())
                    .then(timezones => {
                        const timezone = timezones.find(tz => tz.toLowerCase().includes(cityName.toLowerCase()));
                        if (timezone) {
                            updateTime(cityId, timezone);
                            setInterval(() => updateTime(cityId, timezone), 60000);
                        } else {
                            alert('Cidade não encontrada');
                        }
                    })
                    .catch(error => console.error('Erro ao buscar a lista de fusos horários:', error));
            }
        }
    });

    document.getElementById('clocks').addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-city')) {
            const clockDiv = event.target.parentElement;
            clockDiv.remove();
        }
    });
});
