"use strict";


const pokedex = document.getElementById("pokedex");

// const getAllBtn = document.getElementById("getAllBtn");
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
const pokemonUp = document.getElementById("pokemon-up");
const pokemonDown = document.getElementById("pokemon-down");

const searchInput = document.getElementById("search-input");
const pokemonImage = document.getElementById("pokemon-image");

const sound = document.getElementById("sound");

const apiUrl = "https://pokeapi.co/api/v2/pokemon";

const nbPokemonActuel = 1025;

let currentId = 1; // Id Pokémon actuel (pour les boutons Précédent/Suivant)



// // Récupérer tous les pokémons (test dans console.log)
// const getPokemons = async () => {
//     try {
//         const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
//         const data = await response.json();
        
//         console.log("Données complètes de l'API :", data);
//         console.log("Nombre total de Pokémon :", data.count);
//     }
//     catch (error) {
//         console.error("Erreur: ", error);
//     }
// }



/**
 * Récupérer un pokémon par son nom
 * @param {string} name : Nom du Pokémon
 */
const getPokemonByName = async (name) => {
    try {
        const response = await fetch(`${apiUrl}/${name}`); // 💡 1. On envoie la requête vers cette page
        if (!response.ok) {
            throw new Error("Pokémon non trouvé");
        }
        const data = await response.json(); // 💡 2. On récupère les données et on les convertit en Objet JS avec .json()
        showPokemonInfo(data); // 💡 3. On utilise les données récupérées

        currentId = data.id; // Mise à jour de l'ID actuel
    }
    catch (error) {
        console.error("Erreur: ", error);
    }
}


/**
 * Récupérer un pokémon par son id
 * @param {number} id : ID du Pokémon
 */
const getPokemonById = async (id) => {
    try {
        const response = await fetch(`${apiUrl}/${id}`);
        if (!response.ok) {
            throw new Error("Pokémon non trouvé");
        }
        const data = await response.json();
        showPokemonInfo(data);

        currentId = data.id; // Mise à jour de l'ID actuel
    }
    catch (error) {
        console.error("Erreur: ", error);
    }
}


/**
 * Mettre 1re lettre en majuscule
 * @param {string} : Chaîne à modifier
 * @returns {string} : Chaîne avec 1re lettre en majuscule
 */
function capitalizeFirstLetter(string) {
    if (string.length === 0) return string; // Vérifie si la chaîne est vide
    return string.charAt(0).toUpperCase() + string.slice(1);
}



/**
 * Jouer cri d'un Pokémon
 */
function cries(audio) {
    /* Dans le HTML:
    <audio id="sound" src="#"></audio>
    */

    sound.src = audio;
    sound.play();
}



/**
 * Affiche les infos d'un Pokémon
 */
const showPokemonInfo = (pokemon) => {
    pokemonImage.innerHTML = `<img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">`;

    pokemonId.textContent = pokemon.id;
    pokemonName.textContent = capitalizeFirstLetter(pokemon.name);
    pokemonWeight.textContent = (pokemon.weight / 10) + " kg";
    pokemonHeight.textContent = (pokemon.height / 10) + " m";
    pokemonTypes.textContent = capitalizeFirstLetter(pokemon.types.map(type => type.type.name).join(', '));
    pokemonAbilities.textContent = capitalizeFirstLetter(pokemon.abilities.map(ability => ability.ability.name).join(', '));

    /* Dans le HTML:
    <audio id="sound" src="#"></audio>
    */
    // sound.src = pokemon.cries.latest;
    // sound.play();

    cries(pokemon.cries.latest);
}



/**
 * Pokémon suivant
 */
const getNextPokemon = () => {
    if (currentId < nbPokemonActuel) {
        currentId++;
        getPokemonById(currentId);
    }
}

/**
 * Pokémon précédent
 */
const getPreviousPokemon = () => {
    if (currentId > 1) {
        currentId--;
        getPokemonById(currentId);
    }
    else {
        getPokemonById(1);
    }
}


// --- Au clavier (facultatif) ---

function functKeyup(e) {
    if (e.key === "ArrowLeft") {
        getPreviousPokemon();
    }
    if (e.key === "ArrowRight") {
        getNextPokemon();
    }
    if (e.key === "ArrowUp") {
        getPokemonById(1);
    }
    if (e.key === "ArrowDown") {
        getPokemonById(nbPokemonActuel);
    }
}

document.addEventListener("keydown", functKeyup);

// ----- Glisser au doigt sur écran tactile (facultatif) -----

let startX = 0;
let endX = 0;

function dragEnd(e) {
    // console.log(e.type); // 💡 "touchend" si tactile. "mouseup" si souris.

    endX = (e.type === "touchend") ? e.changedTouches[0].screenX : e.screenX;


    // Ignore les petits mouvements :
    let diff = startX / endX;
    // console.log(diff);
    if (diff > 0.97 && diff < 1.03) { // Marche aussi: if (Math.abs(diff) < 0.03) {
        return; // Met fin à la fonction
    }

    if (endX < startX) {
        getNextPokemon();
    }
    else if (endX > startX) {
        getPreviousPokemon();
    }
}

function dragStart(e) {
    // console.log(e.type); // 💡 "touchstart" si tactile. "mousedown" si souris.

    if (e.type === "touchstart") {
        // startX = e.touches[0].screenX; // Marche aussi
        startX = e.changedTouches[0].screenX;
    }
    else if (e.type === "mousedown") {
        e.preventDefault(); // Annule l'interdiction de drag. Attention ⚠ : rend les liens incliquables sur écrans tactiles. Ne pas mettre pour écrans tactiles !

        startX = e.screenX;
    }

    pokedex.addEventListener("mouseup", dragEnd);
}

if (pokedex) {
    pokedex.addEventListener("touchstart", dragStart); // Quand on touche l'écran tactile
    pokedex.addEventListener("mousedown", dragStart); // Quand on clique
    
    pokedex.addEventListener("touchend", dragEnd);
}

// -----

/**
 * Pokémon aléatoire
 */
const getRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * nbPokemonActuel) + 1; // Id aléatoire entre 1 et nbPokemonActuel
    await getPokemonById(randomId);
}

window.addEventListener('devicemotion', (event) => { // Secousse du téléphone
    const acceleration = event.accelerationIncludingGravity;
    
    // Ignore les petits mouvements :
    if (acceleration.x > 15 || acceleration.y > 15 || acceleration.z > 15) {
        getRandomPokemon();
    }
});

// -----


// if (getAllBtn) {
//     getAllBtn.addEventListener("click", getPokemons);
// }

if (getByNameBtn) {
    getByNameBtn.addEventListener("click", () => {
        const name = searchInput.value.toLowerCase();

        getPokemonByName(name);
    });
}

if (getByIdBtn) {
    getByIdBtn.addEventListener("click", () => {
        const id = parseInt(searchInput.value);

        if (!isNaN(id) && id > 0 && id <= nbPokemonActuel) {
            getPokemonById(id);
        }
    });
}

if (pokemonPrevious) {
    pokemonPrevious.addEventListener("click", getPreviousPokemon);
}
if (pokemonNext) {
    pokemonNext.addEventListener("click", getNextPokemon);
}
if (pokemonUp) {
    pokemonUp.addEventListener("click", () => getPokemonById(1));
}
if (pokemonDown) {
    pokemonDown.addEventListener("click", () => getPokemonById(nbPokemonActuel));
}
