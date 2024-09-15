let paginaAtual = 1;
let limitePorPagina = 5;

function buscarSeries(titulo, pagina = 1, limite = 5) {
    const url = `http://localhost:3000/series?titulo=${encodeURIComponent(titulo)}&pagina=${pagina}&limite=${limite}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            mostrarSeries(data.series);
            atualizarPaginacao(data.totalSeries, pagina, limite);
        })
        .catch(error => console.error('Erro ao buscar séries:', error));
}

function mostrarSeries(series) {
    const seriesContainer = document.getElementById('seriesContainer');
    seriesContainer.innerHTML = ''; // Limpa os resultados anteriores

    series.forEach(serie => {
        const serieDiv = document.createElement('div');
        serieDiv.className = 'filme';
        serieDiv.innerHTML = `
            <img src="${serie.imagem}" alt="${serie.titulo}">
            <h4>${serie.titulo}</h4>
        `;
        seriesContainer.appendChild(serieDiv);
    });
}

function atualizarPaginacao(totalSeries, paginaAtual, limite) {
    const totalPaginas = Math.ceil(totalSeries / limite);
    const paginacao = document.getElementById('paginacao');

    paginacao.innerHTML = '';

    if (paginaAtual > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.onclick = () => buscarSeries(document.getElementById('inputBusca').value, paginaAtual - 1, limite);
        paginacao.appendChild(prevButton);
    }

    if (paginaAtual < totalPaginas) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Próximo';
        nextButton.onclick = () => buscarSeries(document.getElementById('inputBusca').value, paginaAtual + 1, limite);
        paginacao.appendChild(nextButton);
    }
}

document.getElementById('formBusca').addEventListener('submit', function(e) {
    e.preventDefault();
    const titulo = document.getElementById('inputBusca').value;
    buscarSeries(titulo, 1, limitePorPagina); // Reinicia a busca da página 1
});