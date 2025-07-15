const translations = {};
let currentLanguage = 'zh'; // Default to Simplified Chinese

// Determine the base path for the project, accounting for GitHub Pages project sites
const getBasePath = () => {
    const path = window.location.pathname;
    const repoName = 'CalculationGenerator'; // Your repository name
    if (path.includes(`/${repoName}/`)) {
        return `/${repoName}/`;
    }
    return '/';
};

const basePath = getBasePath();

async function loadTranslations(lang) {
    console.log(`Attempting to load translations for: ${lang}`);
    try {
        const response = await fetch(`${basePath}docs/locales/${lang}.json`);
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status} for ${lang}.json`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations[lang] = await response.json();
        console.log(`Translations loaded for ${lang}:`, translations[lang]);
        applyTranslations();
    } catch (error) {
        console.error(`Could not load translations for ${lang}:`, error);
    }
}

function applyTranslations() {
    console.log(`Applying translations for language: ${currentLanguage}`);
    const elementsToTranslate = document.querySelectorAll('[data-l10n-key]');
    console.log(`Found ${elementsToTranslate.length} elements to translate.`);
    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-l10n-key');
        let translatedText = (translations[currentLanguage] && translations[currentLanguage][key]) ? translations[currentLanguage][key] : key;

        const argsAttr = element.getAttribute('data-l10n-args');
        if (argsAttr) {
            try {
                const args = JSON.parse(argsAttr);
                for (const argKey in args) {
                    translatedText = translatedText.replace(new RegExp(`{{${argKey}}}`, 'g'), args[argKey]);
                }
            } catch (e) {
                console.error(`Error parsing data-l10n-args for key ${key}:`, e);
            }
        }

        if (element.tagName === 'INPUT' && element.type === 'checkbox') {
            // Checkboxes don't have innerHTML for labels, handle separately if needed
        } else if (element.tagName === 'LABEL') {
            element.textContent = translatedText;
            console.log(`Translated LABEL key: ${key}, value: ${translatedText}`);
        } else {
            element.innerHTML = translatedText;
            console.log(`Translated element key: ${key}, value: ${translatedText}`);
        }
    });
}

function setLanguage(lang) {
    console.log(`Setting language to: ${lang}`);
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    loadTranslations(lang);
}

// Initialize language based on localStorage or default
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired.');
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
        console.log(`Found saved language: ${savedLanguage}`);
    }
    loadTranslations(currentLanguage);

    // Add event listeners for language switcher (if implemented in HTML)
    document.getElementById('lang-en')?.addEventListener('click', () => setLanguage('en'));
    document.getElementById('lang-zh')?.addEventListener('click', () => setLanguage('zh'));
});
