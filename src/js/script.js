/*
========================================
ELEMENTOS HTML
========================================
*/

const searchInput =
    document.getElementById("search");

const projectsContainer =
    document.getElementById("projects");

const clearCacheBtn =
    document.getElementById("clear-cache-btn");


/*
========================================
CONFIGURAÇÕES
========================================
*/

/*
30 minutos
*/
const CACHE_TIME =
    1000 * 60 * 30;

/*
Nome do cache
*/
const CACHE_KEY =
    "projects_cache";

/*
Usuário GitHub
*/

site = window.location.hostname;

console.log("site:", site);

const GITHUB_USER =
    "davioli12";


/*
========================================
PESQUISA
========================================
*/

searchInput.addEventListener(
    "input",

    function () {

        /*
        Texto digitado
        */
        const term =
            this.value.toLowerCase();

        /*
        Captura cards
        */
        const projectCards =
            document.querySelectorAll(".project");

        /*
        Percorre cards
        */
        projectCards.forEach((card) => {

            /*
            Nome
            */
            const title =
                card.querySelector("h2")
                    .textContent
                    .toLowerCase();

            /*
            Descrição
            */
            const description =
                card.querySelector(".project-description")
                    .textContent
                    .toLowerCase();

            /*
            Verifica pesquisa
            */
            if (
                title.includes(term) ||
                description.includes(term)
            ) {

                card.style.display =
                    "block";

            } else {

                card.style.display =
                    "none";
            }
        });
    }
);


/*
========================================
FUNÇÃO PRINCIPAL
========================================
*/

async function carregarProjetos() {

    try {

        /*
        ========================================
        VERIFICA CACHE
        ========================================
        */

        const cache =
            localStorage.getItem(
                CACHE_KEY
            );

        /*
        Se existir cache
        */
        if (cache) {

            const parsedCache =
                JSON.parse(cache);

            const now =
                Date.now();

            const isValid =
                now - parsedCache.timestamp <
                CACHE_TIME;

            /*
            Usa cache
            */
            if (isValid) {

                console.log(
                    "Usando cache..."
                );

                renderizarProjetos(
                    parsedCache.data
                );

                return;
            }
        }


        /*
        ========================================
        BUSCA REPOSITÓRIOS
        ========================================
        */

        console.log(
            "Buscando GitHub..."
        );

        const reposResponse =
            await fetch(
                `https://api.github.com/users/${GITHUB_USER}/repos`
            );

        const repos =
            await reposResponse.json();


        /*
        ========================================
        LÊ projects.json
        ========================================
        */

        let projectsData = [];

        try {
            console.log("Lendo JSON...");

            const projectsResponse =
                await fetch("./src/projects.json");

            if (!projectsResponse.ok) {
                throw new Error(
                    `HTTP ${projectsResponse.status}`
                );
            }

            projectsData =
                await projectsResponse.json();

            console.log("projects.json carregado!");

        } catch (error) {

            console.warn(
                "Não foi possível carregar projects.json.",
                "Continuando sem personalizações.",
                error
            );

            projectsData = [];
        }


        /*
        ========================================
        ARRAY FINAL
        ========================================
        */

        const projetos = [];


        /*
        ========================================
        PROCESSA REPOSITÓRIOS DA API
        ========================================
        */

        for (const repo of repos) {

            /*
            Busca customização
            */
            try {
                const customProject =
                    projectsData.find(
                        (item) =>

                            item.repo
                                .toLowerCase() ===

                            repo.name
                                .toLowerCase()
                    );


                /*
                Ignora projetos ocultos
                */
                if (
                    customProject &&
                    customProject.view === false
                ) {
                    continue;
                }


                /*
                Projeto final
                */
                const finalProject = {

                    /*
                    Repo
                    */
                    repo:
                        repo.name,

                    /*
                    Nome
                    */
                    nome:
                        customProject?.nome ||
                        repo.name,

                    /*
                    Descrição
                    */
                    descricao:
                        customProject?.descricao ||
                        repo.description ||
                        "Sem descrição",

                    /*
                    Imagem
                    */
                    imagem:
                        customProject?.imagem ||
                        null,

                    /*
                    Destaque
                    */
                    destaque:
                        customProject?.destaque ||
                        false,

                    /*
                    Linguagem
                    */
                    linguagem:
                        customProject?.linguagem ||
                        repo.language ||
                        "N/A",

                    /*
                    Link
                    */
                    link:
                        customProject?.link ||
                        repo.html_url,

                    /*
                    Stars
                    */
                    stars:
                        customProject?.stars ??
                        repo.stargazers_count,

                    /*
                    Forks
                    */
                    forks:
                        customProject?.forks ??
                        repo.forks_count,

                    /*
                    Atualização
                    */
                    atualizado:
                        customProject?.atualizado ||
                        repo.updated_at
                };


                /*
                Adiciona projeto
                */
                projetos.push(
                    finalProject
                );

            } catch (error) {
                console.error("Erro ao processar projeto:", error);

            }


            /*
            ========================================
            ADICIONA PROJETOS
            APENAS DO JSON
            ========================================
            */

            for (const projeto of projectsData) {

                /*
                Ignora ocultos
                */
                if (
                    projeto.view === false
                ) {
                    continue;
                }

                /*
                Verifica se já existe
                */
                const alreadyExists =
                    projetos.some(
                        (item) =>

                            item.repo
                                .toLowerCase() ===

                            projeto.repo
                                .toLowerCase()
                    );

                /*
                Se já existir
                */
                if (alreadyExists) {
                    continue;
                }


                /*
                Cria projeto manual
                */
                projetos.push({

                    repo:
                        projeto.repo ||

                        "manual-project",

                    nome:
                        projeto.nome ||

                        projeto.repo ||

                        "Projeto sem nome",

                    descricao:
                        projeto.descricao ||

                        "Sem descrição",

                    imagem:
                        projeto.imagem ||

                        null,

                    destaque:
                        projeto.destaque ||

                        false,

                    linguagem:
                        projeto.linguagem ||

                        "N/A",

                    link:
                        projeto.link ||

                        "#",

                    stars:
                        projeto.stars ??

                        0,

                    forks:
                        projeto.forks ??

                        0,

                    atualizado:
                        projeto.atualizado ||

                        null
                });
            }


            /*
            ========================================
            ORDENA PROJETOS
            ========================================
            */

            projetos.sort((a, b) => {

                /*
                Destaques primeiro
                */
                if (
                    a.destaque &&
                    !b.destaque
                ) {
                    return -1;
                }

                if (
                    !a.destaque &&
                    b.destaque
                ) {
                    return 1;
                }

                /*
                Mais estrelas primeiro
                */
                return (
                    b.stars - a.stars
                );
            });


            /*
            ========================================
            SALVA CACHE
            ========================================
            */

            localStorage.setItem(

                CACHE_KEY,

                JSON.stringify({

                    timestamp:
                        Date.now(),

                    data:
                        projetos
                })
            );


            /*
            ========================================
            RENDERIZA
            ========================================
            */

            renderizarProjetos(
                projetos
            );
        }
    } catch (error) {

        console.error(
            "Erro ao carregar projetos:",
            error
        );
    }
}


/*
========================================
RENDERIZAÇÃO
========================================
*/

function renderizarProjetos(projetos) {

    /*
    Limpa container
    */
    projectsContainer.innerHTML =
        "";


    /*
    Percorre projetos
    */
    projetos.forEach((projeto) => {

        /*
        Cria card
        */
        const card =
            document.createElement(
                "section"
            );

        /*
        Classe CSS
        */
        card.className =
            "project";


        /*
        Destaque
        */
        if (projeto.destaque) {

            card.classList.add(
                "featured"
            );
        }


        /*
        Imagem opcional
        */
        const imageHTML =
            projeto.imagem

                ? `
                    <img
                        src="${projeto.imagem}"
                        alt="${projeto.nome}"
                        class="project-image"
                    >
                  `

                : "";


        /*
        HTML do card
        */
        card.innerHTML = `

            ${imageHTML}

            <h2>
                ${projeto.nome}
            </h2>

            <p class="project-description">
                ${projeto.descricao}
            </p>

            <p>
                💻 ${projeto.linguagem}
            </p>

            <p>
                ⭐ ${projeto.stars}
            </p>

            <p>
                🍴 ${projeto.forks}
            </p>

            <a
                href="${projeto.link}"
                target="_blank"
            >
                Abrir Projeto
            </a>
        `;


        /*
        Adiciona card
        */
        projectsContainer.appendChild(
            card
        );
    });
}


/*
========================================
LIMPAR CACHE
========================================
*/

clearCacheBtn.addEventListener(

    "click",

    () => {

        /*
        Remove cache
        */
        localStorage.removeItem(
            CACHE_KEY
        );

        /*
        Feedback
        */
        alert(
            "Cache apagado!"
        );

        /*
        Recarrega página
        */
        location.reload();
    }
);


/*
========================================
INICIA SISTEMA
========================================
*/

carregarProjetos();