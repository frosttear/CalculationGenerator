async function loadTranslations(lang) {
    try {
        const response = await fetch(`${basePath}docs/locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations[lang] = await response.json();
        applyTranslations();
    } catch (error) {
        console.error(`Could not load translations for ${lang}:`, error);
    }
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

// Expose translate function globally for dynamic content (e.g., Vue apps)
window.translate = (key) => {
    return (translations[currentLanguage] && translations[currentLanguage][key]) ? translations[currentLanguage][key] : key;
};
