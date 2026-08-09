export function lister_avis(){
    const bouton_avis_piece = document.querySelectorAll(".fiches article button");

    for (let i=0; i<bouton_avis_piece.length; i++){
        bouton_avis_piece[i].addEventListener("click", async function (event) {
            const id = event.target.dataset.id;
            console.log(id)
            //let avis = window.localStorage.getItem("avis");
            //if( avis == null){
                const reponse = await fetch("http://localhost:8081/pieces/" + id + "/avis");
                const avis = await reponse.json();
                window.localStorage.setItem("avis", JSON.stringify(avis));
           // } else {
           //     avis = JSON.parse(avis)
            //}
            const zone_piece = await event.target.parentElement;
            afficher_avis(zone_piece, avis);     
        });        
    }  
}

export function afficher_avis(zone_piece, avis){
    const avis_piece = document.createElement("p");
    for(let i=0; i<avis.length;i++){
        avis_piece.innerHTML += `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire} <br>`;
    }
    zone_piece.appendChild(avis_piece); 
}

export function envoyer_avis(){
    const formulaire_avis = document.querySelector(".formulaire_avis");
    formulaire_avis.addEventListener("submit", async function (event){
        console.log("hey");
        event.preventDefault();
        const avis = {
            pieceId: parseInt(event.target.querySelector("[name=piece_id]").value),
            utilisateur: event.target.querySelector("[name=utilisateur]").value,
            commentaire: event.target.querySelector("[name=commentaire]").value,
            nbEtoiles: parseInt(event.target.querySelector("[name=nbEtoiles]").value)
        };

        const avis_for_json = JSON.stringify(avis);
        fetch("http://localhost:8081/avis", {
            method:"POST", 
            headers: {"Content-Type" : "application/json"},
            body: avis_for_json
        });
    });
}

export async function afficherGraphiqueAvis(){
    //Calcul du nombre d'avis 
    const avis = await fetch("http://localhost:8081/avis").then(avis=>avis.json());
    const nb_commentaires =[0, 0, 0, 0, 0];
    for (let commentaire of avis) {
        nb_commentaires[commentaire.nbEtoiles - 1]++;
    }
    //Nombre d'étoile affichées
    const labels = ["5","4","3","2","1"];
    //Données et personnalisation du graphique
    const data = {
        labels: labels,
        datasets: [{
            label: "Etoiles attribuées",
            data: nb_commentaires.reverse(),
            backgroundColor: "rgba(255, 230, 0, 1)", // couleur jaune
        }],
    }
    const config ={
        type: "bar",
        data: data,
        options:{
            indexAxis:"y",
        },
    }
    const graphiqueAvis = new Chart(
        document.querySelector("#graphique-avis"),
        config,
    )

}
export async function affiche_com_piece_dispo(){
     const pieces = await fetch ("http://localhost:8081/pieces").then(pieces=>pieces.json());
    const avis = await fetch("http://localhost:8081/avis").then(avis=>avis.json());
    const labels = ['Disponible','Indisponible'];
    let nb_commentaires_dispos = 0;
    let nb_commentaires_indispos = 0;
    const piece_dispo = [];
    for (let piece of pieces ){
        if(piece.disponibilite==true){
            piece_dispo.push(piece.id);
        }
    }  
    console.log(piece_dispo);
    for (let commentaire of avis){
        if (piece_dispo.includes(commentaire.pieceId)) {
            nb_commentaires_dispos ++;
        } else {
            nb_commentaires_indispos ++;
        }
    } 
    console.log(nb_commentaires_dispos);
    console.log(nb_commentaires_indispos);

    //Données et personnalisation du graphique
    const data = {
        labels: labels,
        datasets: [{
            label: "nombre d'avis pièce disponible et indisponible",
            data: [nb_commentaires_dispos, nb_commentaires_indispos],
            backgroundColor: "rgb(255, 0, 0)",
        }],
    }
    const config ={
        type: "bar",
        data: data,
        options:{
            indexAxis:"x",
        },
    }
    const graphiqueAvis = new Chart(
        document.querySelector("#graphique-com-pieces-dispo-indispo"),
        config,
    )


}