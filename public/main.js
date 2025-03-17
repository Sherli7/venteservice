// main.js
// Gestion des services, modules et envoi des données
document.addEventListener('DOMContentLoaded', () => {
  const API_URL = window.APP_CONFIG?.API_URL || '';
  const servicesContainer = document.getElementById('servicesContainer');
  const modulesContainer = document.getElementById('modulesContainer');
  const dialogBot = document.querySelector('.dialog-bot');
  let selectedModules = {};

  // Chargement des services depuis l'API avec feedback visuel
  document.getElementById('loader').style.display = 'block';
  fetch(`${API_URL}/services`)
    .then(response => response.json())
    .then(services => {
      document.getElementById('loader').style.display = 'none';
      servicesContainer.innerHTML = '';
      services.forEach(service => {
        const button = document.createElement('button');
        button.innerHTML = `<span class="material-icons">miscellaneous_services</span> ${service.name}`;
        button.classList.add('service-button');
        button.addEventListener('click', () => showModules(service, selectedModules, modulesContainer, dialogBot));
        servicesContainer.appendChild(button);
      });
    })
    .catch(error => {
      document.getElementById('loader').style.display = 'none';
      console.error('Erreur chargement services:', error);
    });

  // Gestion du bouton "Terminer"
  document.getElementById('finishButton').addEventListener('click', () => {
    if (!Object.keys(selectedModules).length) alert('Sélectionnez au moins un service.');
    else document.getElementById('personalInfoFormContainer').style.display = 'block';
  });
});

// Fonction pour afficher les modules (à placer dans un fichier modules.js si modularité poussée)
function showModules(service, selectedModules, container, dialogBot) {
  container.innerHTML = '';
  if (!selectedModules[service.name]) selectedModules[service.name] = [];
  service.modules.forEach(module => {
    const button = document.createElement('button');
    button.classList.add('module-button');
    const isSelected = selectedModules[service.name].includes(module.name);
    button.innerHTML = `<span class="material-icons">${isSelected ? 'remove_circle_outline' : 'add_circle_outline'}</span> ${module.name}`;
    button.addEventListener('click', () => toggleModule(service.name, module.name, button, selectedModules, dialogBot));
    container.appendChild(button);
  });
  container.style.display = 'block';
  updateDialogBot(selectedModules, dialogBot);
  document.getElementById('finishButton').style.display = 'block';
}