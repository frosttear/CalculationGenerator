
const translations = {};
let currentLanguage = 'zh'; // Default to Simplified Chinese

// Determine the base path for the project, accounting for different file locations
const getBasePath = () => {
    const path = window.location.pathname;
    const protocol = window.location.protocol;
    const repoName = 'CalculationGenerator'; // Your repository name
    
    // For GitHub Pages (http/https)
    if (protocol !== 'file:' && path.includes(`/${repoName}/`)) {
        return `/${repoName}/`;
    }
    
    // For local file access (file://), use relative paths
    if (protocol === 'file:') {
        if (path.includes('/docs/')) {
            // We're in docs folder, access locales in same docs folder
            return 'locales/';
        } else {
            // We're in root directory, access docs/locales directly
            return 'docs/locales/';
        }
    }
    
    // Default fallback
    return '';
};

const basePath = getBasePath();

async function loadTranslations(lang) {
    return new Promise((resolve, reject) => {
        // Check if translations are already loaded
        if (window[`${lang}Translations`]) {
            translations[lang] = window[`${lang}Translations`];
            applyTranslations();
            document.dispatchEvent(new CustomEvent('translationsLoaded'));
            resolve();
            return;
        }

        // Create script element to load translation file
        const script = document.createElement('script');
        script.src = `${basePath}${lang}.js`;
        
        script.onload = () => {
            try {
                // Access the global variable created by the JS file
                translations[lang] = window[`${lang}Translations`];
                applyTranslations();
                document.dispatchEvent(new CustomEvent('translationsLoaded'));
                resolve();
            } catch (error) {
                console.error(`Error accessing translations for ${lang}:`, error);
                reject(error);
            }
        };
        
        script.onerror = (error) => {
            console.error(`Could not load translations for ${lang}:`, error);
            reject(error);
        };
        
        document.head.appendChild(script);
    });
}

function applyTranslations() {
    const elementsToTranslate = document.querySelectorAll('[data-l10n-key]');
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
        } else {
            element.innerHTML = translatedText;
        }
    });
}

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    loadTranslations(lang);
}

// Expose translate function globally for dynamic content (e.g., Vue apps)
window.translate = (key) => {
    return (translations[currentLanguage] && translations[currentLanguage][key]) ? translations[currentLanguage][key] : key;
};

// Initialize language based on localStorage or default
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
    loadTranslations(currentLanguage);

    // Add event listeners for language switcher (if implemented in HTML)
    document.getElementById('lang-en')?.addEventListener('click', () => setLanguage('en'));
    document.getElementById('lang-zh')?.addEventListener('click', () => setLanguage('zh'));
});
