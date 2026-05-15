const searchInput = document.getElementById('nombrePokemon');
const searchButton = document.getElementById('buscarBtn');
const cardContainer = document.getElementById('cardPokemon');


const kantoLocalDatabase = {
    "pikachu": {
        id: 25,
        name: "pikachu",
        type: "electric",
        image: "https://githubusercontent.com",
        stats: { hp: 35, attack: 55, defense: 40, "special-attack": 50, "special-defense": 50, speed: 90 }
    },
    "bulbasaur": {
        id: 1,
        name: "bulbasaur",
        type: "grass",
        image: "https://githubusercontent.com",
        stats: { hp: 45, attack: 49, defense: 49, "special-attack": 65, "special-defense": 65, speed: 45 }
    },
    "charmander": {
        id: 4,
        name: "charmander",
        type: "fire",
        image: "https://githubusercontent.com",
        stats: { hp: 39, attack: 52, defense: 43, "special-attack": 60, "special-defense": 50, speed: 65 }
    },
    "squirtle": {
        id: 7,
        name: "squirtle",
        type: "water",
        image: "https://githubusercontent.com",
        stats: { hp: 44, attack: 48, defense: 65, "special-attack": 50, "special-defense": 64, speed: 43 }
    }
};

searchButton.addEventListener('click', () => {
    const pokemonName = searchInput.value.toLowerCase().trim();
    if (pokemonName) {
        fetchPokemonData(pokemonName);
    }
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const pokemonName = searchInput.value.toLowerCase().trim();
        if (pokemonName) {
            fetchPokemonData(pokemonName);
        }
    }
});

async function fetchPokemonData(pokemon) {
    
    try {
        const response = await fetch(`https://pokeapi.co{pokemon}`);
        
        if (response.ok) {
            const data = await response.json();
            if (data.id > 151) {
                cardContainer.innerHTML = `<p class="error-msg" style="color: #ff9800; text-align: center; font-weight: bold; margin-top: 20px;">Este Pokémon no pertenece a la región de Kanto.</p>`;
                return;
            }
            renderPokemonCard(data);
            return;
        }
    } catch (apiError) {
        console.warn("API externa inaccesible, usando base de datos local de respaldo.");
    }

    
    const localData = kantoLocalDatabase[pokemon] || Object.values(kantoLocalDatabase).find(p => p.id == pokemon);

    if (localData) {
        renderLocalPokemonCard(localData);
    } else {
        cardContainer.innerHTML = `<p class="error-msg" style="color: red; text-align: center; font-weight: bold; margin-top: 20px;">Pokémon no encontrado en la base local (Prueba con pikachu, bulbasaur, charmander o squirtle).</p>`;
    }
}

function renderPokemonCard(data) {
    const imageUrl = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
    const stats = {};
    data.stats.forEach(stat => { stats[stat.stat.name] = stat.base_stat; });
    const primaryType = data.types[0].type.name;
    const formattedId = String(data.id).padStart(3, '0');
    injectHtml(formattedId, imageUrl, data.name, primaryType, stats);
}

function renderLocalPokemonCard(localData) {
    const formattedId = String(localData.id).padStart(3, '0');
    injectHtml(formattedId, localData.image, localData.name, localData.type, localData.stats);
}

function injectHtml(id, img, name, type, stats) {
    cardContainer.innerHTML = `
        <p class="pokemon-id" style="text-align: center; color: #666; font-weight: bold; margin-top: 15px;">#${id}</p>
        <img src="${img}" alt="${name}" class="pokemon-img" style="max-width: 180px; display: block; margin: 0 auto;">
        <h2 class="pokemon-name" style="text-transform: uppercase; text-align: center; margin: 10px 0;">${name}</h2>
        
        <p class="pokemon-type" style="text-align: center; font-weight: bold; background: #eee; padding: 5px 10px; border-radius: 15px; width: fit-content; margin: 0 auto 15px auto;">${type}</p>
        
        <div class="pokemon-stats" style="max-width: 250px; margin: 0 auto; background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
            <p style="margin: 5px 0; display: flex; justify-content: space-between;"><strong>hp:</strong> <span>${stats['hp'] || 0}</span></p>
            <p style="margin: 5px 0; display: flex; justify-content: space-between;"><strong>attack:</strong> <span>${stats['attack'] || 0}</span></p>
            <p style="margin: 5px 0; display: flex; justify-content: space-between;"><strong>defense:</strong> <span>${stats['defense'] || 0}</span></p>
            <p style="margin: 5px 0; display: flex; justify-content: space-between;"><strong>special-attack:</strong> <span>${stats['special-attack'] || 0}</span></p>
            <p style="margin: 5px 0; display: flex; justify-content: space-between;"><strong>special-defense:</strong> <span>${stats['special-defense'] || 0}</span></p>
            <p style="margin: 5px 0; display: flex; justify-content: space-between;"><strong>speed:</strong> <span>${stats['speed'] || 0}</span></p>
        </div>
    `;
}
