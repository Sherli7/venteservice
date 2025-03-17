// script.js
document.addEventListener('DOMContentLoaded', () => {
  const API_URL = window.APP_CONFIG?.API_URL || 'http://localhost:3007/api';
  const servicesContainer = document.getElementById('servicesContainer');
  const modulesContainer = document.getElementById('modulesContainer');
  const dialogBot = document.querySelector('.dialog-bot');
  const finishButton = document.getElementById('finishButton');
  const personalInfoForm = document.getElementById('personalInfoForm');
  let selectedModules = {};

  const loader = document.getElementById('loader');
  loader.style.display = 'block';
  fetch(`${API_URL}/services`)
    .then(res => res.json())
    .then(services => {
      loader.style.display = 'none';
      services.forEach(service => {
        const btn = document.createElement('button');
        btn.innerHTML = `<span class="material-icons">miscellaneous_services</span> ${service.name}`;
        btn.classList.add('service-button');
        btn.addEventListener('click', () => showModules(service));
        servicesContainer.appendChild(btn);
      });
    })
    .catch(err => {
      loader.style.display = 'none';
      console.error('Erreur:', err);
      alert('Erreur de chargement des services');
    });

  function showModules(service) {
    modulesContainer.innerHTML = '';
    if (!selectedModules[service.name]) selectedModules[service.name] = [];
    service.modules.forEach(module => {
      const btn = document.createElement('button');
      btn.classList.add('module-button');
      const isSelected = selectedModules[service.name].includes(module.name);
      btn.innerHTML = `<span class="material-icons">${isSelected ? 'remove_circle_outline' : 'add_circle_outline'}</span> ${module.name}`;
      btn.addEventListener('click', () => toggleModule(service.name, module.name, btn));
      modulesContainer.appendChild(btn);
    });
    modulesContainer.style.display = 'block';
    updateDialogBot();
    finishButton.style.display = 'block';
  }

  function toggleModule(serviceName, moduleName, btn) {
    const isSelected = btn.classList.contains('selected');
    btn.classList.toggle('selected');
    if (isSelected) {
      selectedModules[serviceName] = selectedModules[serviceName].filter(m => m !== moduleName);
      btn.innerHTML = `<span class="material-icons">add_circle_outline</span> ${moduleName}`;
    } else {
      selectedModules[serviceName].push(moduleName);
      btn.innerHTML = `<span class="material-icons">remove_circle_outline</span> ${moduleName}`;
    }
    updateDialogBot();
  }

  function updateDialogBot() {
    dialogBot.innerHTML = '';
    Object.keys(selectedModules).forEach(service => {
      if (selectedModules[service].length) {
        dialogBot.innerHTML += `<h3>${service}</h3><ul>${selectedModules[service].map(m => `<li>${m}</li>`).join('')}</ul>`;
      }
    });
  }

  finishButton.addEventListener('click', () => {
    if (!Object.keys(selectedModules).length) alert('Sélectionnez un service !');
    else document.getElementById('personalInfoFormContainer').style.display = 'block';
  });

  personalInfoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    if (!name || !email || !/^\S+@\S+\.\S+$/.test(email)) {
      alert('Nom et e-mail valide requis');
      return;
    }
    loader.style.display = 'block';
    fetch(`${API_URL}/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedModules, personalInfo: { name, email } })
    })
      .then(res => res.json())
      .then(data => {
        loader.style.display = 'none';
        alert(data.message || data.error);
      })
      .catch(err => {
        loader.style.display = 'none';
        alert('Erreur réseau');
      });
  });
});