document.addEventListener('DOMContentLoaded', () => {
    const formBusca = document.getElementById('formBusca');
    const inputBusca = document.getElementById('inputBusca');
    const seriesContainer = document.getElementById('seriesContainer');
    const paginaAtualElement = document.getElementById('paginaAtual');
    let paginaAtual = 1;
    let limite = 10;

    formBusca.addEventListener('submit', (event) => {
        event.preventDefault();
        buscarSeries();
    });

    function buscarSeries() {
        const titulo = inputBusca.value.trim();
        if (titulo) {
            console.log(`Buscando séries com título: ${titulo}`);
            fetch(`http://localhost:3000/series?titulo=${encodeURIComponent(titulo)}&pagina=${paginaAtual}&limite=${limite}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Dados recebidos:', data);
                    if (data && Array.isArray(data.data)) {
                        exibirSeries(data.data);
                        atualizarPaginacao(data.total);
                    } else {
                        console.error('Formato inesperado dos dados:', data);
                        seriesContainer.innerHTML = '<p>Não foram encontradas séries.</p>';
                    }
                })
                .catch(error => console.error('Erro ao buscar séries:', error));
        } else {
            console.log('Título não fornecido');
        }
    }

    function exibirSeries(series) {
        console.log('Exibindo séries:', series);
        seriesContainer.innerHTML = '';
        series.forEach(serie => {
            const serieDiv = document.createElement('div');
            serieDiv.className = 'serie';
            serieDiv.innerHTML = `
                <h3>${serie.titulo}</h3>
                <img src="${serie.imagem}" alt="${serie.titulo}" />
                <p>${serie.resumo.replace(/<\/?p>/g, '')}</p>
            `;
            seriesContainer.appendChild(serieDiv);
        });
    }

    function atualizarPaginacao(total) {
        console.log('Atualizando paginação:', total);
        const totalPaginas = Math.ceil(total / limite);
        paginaAtualElement.textContent = paginaAtual;
        document.getElementById('paginationControls').style.display = totalPaginas > 1 ? 'block' : 'none';
    }

    function mudarPagina(incremento) {
        console.log(`Mudando página: ${incremento}`);
        const novaPagina = paginaAtual + incremento;

        if (novaPagina >= 1) {
            paginaAtual = novaPagina;
            buscarSeries();
        }
    }

    document.querySelector('#paginationControls button:nth-child(1)').addEventListener('click', () => mudarPagina(-1));
    document.querySelector('#paginationControls button:nth-child(3)').addEventListener('click', () => mudarPagina(1));

    // Inicializa a busca com a página 1
    buscarSeries();
});