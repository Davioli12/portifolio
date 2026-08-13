/*
========================================
CONFIGURAÇÕES
========================================
*/

/*
Nome da chave no localStorage
*/
const THEME_KEY =
    "site_theme";


/*
========================================
FUNÇÃO RESPONSÁVEL POR
APLICAR O TEMA
========================================
*/

function applyTheme(theme) {

    /*
    Remove tema light
    */
    document.body.classList.remove(
        "light-theme"
    );

    /*
    Se for light
    */
    if (theme === "light") {

        document.body.classList.add(
            "light-theme"
        );
    }

    /*
    Salva no navegador
    */
    localStorage.setItem(
        THEME_KEY,
        theme
    );
}


/*
========================================
CARREGA TEMA SALVO
========================================
*/

function loadTheme() {

    /*
    Captura tema salvo
    */
    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );

    /*
    Se existir tema salvo
    */
    if (savedTheme) {

        applyTheme(savedTheme);

    } else {

        /*
        Tema padrão
        */
        applyTheme("dark");
    }
}


/*
========================================
ALTERA TEMA
========================================
*/

function toggleTheme() {

    /*
    Verifica se está light
    */
    const isLight =
        document.body.classList.contains(
            "light-theme"
        );

    /*
    Alterna tema
    */
    if (isLight) {

        applyTheme("dark");

    } else {

        applyTheme("light");
    }
}


/*
========================================
INICIA TEMA
========================================
*/

loadTheme();


/*
========================================
EXPORTA FUNÇÃO GLOBAL
========================================
*/

window.toggleTheme =
    toggleTheme;