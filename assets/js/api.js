/*

Réaliser un programme permettant d'exploiter les fonctionnalités de l'API PokéAPI disponible à cette adresse : https://pokeapi.co/

Le programme devra permettre plusieurs fonctionnalités :

- Permettre de chercher un pokémon via son nom.
- Permettre de chercher un pokémon via son numéro de pokédex nationnal (son id).
- Permettre de visualiser les informations principales du pokémon (Son nom, son poids, sa taille, ses types, ses capacités et son numéro de pokédex nationnal).
- Il devra être possible de passer directement au pokémon suivant ou précédent dans le pokédex (aller du #27 au #28 par exemple). Cette fonctionnalité devra vérifier si l'on est déjà au premier ou au dernier pokémon afin d'éviter de chercher un pokémon non existant.

*/

const getAllBtn = document.getElementById("getAllBtn");
const getByNameBtn = document.getElementById("getByNameBtn");
const getByIdBtn = document.getElementById("getByIdBtn");

const pokemonId = document.getElementById("pokemon-id");
const pokemonName = document.getElementById("pokemon-name");
const pokemonWeight = document.getElementById("pokemon-weight");
const pokemonHeight = document.getElementById("pokemon-height");
const pokemonTypes = document.getElementById("pokemon-types");
const pokemonAbilities = document.getElementById("pokemon-abilities");

const pokemonPrevious = document.getElementById("pokemon-previous");
const pokemonNext = document.getElementById("pokemon-next");    

const searchInput = document.getElementById("search-input");
const pokemonImage = document.getElementById("pokemon-image");

const apiUrl = "https://pokeapi.co/api/v2/pokemon";
const apiUrlTous = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";


// Récupérer tous les pokémons
const getPokemons = async () => {
    try {
        const response = await fetch(apiUrlTous);
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.error("Erreur récupération des pokémons :", error);
    }
}

// Récupérer un pokémon par son nom
const getPokemonByName = async (name) => {
    try {
        const response = await fetch(`${apiUrl}/${name}`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Erreur récupération du pokémon :", error);
    }
}

// Récupérer un pokémon par son id
const getPokemonById = async (id) => {
    try {
        const response = await fetch(`${apiUrl}/${id}`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Erreur récupération du pokémon :", error);
    }
}


/**
 * Afficher infos pokémon
 */
const showPokemonInfo = async (pokemon) => {
    pokemonId.textContent = pokemon.id;
    pokemonName.textContent = pokemon.name;
    pokemonWeight.textContent = pokemon.weight;
    pokemonHeight.textContent = pokemon.height;
    pokemonTypes.textContent = pokemon.types.map(type => type.type.name).join(', ');
    pokemonAbilities.textContent = pokemon.abilities.map(ability => ability.ability.name).join(', ');
    pokemonImage.innerHTML = `<img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">`;
}


if (getAllBtn) {
    getAllBtn.addEventListener("click", async () => {
        const pokemons = await getPokemons();
        console.log("Tous les Pokémons :", pokemons);
    });
}


if (getByNameBtn) {
    getByNameBtn.addEventListener("click", async () => {
        const pokemonName = searchInput.value.toLowerCase();
        if (pokemonName) {
            try {
                const pokemon = await getPokemonByName(pokemonName);
                showPokemonInfo(pokemon);
            }
            catch (error) {
                console.error("Erreur recherche Pokémon :", error);
                pokemonDisplay.textContent = "Pokémon non trouvé";
            }
        }
    });
}


if (getByIdBtn) {
    getByIdBtn.addEventListener("click", async () => {
        const pokemonId = searchInput.value;
        if (pokemonId) {
            try {
                const pokemon = await getPokemonById(pokemonId);
                showPokemonInfo(pokemon);
            }
            catch (error) {
                console.error("Erreur recherche Pokémon :", error);
                pokemonDisplay.textContent = "Pokémon non trouvé";
            }
        }
    });
}


// // Ajout des fonctions pour les boutons précédent et suivant
// if (pokemonPrev) {

// }

// if (pokemonNext) {

// }