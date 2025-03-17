// modules.js
export function toggleModule(serviceName, moduleName, button, selectedModules, dialogBot) {
    const isSelected = button.classList.contains('selected');
    if (isSelected) {
      button.classList.remove('selected');
      selectedModules[serviceName] = selectedModules[serviceName].filter(m => m !== moduleName);
      button.innerHTML = `<span class="material-icons">add_circle_outline</span> ${moduleName}`;
    } else {
      button.classList.add('selected');
      selectedModules[serviceName].push(moduleName);
      button.innerHTML = `<span class="material-icons">remove_circle_outline</span> ${moduleName}`;
    }
    updateDialogBot(selectedModules, dialogBot);
  }
  
  export function updateDialogBot(selectedModules, dialogBot) {
    const fragment = document.createDocumentFragment();
    Object.keys(selectedModules).forEach(service => {
      if (selectedModules[service].length) {
        const h3 = document.createElement('h3');
        h3.textContent = service;
        fragment.appendChild(h3);
        const ul = document.createElement('ul');
        selectedModules[service].forEach(module => {
          const li = document.createElement('li');
          li.textContent = module;
          ul.appendChild(li);
        });
        fragment.appendChild(ul);
      }
    });
    dialogBot.innerHTML = '';
    dialogBot.appendChild(fragment);
  }