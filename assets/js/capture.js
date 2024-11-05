// "use strict";

const pokeball = document.getElementById("pokeball");
const pokemon = document.getElementById("pokemon");
const texte = document.getElementById("texte");
const audioOut = document.getElementById("audio-out");
const musicOnOff = document.getElementById("music-on-off")
const personnage = document.getElementById("personnage");
const soundThrow = document.getElementById("sound-throw");
const soundWobble = document.getElementById("sound-wobble");
let estLancee = false;
let musique = false;

// Pour animer personnage :
const persImg = [
    "assets/img/personnage2.gif",
    "assets/img/personnage3.gif",
    "assets/img/personnage4.gif",
    "assets/img/personnage5.gif"
];
let imageIndex = 0;
let animationInterval;

const apiUrl = "https://pokeapi.co/api/v2/pokemon";
let currentPokemonId; // Pour stocker l'ID du Pokémon actuel


/**
 * Pokémon aléatoire entre 1 et 151
 */
// const getRandomPokemonG1 = () => { // Si on veut mettre dans une variable et utiliser fonction fléchée
function getRandomPokemonG1() {
    return Math.floor(Math.random() * 151) + 1; // ID aléatoire entre 1 et 151
}


// Récupérer ou initialiser la liste des Pokémon capturés dans localStorage :
let pokemonList = JSON.parse(localStorage.getItem("pokemonList")) || [];


// Ajouter Pokémon de départ si "pokemonList" est vide dans localStorage :
if (pokemonList.length === 0) {
    pokemonList.push(25); // Ajouter Pikachu
    pokemonList.push(10); // Ajouter Chenipan
    localStorage.setItem("pokemonList", JSON.stringify(pokemonList));
}


/**
 * Ajouter un Pokémon capturé à la liste et enregistrer dans localStorage :
 * @param {number} id - ID du Pokémon capturé
 */
function addCapturedPokemon(id) {
    if (!pokemonList.includes(id)) { // Vérifier si le Pokémon est déjà dans la liste pour éviter doublon
        pokemonList.push(id);
        localStorage.setItem("pokemonList", JSON.stringify(pokemonList));

        // console.log("Pokémon capturé ajouté :", id);
        // console.log("Liste des Pokémon capturés :", pokemonList);
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
            // console.log(data.sprites.front_default);
            pokemon.src = data.sprites.front_default;
            let percent = Math.random() * 75; // Nb aléatoire entre 0% et 75%
            // console.log(percent);
            pokemon.style.left = percent + "%";
            
            // Afficher le message avec le nom du Pokémon :
            const pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            texte.textContent = `Un ${pokemonName} sauvage apparaît !`;
        })
        .catch(error => {
            console.error("Erreur récupération du Pokémon:", error);
        });
}


fetchRandomPokemon(); // Appel à la fonction au chargement


/**
 * Lancer Pokéball pour tenter de capturer le Pokémon
 * @param {number} posX - La position X calculée pour la Pokéball
 */
function lancerPokeball(posX) {
    if (!estLancee) {
        estLancee = true;
        soundThrow.play();

        // Démarrer l'animation du personnage :
        imageIndex = 0; // Réinitialiser l'index d'image
        animationInterval = setInterval(() => {
            personnage.src = persImg[imageIndex]; // Changer l'image du personnage
            imageIndex++;
            if (imageIndex >= persImg.length) {
                clearInterval(animationInterval); // Arrêter l'animation après la dernière image

                setTimeout(() => {
                    personnage.src = "assets/img/personnage.gif"; // Réinitialiser l'image du personnage
                }, 800); // Délai avant de revenir à l'image initiale
            }
        }, 100); // Changer d'image toutes les 100 ms
        
        pokeball.classList.add("thrown"); // Ajout de cette class durant la capture pour que le pokéball tourne
        pokeball.style.bottom = "75%";
        pokeball.style.left = posX + "%";
        
        setTimeout(() => {
            const pokemonRect = pokemon.getBoundingClientRect(); // Rectangle du Pokémon
            const pokeballRect = pokeball.getBoundingClientRect(); // Rectangle du Pokéball
            if (checkCollision(pokeballRect, pokemonRect)) {
                soundWobble.play();
                pokeball.classList.remove("thrown"); // Pour arrêter que le pokéball tourne
                pokeball.classList.add("pokeballshake"); // Ajout de la classe pour l'animation de la Pokéball
                addCapturedPokemon(currentPokemonId); // Utiliser l'ID actuel pour l'ajouter
                pokemon.style.display = "none";
                texte.textContent = "";

                // Message capturé après 6 sec :
                setTimeout(() => {
                    texte.textContent = "Pokémon capturé !";
                }, 6000);

                // Pokéball revient après 8 sec :
                setTimeout(() => {
                    pokeball.classList.remove("pokeballshake"); // Retirer la classe de la Pokéball
                    pokeball.classList.remove("thrown"); // Pour arrêter que le pokéball tourne
                    pokeball.style.bottom = "20px";
                    pokeball.style.left = "50%";
                    estLancee = false;

                    if (pokemon.style.display === "none") {
                        pokemon.style.display = "block";
                        fetchRandomPokemon(); // Afficher un nouveau Pokémon aléatoire
                    }
                }, 8000);

            }
            else {
                texte.textContent = "Vous avez raté !";

                // Pokéball revient après 1 sec
                setTimeout(() => {
                    pokeball.classList.remove("thrown"); // Pour arrêter de tourner
                    pokeball.style.bottom = "20px";
                    pokeball.style.left = "50%";
                    texte.textContent = "";
                    estLancee = false;
                }, 1000);
            }
        }, 600);
    }
}


/**
 * Vérifier les collisions
 * @param {DOMRect} rect1 - Rectangle (Pokéball)
 * @param {DOMRect} rect2 - Rectangle (Pokémon)
 * @returns {boolean} Vrai s'il y a collision, faux sinon
 */
function checkCollision(rect1, rect2) {
    return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}


// ----- Avec Gyroscope -----

// Écouteur d'événement pour détecter les mouvements (gyroscope/accéléromètre)
window.addEventListener("devicemotion", (e) => {
    const acc = e.acceleration;
    if (acc && Math.abs(acc.z) > 15) {
        lancerPokeball(50 + (acc.x * 2)); // Utiliser la position x finale
    }
});


// ----- Avec Souris -----

let isMouseDown = false;
let initialMouseY = 0;

// Écouteur d'événement pour détecter le début du clic de la souris :
window.addEventListener("mousedown", (e) => {
    if (!estLancee) {
        isMouseDown = true;
        initialMouseY = e.clientY; // Enregistrer la position initiale de la souris en Y
    }
});

// Écouteur d'événement pour détecter le relâchement du clic de la souris :
window.addEventListener("mouseup", (e) => {
    if (isMouseDown && !estLancee) {
        const distanceMoved = initialMouseY - e.clientY;
        if (distanceMoved > 120) {
            lancerPokeball((e.clientX / window.innerWidth) * 100); // Utiliser la position x finale
        }
    }
    isMouseDown = false; // Réinitialiser l'état
});


// ----- -----

/**
 * Lire/Arrêter musique
 */
 function toggleAudio() {
    // if (musique) {
    //     audioOut.pause();
    //     musique = false;
    // }
    // else {
    //     audioOut.play();
    //     musique = true;
    // }

    musique ? audioOut.pause() : audioOut.play(); // Avec opérateur ternaire
    musique = !musique;
}


// ----- Demande de permission -----

if (typeof DeviceMotionEvent.requestPermission === "function") {
    document.body.addEventListener("click", () => {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === "granted") { // Permission ok
                    texte.innerHTML = "Lancez votre pokéball !";
                    toggleAudio();
                }
                else {
                    texte.innerHTML = "Fonction gyroscope bloquée";
                }
            })
            .catch(console.error);
    });
}
else {
    musicOnOff.addEventListener("click", () => {
        toggleAudio();
    });
}