document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('language-select');

    const setLanguage = (language) => {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[key] && translations[key][language]) {
                if (key === 'subtitle_tag') {
                   element.innerHTML = translations[key][language];
                } else {
                    element.textContent = translations[key][language];
                }
            }
        });
        
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (translations[key] && translations[key][language]) {
                element.placeholder = translations[key][language];
            }
        });

        localStorage.setItem('language', language);
        if (languageSelect) {
            languageSelect.value = language;
        }
    };

    if (languageSelect) {
        languageSelect.addEventListener('change', (event) => {
            setLanguage(event.target.value);
        });
    }

    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
});