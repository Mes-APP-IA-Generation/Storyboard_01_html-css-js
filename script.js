// ⥥ ---------- COULEURS PASTILLES ---------- ⥥ 

const focalColors = ['#FF595E', '#FF924C', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93'];
let boxCounter = 1;

// ⥥ ---------- STORYBOARD CASES ---------- ⥥ 


function getUniqueTitle(baseTitle) {
    let title = baseTitle;
    let counter = 1;
    while (document.querySelector(`input[value="${title}"]`)) {
        title = `${baseTitle}_${counter}`;
        counter++;
    }
    return title;
}
// ⥥ ---------- FONCTION DE SAUVEGARDE  ---------- ⥥ 

// ⥥  FONCTION DE SAUVEGARDE JSON  ⥥ 
// ⥥ ---------- ! A OUVRIR ! ---------- ⥥ 
function downloadJSON() {
    // Récupérer le titre principal
    const title = document.querySelector('h1').textContent || 'Storyboard';
    const subtitle = document.querySelector('#storyboardSubtitle').value || '';
    const totalDuration = document.querySelector('#totalDuration').textContent || '';

    // Récupérer les informations des plans
    const boxes = document.querySelectorAll('.storyboard-box');
    const storyboardPlans = Array.from(boxes).map((box, index) => {
        return {
            planNumber: index + 1,
            title: box.querySelector('.box-title input').value || `Plan ${index + 1}`,
            duration: box.querySelector('.duration-input')?.value || 'Non spécifiée',
            description: box.querySelector('textarea')?.value || 'Aucune description',
            shotType: box.querySelector('.shot-type')?.value || 'Non spécifié',
            cameraType: box.querySelector('.camera-type')?.value || 'Non spécifié',
            tags: box.querySelector('#tagSelect')?.value || 'Aucun tag',
            focal: box.querySelector('.focal-input')?.value || 'Non spécifié',
            videoReference: box.querySelector('.video-reference-container')?.textContent || 'Aucune vidéo',
            imageURL: box.querySelector('.image-container img')?.src || 'Aucune image'
        };
    });

    // Construire la structure JSON
    const storyboardData = {
        title: title,
        subtitle: subtitle,
        totalDuration: totalDuration,
        plans: storyboardPlans
    };

    // Générer le fichier JSON
    const blob = new Blob([JSON.stringify(storyboardData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'storyboard.json';
    link.click();
    URL.revokeObjectURL(url); // Nettoyer l'URL après téléchargement
}

// ⥥ FONCTION DE SAUVEGARDE PDF  ⥥ 
// ⥥ ---------- ! A OUVRIR ! ---------- ⥥ 
function generatePDF() {
    const doc = new jsPDF(); // Initialise un document PDF

    // Récupérer le titre principal
    const title = document.querySelector('h1').textContent || 'Storyboard';
    const subtitle = document.querySelector('#storyboardSubtitle').value || '';

    // Récupérer la durée totale
    const totalDuration = document.querySelector('#totalDuration').textContent || '';

    // Ajouter le titre principal et la durée totale au PDF
    doc.setFontSize(16);
    doc.text(title, 10, 10); // Ajouter le titre principal
    doc.setFontSize(12);
    doc.text(`Sous-titre : ${subtitle}`, 10, 20);
    doc.text(totalDuration, 10, 30); // Ajouter la durée totale

    let y = 40; // Position initiale pour les plans

    // Récupérer les informations de chaque plan
    const boxes = document.querySelectorAll('.storyboard-box');
    boxes.forEach((box, index) => {
        const boxTitle = box.querySelector('.box-title input').value || `Plan ${index + 1}`;
        const duration = box.querySelector('.duration-input')?.value || 'Non spécifiée';
        const description = box.querySelector('textarea')?.value || 'Aucune description';
        const shotType = box.querySelector('.shot-type')?.value || 'Non spécifié';
        const cameraType = box.querySelector('.camera-type')?.value || 'Non spécifié';
        const tags = box.querySelector('#tagSelect')?.value || 'Aucun tag';
        const focal = box.querySelector('.focal-input')?.value || 'Non spécifié';
        const videoReference = box.querySelector('.video-reference-container')?.textContent || 'Aucune vidéo';

        // Ajouter les informations de chaque plan au PDF
        doc.setFontSize(12);
        doc.text(`Plan ${index + 1}`, 10, y);
        doc.text(`Titre : ${boxTitle}`, 10, y + 10);
        doc.text(`Durée : ${duration} secondes`, 10, y + 20);
        doc.text(`Description : ${description}`, 10, y + 30);
        doc.text(`Type de plan : ${shotType}`, 10, y + 40);
        doc.text(`Type de caméra : ${cameraType}`, 10, y + 50);
        doc.text(`Tags : ${tags}`, 10, y + 60);
        doc.text(`Focale : ${focal} mm`, 10, y + 70);
        doc.text(`Vidéo de référence : ${videoReference}`, 10, y + 80);

        y += 100; // Ajouter un espace pour le prochain plan

        // Si on dépasse la page, créer une nouvelle page
        if (y > 270) {
            doc.addPage();
            y = 10; // Réinitialiser la position pour la nouvelle page
        }
    });

    // Télécharger le fichier PDF
    doc.save('storyboard.pdf');
}


// ⥥ ---------- ! A OUVRIR ! ---------- ⥥ 
function addStoryboardBox() {
    const container = document.getElementById('storyboardContainer');
    const box = document.createElement('div');
    box.className = 'storyboard-box';
    box.setAttribute('data-box-id', boxCounter);
    box.setAttribute('draggable', 'true'); // Rendre la case déplaçable

    box.innerHTML = `

<!-- ----------⥥ TITRE DES CASES (value=) ⥥---------- -->

            <div class="box-title">
            <input type="text" value="Plan_0${boxCounter}" onchange="updateBoxTitle(this)">

                        <!-- Bouton de duplication -->
            <button class="duplicate-box" onclick="duplicateBox(this)" style="background: #1cadeb; color: #000000; font-weight: bold;">Dupliquer →</button>

                         <!-- SUPPRIME KES CASES -->
            <button onclick="deleteBox(this)" style="background: #ff4444;">✗</button>
            


            </div>

            <!-- AJOUTE UN TAG -->
        <select id="tagSelect" onchange="addTag(this)">
            <option value="">Sélectionner un tag...</option>
            <option value="Extérieur">Extérieur</option>
            <option value="Intérieur">Intérieur</option>
            <option value="Studio">Studio</option>
        </select>

        
        
        <div class="image-container">
            <img style="display: none;">
        </div>
        <input type="file" class="image-input" onchange="handleImageUpload(this)" accept="image/*">
        <input type="text" placeholder="URL de l'image" onchange="handleImageURL(this)">

<!-- ----------⥥ SHOT TYPE ⥥---------- -->

        <select class="shot-type">
            <option>Macro</option>
            <option>Serré</option>
            <option>Moyen</option>
            <option>Large</option>
            <option>360</option>
        </select>

<!-- ----------⥥ CAMERA TYPE ⥥---------- -->

        <select class="camera-type">
            <option>Canon 77D</option>
            <option>Canon 5D</option>
            <option>Lumix S5M2</option>
            <option>GoPro</option>
            <option>Phone</option>
        </select>


<!-- ----------⥥ FOCAL PASSTILES ⥥---------- -->

<div style="display: flex; align-items: center; gap: 10px;">
    <!-- Pastille de couleur -->
    <span class="focal-color" onclick="toggleColorMenu(this)"></span>
    
    <!-- Champ Focale -->
    <input type="text" min="10" max="200" step="1" placeholder="Focal (mm)" class="focal-input" onchange="updateFocal(this)">
</div>
<div class="color-menu">
    ${focalColors.map(color => `
        <div class="color-option" style="background-color: ${color}" onclick="setFocalColor(this, '${color}')"></div>
    `).join('')}
    </div>


<!-- ----------⥥ CHAMP DE DURATION ⥥---------- -->

        <div class="duration-container">
            <label for="duration">Durée (en secondes) ⤵</label>
            <input type="number" min="1" step="1" placeholder="Durée" class="duration-input" onchange="updateDuration(this)">
        </div>

<!-- ----------⥥ TEXTE ⥥---------- -->

        <textarea placeholder="Description..."></textarea>


<!-- ----------⥥ VIDEO REFERENCE (YouTube, Vimeo, etc.) ⥥---------- -->

<input type="url" placeholder="URL de la vidéo de référence" onchange="updateReferenceVideo(this)">
<div class="video-reference-container">
    <!-- Le lien sera affiché ici une fois qu'il sera ajouté -->
</div>

<!-- ----------⥥ MOVE CONTROL DEPLACEMENT ⥥---------- -->

        <div class="move-controls">
            <button onclick="moveBox(this, -1)">←</button>
            <button onclick="moveBox(this, 1)">→</button>
        </div>
    `;

    container.appendChild(box);
    boxCounter++;
}




// ----------⥥ FONCTION SUPPRIMER TOUT ⥥----------
// Fonction pour supprimer toutes les cases du storyboard
function deleteAllBoxes() {
    const container = document.getElementById('storyboardContainer');
    const boxes = container.querySelectorAll('.storyboard-box');

    // Supprime chaque box une par une
    boxes.forEach(box => {
        box.classList.add('fade-out'); // Ajoute une animation de disparition si vous en avez une
        setTimeout(() => {
            box.remove(); // Supprime l'élément après l'animation
        }, 500); // 500ms pour laisser le temps à l'animation de se jouer
    });

    // Recalculer la durée totale après suppression
    calculateTotalDuration();
}



// ----------⥥ FONCTION DUREE DES PLANS ⥥----------

function updateDuration(input) {
    const duration = input.value; // Récupérer la valeur entrée par l'utilisateur
    const box = input.closest('.storyboard-box'); // Trouver la box associée

    // Créer ou mettre à jour l'affichage de la durée
    let durationDisplay = box.querySelector('.duration-display');
    if (!durationDisplay) {
        durationDisplay = document.createElement('div');
        durationDisplay.className = 'duration-display';
        box.appendChild(durationDisplay);
    }
    durationDisplay.textContent = `Durée: ${duration} sec`; // Afficher la durée
}

// Fonction pour calculer et mettre à jour la durée totale
function calculateTotalDuration() {
    const boxes = document.querySelectorAll('.storyboard-box');
    let totalDuration = 0;

    boxes.forEach(box => {
        const durationInput = box.querySelector('.duration-input');
        if (durationInput && durationInput.value) {
            totalDuration += parseInt(durationInput.value, 10);
        }
    });

    const totalDurationDisplay = document.getElementById('totalDuration');
    if (totalDurationDisplay) {
        totalDurationDisplay.textContent = `Durée totale du storyboard: ${totalDuration} secondes`;
        totalDurationDisplay.classList.add('fade-in');
        setTimeout(() => totalDurationDisplay.classList.remove('fade-in'), 500);
    }
}


// Fonction pour mettre à jour la durée du plan
function updateDuration(input) {
    const duration = input.value; // Récupérer la valeur entrée
    const box = input.closest('.storyboard-box'); // Trouver la box associée

    // Créer ou mettre à jour l'affichage de la durée dans chaque box
    let durationDisplay = box.querySelector('.duration-display');
    if (!durationDisplay) {
        durationDisplay = document.createElement('div');
        durationDisplay.className = 'duration-display';
        box.appendChild(durationDisplay);
    }
    durationDisplay.textContent = `Durée: ${duration} sec`; // Afficher la durée

    // Recalculer et mettre à jour la durée totale
    calculateTotalDuration();
}


// ----------⥥ MENU COULEURS ⥥----------

function toggleColorMenu(element) {
    const colorMenu = element.closest('.storyboard-box').querySelector('.color-menu');
    const isActive = colorMenu.style.display === 'block';

    // Fermer tous les menus ouverts
    const allMenus = document.querySelectorAll('.color-menu');
    allMenus.forEach(menu => menu.style.display = 'none');

    // Si le menu n'est pas déjà ouvert, l'afficher
    if (!isActive) {
        colorMenu.style.display = 'block';
    } else {
        colorMenu.style.display = 'none';
    }
}

function setFocalColor(element, color) {
    const focalColorSpan = element.closest('.storyboard-box').querySelector('.focal-color');
    if (focalColorSpan) {
        focalColorSpan.style.backgroundColor = color; // Applique la couleur choisie
    }
    const colorMenu = element.closest('.storyboard-box').querySelector('.color-menu');
    if (colorMenu) {
        colorMenu.style.display = 'none'; // Ferme le menu des couleurs
    }
}

// ----------⥥ IMAGE INPUT ⥥----------

function handleImageUpload(input) {
    const file = input.files[0];
    if (file) {
        const img = input.closest('.storyboard-box').querySelector('img');
        img.src = URL.createObjectURL(file);
        img.style.display = 'block';
    }
}

// ----------⥥ IMAGES URL ⥥----------

function handleImageURL(input) {
    const url = input.value;
    const img = input.closest('.storyboard-box').querySelector('img');
    img.onerror = () => {
        alert("Impossible de charger l'image. Vérifiez l'URL.");
        img.style.display = 'none';
    };
    img.src = url;
    img.style.display = 'block';
}

// ----------⥥ BOXES FONCTIONS ⥥----------

function updateBoxTitle(input) {
    const boxTitle = input.closest('.storyboard-box').querySelector('.box-title input');
    boxTitle.value = input.value;
}

function moveBox(button, direction) {
    const box = button.closest('.storyboard-box');
    const container = document.getElementById('storyboardContainer');
    const boxes = Array.from(container.children);
    const currentIndex = boxes.indexOf(box);
    const newIndex = currentIndex + direction;

    if (newIndex >= 0 && newIndex < boxes.length) {
        container.insertBefore(box, boxes[newIndex]);
    }
}

/* ⥥  DELETE BOX ⥥ */
function deleteBox(button) {
    const box = button.closest('.storyboard-box');
    box.classList.add('fade-out');
    setTimeout(() => {
        box.remove();
        calculateTotalDuration(); // Recalcule la durée totale après suppression
    }, 500);
}

/* ⥥  DUPLICATION BOX ⥥ */
function duplicateBox(button) {
    const box = button.closest('.storyboard-box'); // Trouve la case parente
    const container = document.getElementById('storyboardContainer'); // Trouve le conteneur des cases

    // Créer une nouvelle case identique
    const newBox = box.cloneNode(true); // cloneNode(true) pour cloner tous les éléments enfants

    // Incrémenter le compteur de cases pour donner un titre unique à la nouvelle case
    const newTitleInput = newBox.querySelector('input[type="text"]');
    newTitleInput.value = getUniqueTitle(newTitleInput.value);

    // Réinitialiser les champs si nécessaire (par exemple, effacer l'URL de l'image, etc.)
    const newImageInput = newBox.querySelector('input[type="file"]');
    newImageInput.value = ''; // Réinitialise le champ d'image

    const newDescriptionTextarea = newBox.querySelector('textarea');
    newDescriptionTextarea.value = ''; // Réinitialise la description

    // Ajouter la nouvelle case au conteneur
    container.appendChild(newBox);
    boxCounter++; // Incrémenter le compteur pour le titre unique
}



