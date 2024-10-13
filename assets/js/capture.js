"use strict";

const pokeball = document.getElementById('pokeball');
const pokemon = document.getElementById('pokemon');
const output = document.getElementById('output');
const audioOut = document.getElementById('audio-out');
const personnage = document.getElementById('personnage');
let estLancee = false;
let isPlaying = false;

const apiUrl = "https://pokeapi.co/api/v2/pokemon";
let currentPokemonId; // Pour stocker l'ID du Pokémon actuel


/**
 * Pokémon aléatoire entre 1 et 151
 */
// const getRandomPokemonG1 = () => { // Si on veut mettre dans une variable et utiliser fonction fléchée
function getRandomPokemonG1() {
    return Math.floor(Math.random() * 151) + 1; // ID aléatoire entre 1 et 151
}


// Récupérer ou initialiser la liste des Pokémon capturés dans localStorage
let pokemonList = JSON.parse(localStorage.getItem('pokemonList')) || [];


/**
 * Ajouter un Pokémon capturé à la liste et enregistrer dans localStorage
 * @param {number} id - ID du Pokémon capturé
 */
function addCapturedPokemon(id) {
    if (!pokemonList.includes(id)) { // Vérifier si le Pokémon est déjà dans la liste pour éviter doublon
        pokemonList.push(id);
        localStorage.setItem('pokemonList', JSON.stringify(pokemonList));
    }
}


/**
 * Récupère et affiche un Pokémon aléatoire
 */
function fetchRandomPokemon() {
    currentPokemonId = getRandomPokemonG1(); // ID du pokémon actuel choisi au hasard

    fetch(`${apiUrl}/${currentPokemonId}`)
        .then(response => response.json())
        .then(data => {
            const pokemonSprite = data.sprites.front_default;
            pokemon.style.backgroundImage = `url('${pokemonSprite}')`;
            pokemon.style.display = 'block';
            pokemon.style.width = '100px';
            pokemon.style.height = '100px';
            pokemon.style.left = `${Math.random() * 80 + 10}%`;
            
            const pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            output.textContent = `Un ${pokemonName} sauvage apparaît !`;
        })
        .catch(error => {
            console.error("Erreur récupération du Pokémon:", error);
        });
}


fetchRandomPokemon(); // Appel à la fonction au chargement


/**
 * Lancer Pokéball pour tenter de capturer le Pokémon
 * @param {Object} acceleration - L'objet contenant les données d'accélération
 * @param {number} acceleration.x - L'accélération sur l'axe X
 * @param {number} acceleration.z - L'accélération sur l'axe Z
 */
function lancerPokeball(acceleration) {
    if (!estLancee && Math.abs(acceleration.z) > 15) {
        estLancee = true;
        const pokeballRect = pokeball.getBoundingClientRect();
        const pokemonRect = pokemon.getBoundingClientRect();
        
        pokeball.classList.add('thrown'); // Ajout de cette class durant la capture pour que le pokéball tourne
        pokeball.style.bottom = '80%';
        pokeball.style.left = `${50 + (acceleration.x * 2)}%`;
        
        // setTimeout(function() { // Sans fonction flechée
        setTimeout(() => {
            const newPokeballRect = pokeball.getBoundingClientRect(); // getBoundingClientRect() renvoie la taille d'un élément et sa position par rapport au viewport
            if (checkCollision(newPokeballRect, pokemonRect)) {
                output.textContent = "Pokémon capturé !";
                addCapturedPokemon(currentPokemonId); // Utiliser l'ID actuel pour l'ajouter
                pokemon.style.display = 'none';
            }
            else {
                output.textContent = "Vous avez raté !";
            }

            setTimeout(() => {
                pokeball.classList.remove('thrown'); // Pour arrêter de tourner
                pokeball.style.bottom = '20px';
                pokeball.style.left = '50%';
                estLancee = false;
                if (pokemon.style.display === 'none') {
                    pokemon.style.display = 'block';
                    pokemon.style.left = `${Math.random() * 80 + 10}%`;
                    fetchRandomPokemon(); // Afficher un nouveau Pokémon aléatoire
                }
            }, 1000); // Pokéball revient après 1 sec
        }, 600); // Message pour dire capturé ou raté
    }
}


/**
 * Vérifier les collisions
 * @param {DOMRect} rect1 - Rectangle 1
 * @param {DOMRect} rect2 - Rectangle 2
 * @returns {boolean} true si collision, false sinon
 */
function checkCollision(rect1, rect2) {
    return !(rect1.right < rect2.left ||  rect1.left > rect2.right ||  rect1.bottom < rect2.top ||  rect1.top > rect2.bottom);
}


// Écouteur d'événement pour détecter les mouvements (gyroscope/accéléromètre)
window.addEventListener("devicemotion", (e) => {
    const acc = e.acceleration;
    if (acc) {
        lancerPokeball(acc);
    }
});


/**
 * Lire/Arrêter musique
 */
 function toggleAudio() {
    if (isPlaying) {
        audioOut.pause();
        isPlaying = false;
    }
    else {
        audioOut.play();
        isPlaying = true;
    }
}

// Demande de permission pour iOS
if (typeof DeviceMotionEvent.requestPermission === "function") {
    document.body.addEventListener("click", function() {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === "granted") { // Permission ok
                    output.innerHTML = "Lancez votre pokéball !";
                    toggleAudio();
                }
                else {
                    output.innerHTML = "Fonction gyroscope bloquée";
                }
            })
            .catch(console.error);
    });
}
else {
    document.body.addEventListener("click", function() {
        toggleAudio();
    });
}