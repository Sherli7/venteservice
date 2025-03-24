jQuery.noConflict();

document.addEventListener('DOMContentLoaded', () => {
  // Fonction pour normaliser les chaînes (supprimer les accents et convertir en minuscules)
  function normalizeString(str) {
    return str
      .toLowerCase()
      .normalize('NFD') // Décomposer les caractères accentués
      .replace(/[\u0300-\u036f]/g, ''); // Supprimer les diacritiques (accents)
  }

  // Gestion du multilingue
  const translations = {
    fr: {
      title: "Obivsolutions services",
      your_services: "vos services",
      selection: "Sélection",
      information: "Informations",
      search: "rechercher",
      your_selection: "votre sélection",
      next: "suivant",
      personal_info: "Informations personnelles",
      first_name: "prénom",
      first_name_required: "Le prénom est requis",
      last_name: "nom",
      last_name_required: "Le nom est requis",
      phone_number: "numéro de téléphone",
      phone_invalid: "9 à 10 chiffres requis (sans indicatif)",
      email: "email",
      email_invalid: "Un email valide est requis",
      submit: "envoyer",
      encouragement_messages: [
        "Bienvenue ! Sélectionnez un service pour commencer. 😊",
        "Vous cherchez un service particulier ? Utilisez la barre de recherche ci-dessus !",
        "Cliquez sur un service pour voir ses modules disponibles.",
        "Besoin d'aide ? Essayez de sélectionner un service pour explorer ses options.",
        "Commencez dès maintenant en choisissant un service qui vous intéresse !"
      ],
      error_form: "Veuillez corriger les erreurs dans le formulaire avant de soumettre.",
      error_network: "Erreur réseau",
      error_services: "Erreur de chargement des services",
      error_country_codes: "Impossible de charger les indicatifs téléphoniques. Vérifiez la console pour plus de détails.",
      error_country_codes_missing: "Erreur de configuration : le champ des indicatifs est introuvable.",
      services: {
        "audit": "Audit",
        "conseil": "Conseil",
        "coaching": "Coaching",
        "recherches": "Recherches",
        "formations": "Formations",
        "études": "Études"
      },
      modules: {
        "analyse des risques": "Analyse des risques",
        "audit financier": "Audit financier",
        "audit organisationnel": "Audit organisationnel",
        "audit interne": "Audit interne",
        "stratégie d'entreprise": "Stratégie d'entreprise",
        "gestion de projet": "Gestion de projet",
        "management des équipes": "Management des équipes",
        "coaching individuel": "Coaching individuel",
        "coaching d'équipe": "Coaching d'équipe",
        "analyse de marché": "Analyse de marché",
        "études de faisabilité": "Études de faisabilité",
        "formation en gestion": "Formation en gestion",
        "formation en communication": "Formation en communication",
        "formation en leadership": "Formation en leadership",
        "gestion axee sur les resultats (g.a.r)": "GESTION AXEE SUR LES RESULTATS (G.A.R)",
        "outils de planification": "OUTILS DE PLANIFICATION",
        "gestion des organisations publiques": "GESTION DES ORGANISATIONS PUBLIQUES",
        "reforme des entites publiques au cameroun": "REFORME DES ENTITES PUBLIQUES AU CAMEROUN",
        "controle des entites publiques au cameroun": "CONTROLE DES ENTITES PUBLIQUES AU CAMEROUN",
        "étude de marché": "Étude de marché",
        "étude de satisfaction client": "Étude de satisfaction client",
        "budget programme": "BUDGET PROGRAMME"
      }
    },
    en: {
      title: "Obivsolutions services",
      your_services: "your services",
      selection: "Selection",
      information: "Information",
      search: "search",
      your_selection: "your selection",
      next: "next",
      personal_info: "Personal Information",
      first_name: "first name",
      first_name_required: "First name is required",
      last_name: "last name",
      last_name_required: "Last name is required",
      phone_number: "phone number",
      phone_invalid: "9 to 10 digits required (without country code)",
      email: "email",
      email_invalid: "A valid email is required",
      submit: "submit",
      encouragement_messages: [
        "Welcome! Select a service to get started. 😊",
        "Looking for a specific service? Use the search bar above!",
        "Click on a service to see its available modules.",
        "Need help? Try selecting a service to explore its options.",
        "Get started now by choosing a service that interests you!"
      ],
      error_form: "Please correct the errors in the form before submitting.",
      error_network: "Network error",
      error_services: "Error loading services",
      error_country_codes: "Unable to load country codes. Check the console for more details.",
      error_country_codes_missing: "Configuration error: the country code field is missing.",
      services: {
        "audit": "Audit",
        "conseil": "Consulting",
        "coaching": "Coaching",
        "recherches": "Research",
        "formations": "Training",
        "études": "Studies"
      },
      modules: {
        "analyse des risques": "Risk Analysis",
        "audit financier": "Financial Audit",
        "audit organisationnel": "Organizational Audit",
        "audit interne": "Internal Audit",
        "stratégie d'entreprise": "Business Strategy",
        "gestion de projet": "Project Management",
        "management des équipes": "Team Management",
        "coaching individuel": "Individual Coaching",
        "coaching d'équipe": "Team Coaching",
        "analyse de marché": "Market Analysis",
        "études de faisabilité": "Feasibility Studies",
        "formation en gestion": "Management Training",
        "formation en communication": "Communication Training",
        "formation en leadership": "Leadership Training",
        "gestion axee sur les resultats (g.a.r)": "Results-Based Management (RBM)",
        "outils de planification": "Planning Tools",
        "gestion des organisations publiques": "Public Organization Management",
        "reforme des entites publiques au cameroun": "Public Entity Reform in Cameroon",
        "controle des entites publiques au cameroun": "Control of Public Entities in Cameroon",
        "étude de marché": "Market Study",
        "étude de satisfaction client": "Customer Satisfaction Study",
        "budget programme": "Program Budget"
      }
    }
  };

  let currentLanguage = localStorage.getItem('language') || 'fr';
  const languageSelect = document.getElementById('languageSelect');
  languageSelect.value = currentLanguage;

  function updateLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
  
    // Update the lang attribute of the HTML tag
    document.getElementById('htmlLang').setAttribute('lang', lang);
  
    // Mettre à jour tous les éléments avec data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key === 'encouragement_messages') return; // Géré séparément
  
      // Gérer différents types d'éléments
      if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
        // Cas des inputs avec placeholder
        element.setAttribute('placeholder', translations[lang][key]);
      } else if (element.classList.contains('mdl-textfield__label') || element.classList.contains('mdl-textfield__error')) {
        // Cas des labels et messages d'erreur
        element.textContent = translations[lang][key];
      } else {
        // Cas général (textContent)
        element.textContent = translations[lang][key];
      }
    });
  
    // Mettre à jour le titre de la page
    document.title = translations[lang].title;
  
    // Mettre à jour les messages d'encouragement
    encouragementMessages = translations[lang].encouragement_messages;
  
    // Mettre à jour le placeholder de la barre de recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.setAttribute('placeholder', `${translations[lang].search} a service or module...`);
    }
  
    // Recharger les indicatifs téléphoniques si nécessaire
    if (countryCodeSelect && countryCodeSelect.options.length > 1) {
      loadCountryCodes();
    }
  
    // Mettre à jour l'affichage des services et autres éléments
    displayServices();
    updateDialogBot();
    displayEncouragementMessages();
  }

  languageSelect.addEventListener('change', (e) => {
    updateLanguage(e.target.value);
  });

  if (typeof toastr === 'undefined') {
    console.error('Erreur : la bibliothèque toastr n\'est pas chargée.');
    window.toastr = {
      error: (message) => showCustomToastr(message, 'error'),
      success: (message) => showCustomToastr(message, 'success'),
      warning: (message) => showCustomToastr(message, 'warning'),
      info: (message) => showCustomToastr(message, 'info')
    };
  } else {
    toastr.options = {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-right',
      timeOut: '5000',
      extendedTimeOut: '1000',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut'
    };
  }

  function showCustomToastr(message, type) {
    const toastrDiv = document.createElement('div');
    toastrDiv.className = `custom-toastr ${type}`;
    toastrDiv.textContent = message;
    document.body.appendChild(toastrDiv);
    setTimeout(() => toastrDiv.remove(), 5000);
  }

  const API_URL = window.APP_CONFIG?.API_URL || 'http://localhost:3007/api';
  const servicesContainer = document.getElementById('servicesContainer');
  const dialogBot = document.querySelector('.dialog-bot');
  const nextToInfoButton = document.getElementById('nextToInfoButton');
  const personalInfoForm = document.getElementById('personalInfoForm');
  const searchInput = document.getElementById('searchInput');
  const suggestionsContainer = document.getElementById('suggestionsContainer');
  const steps = document.querySelectorAll('.step');
  const countryCodeSelect = document.getElementById('countryCode');
  const phoneInput = document.getElementById('phone');
  const flagIcon = document.getElementById('flagIcon');
  const serviceProgress = document.getElementById('serviceProgress');
  let selectedModules = {};
  let servicesData = [];
  let currentStep = 0;
  let isFlagListenerAttached = false;
  let encouragementMessages = translations[currentLanguage].encouragement_messages;

  function saveProgress() {
    const progress = {
      selectedModules,
      currentStep,
      personalInfo: {
        firstName: document.getElementById('firstName').value.trim().toLowerCase(),
        lastName: document.getElementById('lastName').value.trim().toLowerCase(),
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value.trim().toLowerCase(),
        countryCode: document.getElementById('countryCode').value
      }
    };
    localStorage.setItem('userProgress', JSON.stringify(progress));
  }

  function loadProgress() {
    const savedProgress = localStorage.getItem('userProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      selectedModules = progress.selectedModules || {};
      currentStep = progress.currentStep || 0;
      if (progress.personalInfo) {
        document.getElementById('firstName').value = progress.personalInfo.firstName || '';
        document.getElementById('lastName').value = progress.personalInfo.lastName || '';
        document.getElementById('phone').value = progress.personalInfo.phone || '';
        document.getElementById('email').value = progress.personalInfo.email || '';
        if (progress.personalInfo.countryCode) {
          document.getElementById('countryCode').value = progress.personalInfo.countryCode;
          updateFlag(); // Update the flag after setting the country code
        }
      }
    }
  }

  function updateProgressBar() {
    const progressLineFill = document.querySelector('.progress-line-fill');
    let progress = 0;

    if (currentStep === 0) {
      const totalModules = servicesData.reduce((sum, service) => sum + service.modules.length, 0);
      const selectedModulesCount = Object.values(selectedModules).reduce((sum, modules) => sum + modules.length, 0);
      progress = totalModules > 0 ? (selectedModulesCount / totalModules) * 50 : 0;
    } else if (currentStep === 1) {
      progress = 100;
    }

    progressLineFill.style.width = `${progress}%`;
    serviceProgress.setAttribute('aria-valuenow', Math.round(progress));
  }

  let cachedCountryCodes = { fr: null, en: null };

  const loadCountryCodes = async () => {
    if (!countryCodeSelect) {
      console.error('Erreur : L\'élément #countryCode n\'existe pas dans le DOM');
      toastr.error(translations[currentLanguage].error_country_codes_missing);
      return;
    }

    // Preserve the current selection before reloading the dropdown
    const currentSelection = countryCodeSelect.value || '+237'; // Default to Cameroon if no selection

    try {
      // Check if the data for the current language is already cached
      if (!cachedCountryCodes[currentLanguage]) {
        const fileName = `/countrycodes-${currentLanguage}.json`;
        const response = await fetch(fileName);
        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('La réponse n’est pas du JSON');
        }
        const data = await response.json();
        cachedCountryCodes[currentLanguage] = data.countrycode;
      }

      const countryCodes = cachedCountryCodes[currentLanguage];

      // Populate the dropdown with country codes
      countryCodeSelect.innerHTML = `<option value="">${translations[currentLanguage].phone_number}</option>`;
      countryCodes.forEach(country => {
        if (!country.iso) {
          console.warn(`Le pays ${country.name} n'a pas de code ISO. Ignoré.`);
          return;
        }
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = `${country.name} (${country.code})`;
        option.setAttribute('data-country', country.iso.toLowerCase());
        // Store the full name for truncation purposes
        option.setAttribute('data-full-name', `${country.name} (${country.code})`);
        countryCodeSelect.appendChild(option);
      });

      // Restore the previous selection or set the default
      countryCodeSelect.value = currentSelection;
      updateFlag();

      // Add event listener to truncate the selected option after selection
      countryCodeSelect.addEventListener('change', () => {
        // Reset all options to their full names first
        Array.from(countryCodeSelect.options).forEach(option => {
          const fullName = option.getAttribute('data-full-name');
          if (fullName) {
            option.textContent = fullName;
          }
        });

        // Truncate the selected option if necessary
        const selectedOption = countryCodeSelect.options[countryCodeSelect.selectedIndex];
        if (selectedOption && selectedOption.value !== "") {
          const countryName = selectedOption.textContent.split(' (')[0]; // Récupérer le nom sans le code
          if (countryName.length > 7) {
            selectedOption.textContent = `${countryName.substring(0, 7)}... (${selectedOption.textContent.split(' (')[1]}`; // Tronquer et conserver le code
            selectedOption.setAttribute('title', `${countryName} (${selectedOption.value})`); // Ajouter le nom complet en title pour accessibilité
          }
        }
        updateFlag(); // Update the flag on change
        saveProgress(); // Save the selection
      });

      // Trigger the change event initially to apply truncation if a default value is set
      countryCodeSelect.dispatchEvent(new Event('change'));
    } catch (error) {
      console.error('Erreur lors du chargement des indicatifs:', error);
      toastr.error(translations[currentLanguage].error_country_codes);
    }
  };

  function updateFlag() {
    if (!countryCodeSelect || !flagIcon || countryCodeSelect.selectedIndex < 0) {
      console.warn('Flag update skipped : element not ready or no selection');
      return;
    }

    const selectedOption = countryCodeSelect.options[countryCodeSelect.selectedIndex];
    if (!selectedOption) {
      console.warn('No selected option found in countryCodeSelect');
      return;
    }

    const countryCode = selectedOption.getAttribute('data-country');
    if (countryCode) {
      flagIcon.className = `flag-icon flag-icon-${countryCode}`;
    } else {
      flagIcon.className = 'flag-icon';
    }
  }

  // Initial load of country codes
  loadCountryCodes();

  const loader = document.getElementById('loader');
  loader.style.display = 'block';
  fetch(`${API_URL}/services`)
    .then(res => res.json())
    .then(services => {
      loader.style.display = 'none';
      servicesData = services.map(service => ({
        ...service,
        name: service.name.toLowerCase(),
        normalizedName: normalizeString(service.name),
        modules: service.modules.map(module => ({
          ...module,
          name: module.name.toLowerCase(),
          normalizedName: normalizeString(module.name)
        }))
      }));
      loadProgress();
      displayServices();
      if (document.querySelector('.chat-messages')) {
        updateDialogBot();
        displayEncouragementMessages();
      } else {
        console.warn('Chat messages container not found. Skipping updateDialogBot and displayEncouragementMessages.');
      }
      updateStep();
      updateProgressBar();
    })
    .catch(err => {
      loader.style.display = 'none';
      console.error('Erreur:', err);
      toastr.error(translations[currentLanguage].error_services);
    });

  function validateFirstName() {
    const firstNameInput = document.getElementById('firstName');
    const firstNameContainer = firstNameInput.closest('.mdl-textfield');
    const isValid = firstNameInput.value.trim().length > 0;
    firstNameContainer.classList.toggle('is-invalid', !isValid);
    return isValid;
  }

  function validateLastName() {
    const lastNameInput = document.getElementById('lastName');
    const lastNameContainer = lastNameInput.closest('.mdl-textfield');
    const isValid = lastNameInput.value.trim().length > 0;
    lastNameContainer.classList.toggle('is-invalid', !isValid);
    return isValid;
  }

  function validatePhoneInput() {
    const phoneInput = document.getElementById('phone');
    const phoneContainer = phoneInput.closest('.mdl-textfield');
    const isValid = /^[0-9]{9,10}$/.test(phoneInput.value);
    if (phoneInput.value.length > 0) {
      phoneContainer.classList.toggle('is-invalid', !isValid);
    } else {
      phoneContainer.classList.remove('is-invalid');
    }
    return isValid;
  }

  function validateEmail() {
    const emailInput = document.getElementById('email');
    const emailContainer = emailInput.closest('.mdl-textfield');
    const isValid = /^\S+@\S+\.\S+$/.test(emailInput.value.trim());
    emailContainer.classList.toggle('is-invalid', !isValid);
    return isValid;
  }

  document.getElementById('firstName').addEventListener('input', () => {
    validateFirstName();
    saveProgress();
  });
  document.getElementById('lastName').addEventListener('input', () => {
    validateLastName();
    saveProgress();
  });
  document.getElementById('phone').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    e.target.value = value;
    validatePhoneInput();
    saveProgress();
  });
  document.getElementById('email').addEventListener('input', () => {
    validateEmail();
    saveProgress();
  });
  // Note: The change event listener for countryCodeSelect is now inside loadCountryCodes to avoid duplicate listeners

  document.addEventListener('click', (e) => {
    const clickedElement = e.target;
    const serviceWrapper = clickedElement.closest('.service-wrapper');
    if (!serviceWrapper) {
      document.querySelectorAll('.modules-list').forEach(modulesList => {
        modulesList.remove();
      });
    }
  });

  function displayServices() {
    servicesContainer.innerHTML = '';
    const query = searchInput.value.toLowerCase();
    const normalizedQuery = normalizeString(query);

    const filteredServices = query
      ? servicesData.filter(service => {
          const translatedServiceName = translations[currentLanguage].services[service.name] || service.name;
          const normalizedTranslatedServiceName = normalizeString(translatedServiceName);
          const matchesServiceName = service.normalizedName.includes(normalizedQuery) || normalizedTranslatedServiceName.includes(normalizedQuery);

          const matchesModuleName = service.modules.some(module => {
            const translatedModuleName = translations[currentLanguage].modules[module.name] || module.name;
            const normalizedTranslatedModuleName = normalizeString(translatedModuleName);
            return module.normalizedName.includes(normalizedQuery) || normalizedTranslatedModuleName.includes(normalizedQuery);
          });

          return matchesServiceName || matchesModuleName;
        })
      : servicesData;

    filteredServices.forEach(service => {
      const serviceWrapper = document.createElement('div');
      serviceWrapper.className = 'service-wrapper';

      const btn = document.createElement('button');
      const translatedServiceName = translations[currentLanguage].services[service.name] || service.name;
      btn.innerHTML = `<span class="material-icons">miscellaneous_services</span> ${translatedServiceName}`;
      btn.classList.add('service-button');
      if (selectedModules[service.name] && selectedModules[service.name].length > 0) {
        btn.classList.add('selected');
      }
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleModules(service, serviceWrapper);
      });

      if (query) {
        const matchingModules = service.modules.filter(module => {
          const translatedModuleName = translations[currentLanguage].modules[module.name] || module.name;
          const normalizedTranslatedModuleName = normalizeString(translatedModuleName);
          return module.normalizedName.includes(normalizedQuery) || normalizedTranslatedModuleName.includes(normalizedQuery);
        });
        if (matchingModules.length > 0) {
          const tooltip = document.createElement('div');
          tooltip.className = 'tooltip';
          const translatedMatchingModules = matchingModules.map(m => translations[currentLanguage].modules[m.name] || m.name);
          tooltip.textContent = `modules correspondants : ${translatedMatchingModules.join(', ')}`;
          btn.appendChild(tooltip);
        }
      }

      serviceWrapper.appendChild(btn);
      servicesContainer.appendChild(serviceWrapper);
    });
    updateNextButtonVisibility();
    updateProgressBar();
  }

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const normalizedQuery = normalizeString(query);
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.classList.remove('show');

    if (!query) {
      displayServices();
      return;
    }

    const suggestions = [];
    servicesData.forEach(service => {
      const translatedServiceName = translations[currentLanguage].services[service.name] || service.name;
      const normalizedTranslatedServiceName = normalizeString(translatedServiceName);
      if (service.normalizedName.includes(normalizedQuery) || normalizedTranslatedServiceName.includes(normalizedQuery)) {
        if (!suggestions.includes(service.name)) {
          suggestions.push(service.name);
        }
      }

      service.modules.forEach(module => {
        const translatedModuleName = translations[currentLanguage].modules[module.name] || module.name;
        const normalizedTranslatedModuleName = normalizeString(translatedModuleName);
        if (module.normalizedName.includes(normalizedQuery) || normalizedTranslatedModuleName.includes(normalizedQuery)) {
          if (!suggestions.includes(module.name)) {
            suggestions.push(module.name);
          }
        }
      });
    });

    if (suggestions.length > 0) {
      suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        const translatedSuggestion = translations[currentLanguage].services[suggestion] || translations[currentLanguage].modules[suggestion] || suggestion;
        item.textContent = translatedSuggestion;
        item.setAttribute('data-suggestion', suggestion);
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const originalSuggestion = e.target.getAttribute('data-suggestion');
          searchInput.value = translatedSuggestion;
          suggestionsContainer.classList.remove('show');
          handleSuggestionClick(originalSuggestion);
          displayServices();
        });
        suggestionsContainer.appendChild(item);
      });
      suggestionsContainer.classList.add('show');
    }
    displayServices();
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
      suggestionsContainer.classList.remove('show');
    }
  });

  function handleSuggestionClick(suggestion) {
    const service = servicesData.find(s => s.name === suggestion);
    if (service) {
      const serviceWrapper = Array.from(document.querySelectorAll('.service-wrapper')).find(wrapper => {
        const btn = wrapper.querySelector('.service-button');
        const translatedServiceName = translations[currentLanguage].services[service.name] || service.name;
        return btn && btn.textContent.includes(translatedServiceName);
      });
      if (serviceWrapper) {
        toggleModules(service, serviceWrapper);
      }
    } else {
      servicesData.forEach(service => {
        const module = service.modules.find(m => m.name === suggestion);
        if (module) {
          if (!selectedModules[service.name]) selectedModules[service.name] = [];
          if (!selectedModules[service.name].includes(module.name)) {
            selectedModules[service.name].push(module.name);
            const serviceWrapper = Array.from(document.querySelectorAll('.service-wrapper')).find(wrapper => {
              const btn = wrapper.querySelector('.service-button');
              const translatedServiceName = translations[currentLanguage].services[service.name] || service.name;
              return btn && btn.textContent.includes(translatedServiceName);
            });
            if (serviceWrapper) {
              toggleModules(service, serviceWrapper);
              const moduleBtn = Array.from(serviceWrapper.querySelectorAll('.module-button')).find(btn => {
                const translatedModuleName = translations[currentLanguage].modules[module.name] || module.name;
                return btn.textContent.includes(translatedModuleName);
              });
              if (moduleBtn) {
                moduleBtn.classList.add('selected');
                const translatedModuleName = translations[currentLanguage].modules[module.name] || module.name;
                moduleBtn.innerHTML = `<span class="material-icons">remove_circle_outline</span> ${translatedModuleName}`;
              }
            }
          }
        }
      });
    }
    updateDialogBot();
    searchInput.value = '';
    suggestionsContainer.classList.remove('show');
    displayServices();
    saveProgress();
  }

  function toggleModules(service, serviceWrapper) {
    const existingModules = serviceWrapper.querySelector('.modules-list');
    if (existingModules) {
      existingModules.remove();
      return;
    }
  
    document.querySelectorAll('.modules-list').forEach(modulesList => {
      if (modulesList !== existingModules) modulesList.remove();
    });
  
    const modulesList = document.createElement('div');
    modulesList.className = 'modules-list';
  
    if (!selectedModules[service.name]) selectedModules[service.name] = [];
    service.modules.forEach(module => {
      const btn = document.createElement('button');
      btn.classList.add('module-button');
      const isSelected = selectedModules[service.name].includes(module.name);
      if (isSelected) btn.classList.add('selected');
      const translatedModuleName = translations[currentLanguage].modules[module.name] || module.name;
      btn.innerHTML = `<span class="material-icons">${isSelected ? 'remove_circle_outline' : 'add_circle_outline'}</span> ${translatedModuleName}`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleModule(service.name, module.name, btn, serviceWrapper);
      });
      modulesList.appendChild(btn);
    });
  
    serviceWrapper.appendChild(modulesList);
    updateDialogBot();
  }

  function toggleModule(serviceName, moduleName, btn, serviceWrapper) {
    const isSelected = btn.classList.contains('selected');
    btn.classList.toggle('selected');
    if (isSelected) {
      selectedModules[serviceName] = selectedModules[serviceName].filter(m => m !== moduleName);
    } else {
      selectedModules[serviceName].push(moduleName);
    }
    const translatedModuleName = translations[currentLanguage].modules[moduleName] || moduleName;
    btn.innerHTML = `<span class="material-icons">${!isSelected ? 'remove_circle_outline' : 'add_circle_outline'}</span> ${translatedModuleName}`;

    const serviceButton = serviceWrapper.querySelector('.service-button');
    if (selectedModules[serviceName].length > 0) {
      serviceButton.classList.add('selected');
    } else {
      serviceButton.classList.remove('selected');
    }
    updateDialogBot();
    updateNextButtonVisibility();
    saveProgress();
    updateProgressBar();
  }

  function updateDialogBot() {
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.innerHTML = '';

    const services = Object.keys(selectedModules).filter(service => selectedModules[service].length > 0);

    if (services.length === 0) {
      const encouragementContainer = document.querySelector('.encouragement-container');
      const encouragementMessagesContainer = document.querySelector('.encouragement-messages');
      
      if (encouragementContainer && encouragementMessagesContainer) {
        encouragementContainer.classList.remove('active');
        encouragementMessagesContainer.innerHTML = '';
      }
    
      displayEncouragementMessages();
      return;
    }

    let delay = 0;
    services.forEach((service, serviceIndex) => {
      const serviceMessage = document.createElement('div');
      serviceMessage.className = 'chat-message service';
      const translatedServiceName = translations[currentLanguage].services[service] || service;
      serviceMessage.textContent = translatedServiceName;
      chatMessages.appendChild(serviceMessage);

      setTimeout(() => {
        serviceMessage.classList.add('visible');
        scrollToBottom(dialogBot);
      }, delay);

      delay += 300;

      selectedModules[service].forEach((module, moduleIndex) => {
        const moduleMessage = document.createElement('div');
        moduleMessage.className = 'chat-message module';
        const translatedModuleName = translations[currentLanguage].modules[module] || module;
        moduleMessage.textContent = translatedModuleName;
        chatMessages.appendChild(moduleMessage);

        setTimeout(() => {
          moduleMessage.classList.add('visible');
          scrollToBottom(dialogBot);
        }, delay);

        delay += 200;
      });
    });
  }

  function scrollToBottom(container) {
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  let encouragementTimeout = null;

  function displayEncouragementMessages() {
    const chatMessages = document.querySelector('.chat-messages');
    const encouragementMessagesContainer = document.querySelector('.encouragement-messages');
    const encouragementContainer = document.querySelector('.encouragement-container');
    let messageIndex = 0;

    const showNextMessage = () => {
      const services = Object.keys(selectedModules).filter(service => selectedModules[service].length > 0);
      const isActive = services.length > 0;
      const targetContainer = isActive ? encouragementMessagesContainer : chatMessages;

      if (encouragementMessagesContainer) {
        encouragementMessagesContainer.innerHTML = '';
      }
      if (!isActive && chatMessages) {
        chatMessages.innerHTML = '';
      }

      if (encouragementContainer) {
        encouragementContainer.classList.toggle('active', isActive);
      }

      const message = encouragementMessages[messageIndex % encouragementMessages.length];
      const words = message.split(' ');
      const messageDiv = document.createElement('div');
      messageDiv.className = isActive ? 'encouragement-message fadeInUp' : 'chat-message encouragement fadeInUp';

      if (targetContainer) {
        targetContainer.appendChild(messageDiv);
      } else {
        console.warn('Target container not found for encouragement messages');
        return;
      }

      let wordIndex = 0;
      const displayWord = () => {
        if (wordIndex < words.length) {
          messageDiv.textContent += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
          wordIndex++;
          setTimeout(displayWord, 150);
        } else {
          scrollToBottom(isActive && encouragementContainer ? encouragementContainer : dialogBot);
          encouragementTimeout = setTimeout(() => {
            messageIndex++;
            showNextMessage();
          }, 12000 - words.length * 150);
        }
      };

      displayWord();
    };

    if (encouragementTimeout) {
      clearTimeout(encouragementTimeout);
    }

    showNextMessage();
  }

  function updateNextButtonVisibility() {
    nextToInfoButton.style.display = Object.keys(selectedModules).some(key => selectedModules[key].length > 0) ? 'block' : 'none';
  }

  function updateStep() {
    steps.forEach((step, index) => {
      if (index === currentStep) {
        step.classList.add('step-active');
      } else {
        step.classList.remove('step-active');
      }
    });

    const stepCircles = document.querySelectorAll('.step-circle');
    stepCircles.forEach((circle, index) => {
      if (index === currentStep) {
        circle.classList.add('step-circle-active');
        circle.setAttribute('aria-current', 'step');
      } else {
        circle.classList.remove('step-circle-active');
        circle.removeAttribute('aria-current');
      }

      if (index < currentStep) {
        circle.classList.add('completed');
      } else {
        circle.classList.remove('completed');
      }
    });

    nextToInfoButton.style.display = currentStep === 1 ? 'none' : 'block';

    const dialogBotContainer = document.querySelector('.dialog-bot');
    if (dialogBotContainer) {
      dialogBotContainer.style.display = currentStep === 0 ? 'block' : 'none';
    }

    if (currentStep === 1) {
      if (countryCodeSelect) {
        // Ensure the country code is loaded before setting the default
        if (countryCodeSelect.options.length <= 1) {
          loadCountryCodes().then(() => {
            countryCodeSelect.value = '+237';
            updateFlag();
          });
        } else {
          countryCodeSelect.value = '+237';
          updateFlag();
        }
      }

      if (!isFlagListenerAttached && countryCodeSelect) {
        countryCodeSelect.addEventListener('change', updateFlag);
        isFlagListenerAttached = true;
      }
    }
    updateProgressBar();
    saveProgress();
  }

  document.querySelectorAll('.step-circle').forEach((circle, index) => {
    circle.addEventListener('click', () => {
      if (index === 0 || (index === 1 && Object.keys(selectedModules).some(key => selectedModules[key].length > 0))) {
        currentStep = index;
        updateStep();
      }
    });

    circle.setAttribute('tabindex', '0');
    circle.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (index === 0 || (index === 1 && Object.keys(selectedModules).some(key => selectedModules[key].length > 0))) {
          currentStep = index;
          updateStep();
        }
      }
    });
  });

  nextToInfoButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentStep === 0) {
      currentStep = 1;
      updateStep();
    }
  });

  personalInfoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim().toLowerCase();
    const lastName = document.getElementById('lastName').value.trim().toLowerCase();
    const countryCode = document.getElementById('countryCode').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value.trim().toLowerCase();

    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isPhoneValid = validatePhoneInput();
    const isEmailValid = validateEmail();

    if (!isFirstNameValid || !isLastNameValid || !countryCode || !isPhoneValid || !isEmailValid) {
      toastr.error(translations[currentLanguage].error_form);
      return;
    }

    const fullPhoneNumber = `${countryCode}${phone}`;
    loader.style.display = 'block';

    fetch(`${API_URL}/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selectedModules,
        personalInfo: { firstName, lastName, phone: fullPhoneNumber, email }
      })
    })
      .then(res => res.json())
      .then(data => {
        loader.style.display = 'none';
        if (data.message) {
          toastr.success(data.message);
          currentStep = 0;
          selectedModules = {};
          localStorage.removeItem('userProgress');
          updateStep();
          displayServices();
          updateDialogBot();
          personalInfoForm.reset();
          document.querySelectorAll('.mdl-textfield').forEach(container => {
            container.classList.remove('is-invalid');
          });
        } else if (data.error) {
          toastr.error(data.error);
        }
      })
      .catch(err => {
        loader.style.display = 'none';
        toastr.error(translations[currentLanguage].error_network);
      });
  });

  updateLanguage(currentLanguage);
});