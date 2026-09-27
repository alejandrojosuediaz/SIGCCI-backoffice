// src/admin/app.js
const config = {
    head: {
        title: 'SIGCCI',
    },
    // ... otras configuraciones
};

export default {
    config: {
        tutorials: false,
        notifications: {
            releases: false, // Desactiva el aviso de nuevas versiones
        },
        menu: {
            deploy: false
        },
        locales: [
            // 'ar',
            // 'fr',
            // 'cs',
            // 'de',
            // 'da',
            'es',
            // 'he',
            // 'id',
            // 'it',
            // 'ja',
            // 'ko',
            // 'ms',
            // 'nl',
            // 'no',
            // 'pl',
            // 'pt-BR',
            // 'pt',
            // 'ru',
            // 'sk',
            // 'sv',
            // 'th',
            // 'tr',
            // 'uk',
            // 'vi',
            // 'zh-Hans',
            // 'zh',
        ],
        translations: {
            en: {
                'Auth.form.welcome.title': 'Welcome to SIGCCI',
                'Auth.form.welcome.subtitle': 'Log in to continue',
                'Settings.profile.form.section.experience.interfaceLanguageHelp': 'Preference changes will apply only to you.',
            },
            es: {
                'Auth.form.welcome.title': 'Bienvenido a SIGCCI',
                'Auth.form.welcome.subtitle': 'Inicie sesión para continuar',
                'Settings.profile.form.section.experience.interfaceLanguageHelp': 'La selección cambiará el idioma de la interfaz solo para usted.',
            },
        },
    },
    bootstrap() {
        if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
            return;
        }

        const replaceBrand = () => {
            const nextTitle = document.title.replace(/\bStrapi\b/g, 'SIGCCI');

            if (nextTitle !== document.title) {
                document.title = nextTitle;
            }
        };

        replaceBrand();

        const titleElement = document.querySelector('title');

        if (!titleElement) {
            return;
        }

        const observer = new MutationObserver(() => {
            replaceBrand();
        });

        observer.observe(titleElement, {
            childList: true,
            characterData: true,
            subtree: true,
        });
        const style = document.createElement('style');
        style.innerHTML = `
      a[href="https://strapi.io/pricing-self-hosted"] {
        display: none !important;
      }
    `;
        document.head.appendChild(style);
    },
};