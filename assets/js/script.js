const body = document.querySelector("body");


// ==================== Menu Burger ====================

const openMenuburger = document.getElementById("open_menuburger");
const myOverlay = document.getElementById("my_overlay");

function functBurger() {
    body.classList.contains("menu-active") ? body.classList.remove("menu-active") : body.classList.add("menu-active");
}

if (openMenuburger) {
    openMenuburger.addEventListener("click", functBurger);
}

if (myOverlay) {
    // Fermer en cliquant partout ailleurs :
    body.addEventListener("click", function(e) {
        if (e.target === myOverlay) {
            body.classList.remove("menu-active");
        }
    });
}


// ==================== Sous-menu actif (mobile) ====================

let i;

// Sur mobile, au lieu de hover pour faire apparaitre le sous-menu, on va utiliser le clic. Au clic, on ajoute une class :

function activeSubMenu() {

    if (this.parentNode.parentNode.classList.contains("active")) {
        this.parentNode.parentNode.classList.remove("active");
    }
    else {
        this.parentNode.parentNode.classList.add("active");
    }

}

const openSubmenus = document.querySelectorAll(".open-submenu");
for (i = 0; i < openSubmenus.length; i++) {
    openSubmenus[i].addEventListener("click", activeSubMenu);
}


// ==================== Upload fichier par glisser-déposer ====================

const inputFileContainer = document.getElementById("file_container"); // 💡 Le glisser-déposer ne marche que sur un parent
const inputFile = document.querySelector("#file_container input[type=file]");

if (inputFileContainer) { /* On vérifie qu'il existe */

    // dragover : Quand l'élément glissé survole la cible de dépôt :
    inputFileContainer.addEventListener("dragover", function (e) {
        e.preventDefault(); // Annule l'interdiction de dépot (drop)
    });

    // drop : Quand l'élément glissé est déposé sur la cible de dépôt :
    inputFileContainer.addEventListener("drop", function (e) {
        e.preventDefault();
        let file = e.dataTransfer.files; // dataTransfer contient les données glissées au cours d'un glisser-déposer. Avec eslint, utilisez ça : const { files } = e.dataTransfer;
        console.log(file); // file[0].name permet d'obtenir le nom du fichier. file[0].size le poids
        inputFile.files = file; // Pour que l'upload marche ensuite en php
    });

}


// ==================== Connexion Modal ====================

const connectModal = document.getElementById("connect-modal");

const openConnect = document.querySelectorAll(".open-connect");
const closeConnect = document.querySelector(".close-connect");

if (connectModal) { // <- Une condition qui ne sert qu'à vérifier que ces éléments sont présents sur une page (sinon le script bloque les pages où il n'y a pas ces éléments)
    // On fait une boucle parce qu'il y a plusieurs boutons "Ouvrir"
    for (i = 0; i < openConnect.length; i++) {
        openConnect[i].addEventListener("click", function () {
            body.classList.add("modal-connect-actif");
        });
    }

    closeConnect.addEventListener("click", function () {
        body.classList.remove("modal-connect-actif");
    });

    // Fermer en cliquant partout ailleurs :
    body.addEventListener("click", function (e) {
        if (e.target === connectModal) {
            body.classList.remove("modal-connect-actif");
        }
    });
}


// ==================== Profil ====================

const profilDrop = document.getElementById("profil-drop");
const profilOverlay = document.querySelector(".profil-overlay"); // Une div invisible qui nous sert à fermer le profil quand on clique dessus

if (profilDrop) {
    // ----- Ouvrir/Fermer profil -----
    profilDrop.addEventListener("click", function () {
        // this.parentNode.classList.toggle("open"); // toggle réunit add et remove

        if (this.parentNode.classList.contains("open")) {
            this.parentNode.classList.remove("open");
        }
        else {
            this.parentNode.classList.add("open");
        }
    });

    // ----- fermer le profil en cliquant ailleurs -----
    profilOverlay.addEventListener("click", function () {
        this.parentNode.classList.remove("open");
    });
    
}


// ==================== Search ====================

const searchContainer = document.querySelector(".search-container");

const search = document.getElementById("search");
const closeSearch = document.querySelector(".close-search");

if (searchContainer) {
    search.addEventListener("click", function () {
        body.classList.add("popup-search-actif");
        document.getElementById("recherche").focus(); // Focus sur ce champ dès l'ouverture du modal
    });

    closeSearch.addEventListener("click", function () {
        body.classList.remove("popup-search-actif");
    });

    // Fermer en cliquant partout ailleurs :
    body.addEventListener("click", function (e) {
        if (e.target === searchContainer) {
            body.classList.remove("popup-search-actif");
        }
    });
}


// ==================== To Top ====================

const toTop = document.querySelector(".totop");
let st;

if (toTop) {

    // ----- Faire apparaître le bouton -----

    function buttonTop() {

        // st = document.documentElement.scrollTop;
        st = document.documentElement.scrollTop || document.body.scrollTop; // document.body.scrollTop c'est pour la compatibilité IE/Edge

        // console.log(st);

        if (st >= 300) {
            toTop.classList.add("visible");
        }
        if (st < 300) {
            toTop.classList.remove("visible");
        }

    }

    // window.addEventListener("scroll", buttonTop); // window.addEventListener() ne marche pas sur Safari
    document.addEventListener("scroll", buttonTop);


    // ----- Retour en haut -----

    toTop.addEventListener("click", function () {
        window.scrollTo(0, 0); // Retour en haut (mettre scroll-behavior:smooth dans le css pour un défilement doux). Pour aller en bas : window.scrollTo(0, document.body.scrollHeight);
        // document.documentElement.scrollTop = 0; // Retour en haut (autre méthode)
    });

}