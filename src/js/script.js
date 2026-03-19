async function carregarRepos() {
    // Resposta da API do GitHub para os repositórios do usuário
    const resposta = await fetch('https://api.github.com/users/davioli12/repos');

    // Conversão da resposta para JSON
    const repositorios = await resposta.json();

    const container = document.getElementById('projetos-github');

    // Percorrer todos os repositorios
    repositorios.forEach(repo => {
        const div = document.createElement('div');

        // Adiciona uma classe CSS
        div.classList.add('projeto');

        div.innerHTML = `
        <h3>${repo.name}</h3>
        <p class="repo-stars">⭐ ${repo.stargazers_count}</p>
        <p>Limguagem: ${repo.language || 'Não definida'}</p>
        <p class="description-project">${repo.description || 'Sem descrição'}</p>
        <a class="repo-link" href="${repo.html_url}" target="_blank"><p class='links-project'>Ver no GitHub</p></a>
    `;

        container.appendChild(div);
    });
}

carregarRepos();