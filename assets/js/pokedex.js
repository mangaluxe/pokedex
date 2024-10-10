"use strict";

const pokedex = document.getElementById("pokedex");
const dexterBtn = document.getElementById("dexter-btn");

const getPkmn = document.getElementById("get-pkmn");

const soundOut = document.getElementById("sound-out");
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

const apiUrl = "https://pokeapi.co/api/v2/pokemon";
// const apiUrl = "https://tyradex.vercel.app/api/v1/pokemon";

const nbPokemonActuel = 1025;

let currentId = 1; // Id Pokémon actuel (pour les boutons Précédent/Suivant)



/**
 * Récupérer un pokémon par son nom ou son ID
 * @param {string|number} identifier : Nom ou ID du Pokémon
 */
const getPokemonByIdentifier = async (identifier) => {
    try {
        const response = await fetch(`${apiUrl}/${identifier}`);
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
 * Récupérer un pokémon
 */
const getPokemon = async () => {
    const input = searchInput.value.trim().toLowerCase();
    
    if (input === '') {
        await getRandomPokemon(); // Pokémon aléatoire si champ vide
    } 
    else {
        const id = parseInt(input);
        if (!isNaN(id) && id > 0 && id <= nbPokemonActuel) {
            await getPokemonByIdentifier(id); // Si l'entrée est un nombre, obtenir Pokémon par ID
        }
        else {
            await getPokemonByIdentifier(input); // Sinon obtenir Pokémon par nom
        }
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
    <audio id="sound-out" src="#"></audio>
    */

    soundOut.src = audio;
    soundOut.play();
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

    cries(pokemon.cries.latest);
}



/**
 * Pokémon suivant
 */
const getNextPokemon = () => {
    if (currentId < nbPokemonActuel) {
        currentId++;
    }
    else {
        currentId = 1; // Retour au 1er Pokémon si on atteint le dernier
    }
    getPokemonByIdentifier(currentId);
}

/**
 * Pokémon précédent
 */
const getPreviousPokemon = () => {
    if (currentId > 1) {
        currentId--;
    }
    else {
        currentId = nbPokemonActuel; // Aller au dernier Pokémon si on est au 1er
    }
    getPokemonByIdentifier(currentId);
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
        getPokemonByIdentifier(1)
    }
    if (e.key === "ArrowDown") {
        getPokemonByIdentifier(nbPokemonActuel);
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
        return;
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
// const getRandomPokemon = () => { // Si on veit mettre dans une variable et utiliser fonction fléchée
function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * nbPokemonActuel) + 1; // ID aléatoire entre 1 et nbPokemonActuel
    getPokemonByIdentifier(randomId);
}


window.addEventListener('devicemotion', (e) => { // Secousse du téléphone
    const acceleration = e.accelerationIncludingGravity;
    
    // Ignore les petits mouvements :
    if (acceleration.x > 15 || acceleration.y > 15 || acceleration.z > 15) {
        getRandomPokemon();
    }
});

// -----


if (getPkmn) {
    getPkmn.addEventListener("click", getPokemon);
}

if (pokemonPrevious) {
    pokemonPrevious.addEventListener("click", getPreviousPokemon);
}
if (pokemonNext) {
    pokemonNext.addEventListener("click", getNextPokemon);
}
if (pokemonUp) {
    pokemonUp.addEventListener("click", () => getPokemonByIdentifier(1));
}
if (pokemonDown) {
    pokemonDown.addEventListener("click", () => getPokemonByIdentifier(nbPokemonActuel));
}

if (dexterBtn) {
    dexterBtn.addEventListener("click", () => {
        soundOut.src = 'assets/audio/dexter.mp3';
        soundOut.play();
    });
}
