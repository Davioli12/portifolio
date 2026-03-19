const certificados = [
    { nome: "certificado-0-ao-programador-contratado-DevEmDobro.png", titulo: "Aula: 0 ao Programador Contratado #DevEmDobro" },
    { nome: "certificado-imersao-DevEmDobro.jpeg", titulo: "Aula: Imersão Dev do futuro #DevEmDobro" },
    { nome: "certificado-PythonBasic-Solyd.png", titulo: "Python Básico - Solyd" },
];

const container = document.getElementById("certificados");

// segurança: verifica se o elemento existe
if (container) {

    certificados.forEach(cert => {

        const div = document.createElement("div");
        div.classList.add("cert-card");

        // cria elementos separados (melhor prática que innerHTML)
        const titulo = document.createElement("h3");
        titulo.textContent = cert.titulo;

        const img = document.createElement("img");
        img.src = `img/certificado/${cert.nome}`;
        img.alt = cert.titulo;

        // fallback se imagem não carregar
        img.onerror = () => {
            img.src = "img/user.png";
        };

        div.appendChild(titulo);
        div.appendChild(img);

        container.appendChild(div);
    });

}