const boton = document.getElementById('buscarBtn');
const input = document.getElementById('nombrePokemon');
const contenedor = document.getElementById('cardPokemon');

const baseDatosLocal = {
    "pikachu": { name: "PIKACHU", type: "electric", img: "https://githubusercontent.com" },
    "charizard": { name: "CHARIZARD", type: "fire, flying", img: "https://githubusercontent.com" },
    "bulbasaur": { name: "BULBASAUR", type: "grass, poison", img: "https://githubusercontent.com" },
    "squirtle": { name: "SQUIRTLE", type: "water", img: "https://githubusercontent.com" },
    "mewtwo": { name: "MEWTWO", type: "psychic", img: "https://githubusercontent.com" },
    "eevee": { name: "EEVEE", type: "normal", img: "https://githubusercontent.com" }
};

boton.addEventListener('click', buscarPokemon);

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscarPokemon();
});

async function buscarPokemon() {
    const nombre = input.value.toLowerCase().trim();
    
    if (!nombre) {
        contenedor.innerHTML = '<p class="error-msg">Por favor, escribe un nombre.</p>';
        return;
    }

    contenedor.innerHTML = '<p class="info-msg">Buscando en el registro local...</p>';

    if (baseDatosLocal[nombre]) {
        const pokemon = baseDatosLocal[nombre];
        
        contenedor.innerHTML = `
            <div class="pokemon-card">
                <h3>${pokemon.name}</h3>
                <img src="${pokemon.img}" alt="${pokemon.name}">
                <div>
                    <span class="tipo-badge">${pokemon.type}</span>
                </div>
            </div>
        `;
    } else {
        try {
            const url = `https://pokeapi.co{nombre}`;
            const respuesta = await fetch(url);
            
            if (!respuesta.ok) throw new Error();
            
            const datos = await respuesta.json();
            const nombrePoke = datos.name.toUpperCase();
            const imagenUrl = datos.sprites.other['official-artwork'].front_default || datos.sprites.front_default;
            const tipoPoke = datos.types.map(t => t.type.name).join(', ');

            contenedor.innerHTML = `
                <div class="pokemon-card">
                    <h3>${nombrePoke}</h3>
                    <img src="${imagenUrl}" alt="${nombrePoke}">
                    <div>
                        <span class="tipo-badge">${tipoPoke}</span>
                    </div>
                </div>
            `;
        } catch (error) {
            contenedor.innerHTML = `<p class="error-msg">Error: "${nombre}" no encontrado. Prueba con pikachu, charizard, bulbasaur o squirtle.</p>`;
        }
    }
}
