// "use strict";

const pokedex = document.getElementById("pokedex");
const dexterBtn = document.getElementById("dexter-btn");

const formPkmn = document.getElementById("form-pkmn");

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


// Récupérer ou initialiser la liste des Pokémon capturés dans localStorage
let pokemonList = JSON.parse(localStorage.getItem('pokemonList')) || [];

// Ajouter Pokémon de départ si "pokemonList" est vide
if (pokemonList.length === 0) {
    pokemonList.push(25); // Ajouter Pikachu
    // pokemonList.push(10); // Ajouter Chenipan
    localStorage.setItem('pokemonList', JSON.stringify(pokemonList));
}


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
        removeShowlist(); // Revenir au mode "Recherche" si on est sur la liste capturés
    }
    catch (error) {
        console.error("Erreur: ", error);
    }
}



/**
 * Récupérer un pokémon
 */
const getPokemon = () => {
    const input = searchInput.value.trim().toLowerCase();
    
    if (input === '') {
        getRandomPokemon(); // Pokémon aléatoire si champ vide
    } 
    else {
        const id = parseInt(input);
        if (!isNaN(id) && id > 0 && id <= nbPokemonActuel) {
            getPokemonByIdentifier(id); // Si l'entrée est un nombre, obtenir Pokémon par ID
        }
        else {
            getPokemonByIdentifier(input); // Sinon obtenir Pokémon par nom
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
 * Revenir au mode "Recherche"
 */
function removeShowlist() {
    pokedex.classList.remove('showlist');
}

/**
 * Passer du mode "Recherche" à "Liste capturés", ou inversement
 */
function changeMode() {
    if (pokedex.classList.contains('showlist')) {
        // pokedex.classList.remove('showlist');
        removeShowlist();
    }
    else {
        pokedex.classList.add('showlist');

        soundOut.src = 'assets/audio/dexter.mp3';
        soundOut.play();
    }
}


if (dexterBtn) {
    dexterBtn.addEventListener('click', changeMode);
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

/**
 * Pokémon aléatoire
 */
// const getRandomPokemon = () => { // Si on veut mettre dans une variable et utiliser fonction fléchée
function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * nbPokemonActuel) + 1; // ID aléatoire entre 1 et nbPokemonActuel
    getPokemonByIdentifier(randomId);
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
    if (Math.abs(diff) < 0.3) {
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


/**
 * Afficher liste de Pokémon capturés
 */
const afficherListeCaptures = async () => {
    const capturedPokemonList = document.getElementById('captured-pokemon-list');
    capturedPokemonList.innerHTML = ''; // Vider la liste existante

    const pokemonCapturedIds = JSON.parse(localStorage.getItem('pokemonList')) || [];

    if (pokemonCapturedIds.length === 0) {
        capturedPokemonList.innerHTML = '<li>Aucun Pokémon capturé.</li>';
    }
    else {
        document.getElementById('total-captured').innerText = pokemonCapturedIds.length;

        for (const id of pokemonCapturedIds) {
            try {
                const response = await fetch(`${apiUrl}/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    const item = document.createElement('li');

                    item.innerHTML = `
                        <span class="pokemon-link" data-id="${id}">
                            <img src="${data.sprites.front_default}" alt="${data.name}">
                            ${capitalizeFirstLetter(data.name)} (id: ${id})
                        </span>
                    `;
                    capturedPokemonList.appendChild(item);

                    item.querySelector('.pokemon-link').addEventListener('click', () => getPokemonByIdentifier(id));
                }
            }
            catch (error) {
                console.error(`Erreur récupération Pokémon ${id}:`, error);
            }
        }
    }
};


afficherListeCaptures(); // Afficher liste de pokémon attrapés au chargement



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

if (formPkmn) { // Clic sur bouton Recherche
    formPkmn.addEventListener('submit', function(e) {
        e.preventDefault(); // Empêche la soumission du formulaire

        getPokemon(); // Appelle la fonction pour récupérer un Pokémon
    });
}
