let paginaAtual = 1;
let limite = 5;  // Exemplo de 5 séries por página

function buscarSeries() {
    const titulo = document.getElementById('tituloSerie').value;
    const url = `http://localhost:3000/series?titulo=${titulo}&pagina=${paginaAtual}&limite=${limite}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            exibirSeries(data.series);
            atualizarControlesDePagina(data.total);
        })
        .catch(error => console.error('Erro ao buscar séries:', error));
}

function exibirSeries(series) {
    const seriesContainer = document.getElementById('seriesContainer');
    seriesContainer.innerHTML = '';  // Limpa os resultados anteriores
    
    series.forEach(serie => {
        const serieDiv = document.createElement('div');
        serieDiv.classList.add('filme');
        serieDiv.innerHTML = `
            <h4>${serie.titulo}</h4>
            <img src="${serie.poster}" alt="${serie.titulo}">
            <p>${serie.descricao}</p>
        `;
        seriesContainer.appendChild(serieDiv);
    });
}

function atualizarControlesDePagina(totalRegistros) {
    const totalPaginas = Math.ceil(totalRegistros / limite);
    document.getElementById('paginaAtual').innerText = `${paginaAtual} / ${totalPaginas}`;
}

function mudarPagina(direcao) {
    paginaAtual += direcao;
    if (paginaAtual < 1) {
        paginaAtual = 1;
    }
    buscarSeries();  // Recarrega as séries na nova página
}
