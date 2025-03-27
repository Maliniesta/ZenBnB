// Charger les données du fichier JSON
fetch("zenbnb(1).json")
    .then(function (response) {
        if (!response.ok) {
            throw new Error("Erreur lors du chargement des données.");
        }
        return response.json();
    })
    .then(function (data) {
        const economique = document.getElementById('eco');
        const moyen = document.getElementById('moyen');
        const luxe = document.getElementById('luxe');

        data.listings.forEach(listing => {
            const div = document.createElement("div");
            let html = `
            <div class="card">
                <h2>${listing.title}</h2>
                <img src="${listing.image}" alt="${listing.title}" /> 
                <p><strong>Ville :</strong> ${listing.city}</p>
                <p><strong>Prix :</strong> ${listing.price_per_night}€</p>
                <p><strong>Note :</strong> ${listing.rating}</p>
                <button class="reserve-btn">Réserver</button>
            </div>
        `;
        

            if (listing.price_per_night < 80) {
                div.innerHTML = html;
                economique.appendChild(div);
            } else if (listing.price_per_night >= 80 && listing.price_per_night <= 120) {
                div.innerHTML = html;
                moyen.appendChild(div);
            } else if (listing.price_per_night > 120) {
                div.innerHTML = html;
                luxe.appendChild(div);
            }
        });
    })
    .catch(function (error) {
        console.error(error);
    });

// Gestion de la checkbox Petit-déjeuner
const petitDejCheckbox = document.getElementById('petitDej');
const dietOptions = document.getElementById('diet-options'); // Conteneur des options de régime alimentaire

function toggleDietOptions() {
    if (petitDejCheckbox.checked) {
        dietOptions.style.display = 'block'; // Afficher
    } else {
        dietOptions.style.display = 'none'; // Masquer
    }
}

petitDejCheckbox.addEventListener('change', toggleDietOptions);
toggleDietOptions(); // Appeler au chargement pour état initial

// Gestion du formulaire
const form = document.getElementById('form');
const result = document.getElementById('result');

// Écouter l'événement "submit" du formulaire
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    // Récupérer les valeurs des champs
    const firstname = document.getElementById('firstname').value.trim();
    const address = document.getElementById('address').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    const logementMaison = document.getElementById('maison');
    const logementAppartement = document.getElementById('appartement');
    const optionPiscine = document.getElementById('piscine');
    const optionJardin = document.getElementById('jardin');
    const nombrePersonnes = document.getElementById('personnes').value.trim();
    const dateArrivee = document.getElementById('dateArrivé').value.trim();
    const dateDepart = document.getElementById('dateDépart').value.trim();
    const chauffeur = document.getElementById('chauffeur');
    const guide = document.getElementById('guide');

    const chauffeurPrix = 11;
    const dejPrix = 15;
    const guidePrix = 20;

    // Validation des champs
    const erreur = [];
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9\s-/]{10,14}$/;

    if (!emailRegex.test(email)) erreur.push("Email incorrect.");
    if (!phoneRegex.test(phone)) erreur.push("Le numéro de téléphone est invalide.");
    if (firstname.length < 2 || firstname.length > 30) erreur.push("Prénom incorrect.");
    if (address.length < 5) erreur.push("Adresse trop courte.");
    if (!logementMaison.checked && !logementAppartement.checked) erreur.push("Type de logement non sélectionné.");
    if (nombrePersonnes < 1) erreur.push("Nombre de personnes invalide.");
    if (!dateArrivee) erreur.push("Date d'arrivée manquante.");
    if (!dateDepart) erreur.push("Date de départ manquante.");

    let dureeSejour = 0;

    if (dateArrivee && dateDepart) {
        const arriveeTimestamp = new Date(dateArrivee).getTime();
        const departTimestamp = new Date(dateDepart).getTime();

        if (departTimestamp <= arriveeTimestamp) {
            erreur.push("La date de départ doit être après la date d'arrivée.");
        } else {
            dureeSejour = (departTimestamp - arriveeTimestamp) / (1000 * 60 * 60 * 24); // Convertir en jours
        }
    }

    // Affichage des erreurs
    if (erreur.length > 0) {
        result.innerHTML = `<p class="error">${erreur.join('<br>')}</p>`;
        return;
    }

    // Calcul des coûts
    let totalPrix = 0;
    if (chauffeur.checked) totalPrix += chauffeurPrix * dureeSejour;
    if (petitDejCheckbox.checked) totalPrix += dejPrix * dureeSejour;
    if (guide.checked) totalPrix += guidePrix * dureeSejour;

    // Afficher les résultats
    result.innerHTML = `
    <div class="succes">
        <h3>Formulaire envoyé !</h3>
        Voici un récapitulatif :
        <p>Prénom : ${firstname}</p>
        <p>Adresse : ${address}</p>
        <p>Email : ${email}</p>
        <p>Téléphone : ${phone}</p>
        <p>Type de logement : ${logementMaison.checked ? 'Maison' : 'Appartement'}</p>
        <p>Option spécifique : ${optionPiscine.checked ? 'Piscine' : optionJardin.checked ? 'Jardin' : 'Aucune'}</p>
        <p>Nombre de personnes : ${nombrePersonnes}</p>
        <p>Durée du séjour : ${dureeSejour} jour(s)</p>
        <p>Services supplémentaires :</p>
        <ul>
            <li>Chauffeur : ${chauffeur.checked ? `Oui (${chauffeurPrix}€ x ${dureeSejour} jour(s) = ${chauffeurPrix * dureeSejour}€)` : 'Non'}</li>
            <li>Petit-déjeuner : ${petitDejCheckbox.checked ? `Oui (${dejPrix}€ x ${dureeSejour} jour(s) = ${dejPrix * dureeSejour}€)` : 'Non'}</li>
            <li>Guide : ${guide.checked ? `Oui (${guidePrix}€ x ${dureeSejour} jour(s) = ${guidePrix * dureeSejour}€)` : 'Non'}</li>
        </ul>
        <p>Total : ${totalPrix}€</p>
        </div>
    `;

    form.reset();
});



