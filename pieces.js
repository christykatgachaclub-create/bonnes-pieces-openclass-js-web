
import {lister_avis, envoyer_avis, afficherGraphiqueAvis, affiche_com_piece_dispo} from "/avis.js";

envoyer_avis()

//Bloc de récupération à partir du localStorage
let pieces = window.localStorage.getItem("pieces");
if(pieces == null) {
    const reponse = await fetch(`http://localhost:8081/pieces/`);
    pieces = await reponse.json();
    //Transformation en JSON Pour le stockage dans le localStorage
    const valeurpieces = JSON.stringify(pieces);
    window.localStorage.setItem("pieces", valeurpieces);
} else {
    pieces = JSON.parse(pieces);
}

//Bloc pour supprimer les éléments du localstorage
const bouton_reset = document.querySelector(".btn_maj");
bouton_reset.addEventListener("click", function(){
    window.localStorage.removeItem("pieces");
    window.localStorage.removeItem("avis");
});

function generer_pieces(pieces){
    for(let i=0; i<pieces.length; i++){
        const element_piece = document.createElement("article");
        
        //image
        const image_piece = document.createElement("img");
        image_piece.src = pieces[i].image;
        element_piece.appendChild(image_piece);
        //nom
        const nom_piece = document.createElement("h2");
        nom_piece.innerText = pieces[i].nom;
        element_piece.appendChild(nom_piece);
        //prix
        const prix_piece = document.createElement("p");
        prix_piece.innerText = `Prix: ${pieces[i].prix} ${pieces[i].prix < 30 ? "£":"£££"}`;
        element_piece.appendChild(prix_piece);
        //description 
        const description_piece = document.createElement("p");
        description_piece.innerText = pieces[i].description ?? "( )";
        element_piece.appendChild(description_piece);
        //catégorie
        const categorie_piece = document.createElement("p");
        categorie_piece.innerText = pieces[i].categorie ??"(non précisé)";
        element_piece.appendChild(categorie_piece);
        //disponibilité
        const disponibilite_piece = document.createElement ("p");
        disponibilite_piece.innerText = `${pieces[i].disponibilite = true ? "En stock":"Rupture de Stock"}`;
        element_piece.appendChild(disponibilite_piece);
        //Zone avis utilisateur
        const zone_avis = document.createElement("div");
        zone_avis.setAttribute('class','rouge');
        zone_avis.setAttribute('id','zone_avis');
        element_piece.appendChild(zone_avis);
        //avis utilisateur
        const avis_bouton = document.createElement("button");
        avis_bouton.dataset.id = pieces[i].id;
        avis_bouton.textContent = "Afficher les avis";
        zone_avis.appendChild(avis_bouton);

        const fiche_piece = document.querySelector(".fiches");
        fiche_piece.appendChild(element_piece); 

        avis_bouton.addEventListener('click',function(event){
            lister_avis();
        });     
    }   
}
generer_pieces(pieces);



{ //Bloc pour l'ordre croissant et decroissant
    const bouton_trier = document.querySelector(".btn-trier");
    bouton_trier.addEventListener("click", function(){
        const pieces_ordonnees = Array.from(pieces);
        pieces_ordonnees.sort(function(a,b){
            return a.prix - b.prix;
        });
        console.log(pieces_ordonnees);
        document.querySelector(".fiches").innerHTML="";
        generer_pieces(pieces_ordonnees);
    });

    const bouton_trier_decroissant = document.querySelector(".btn-decroissant");
    bouton_trier_decroissant.addEventListener("click", function(){
        const pieces_ordonnees_decroissant = Array.from(pieces);
        pieces_ordonnees_decroissant.sort(function(a,b){
            return b.prix - a.prix;
        });
        console.log(pieces_ordonnees_decroissant);
        document.querySelector(".fiches").innerHTML="";
        generer_pieces(pieces_ordonnees_decroissant)
    });
}

{ //Bloc pour filtrer les pieces sans description et dont le prix est <35
    const x = document.getElementById("my_range");
    x.addEventListener('input',function(){
        const pieces_filtrees = pieces.filter(function(piece){
            return piece.prix <= x.value;
            console.log(pieces_filtrees);
        });
        document.querySelector(".fiches").innerHTML="";
        generer_pieces(pieces_filtrees);

    })

    const bouton_filtrer_no_description = document.querySelector(".btn-nodesc");
    bouton_filtrer_no_description.addEventListener("click",function(){
        const piece_no_description = pieces.filter(function(piece){
            return piece.description != null;
        });
        console.log(piece_no_description);
        document.querySelector(".fiches").innerHTML="";
        generer_pieces(piece_no_description)
    });
}

await afficherGraphiqueAvis();
await affiche_com_piece_dispo()




