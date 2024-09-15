document.addEventListener('DOMContentLoaded', () => {
    const formBusca = document.getElementById('formBusca');
    const inputBusca = document.getElementById('inputBusca');
    const seriesContainer = document.getElementById('seriesContainer');
    const paginaAtualElement = document.getElementById('paginaAtual');
    let paginaAtual = 1;
    const limite = 4;
    let totalPaginas = 1;

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
                        totalPaginas = Math.ceil(data.total / limite); // Atualiza o total de páginas
                        atualizarPaginacao();
                        scrollParaTopo();
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
                <img src="${serie.imagem}" alt="${serie.titulo}" style="width: 600px; height: 400px; object-fit: cover;" />
                <p><strong>Gêneros:</strong> ${serie.generos.join(', ')}</p>
                <p>${serie.resumo.replace(/<\/?p>/g, '')}</p>
            `;
            seriesContainer.appendChild(serieDiv);
        });
    }

    function atualizarPaginacao() {
        console.log('Atualizando paginação');
        paginaAtualElement.textContent = paginaAtual;
        document.querySelector('#paginationControls button:nth-child(1)').disabled = paginaAtual <= 1;
        document.querySelector('#paginationControls button:nth-child(3)').disabled = paginaAtual >= totalPaginas;
        
        document.getElementById('paginationControls').style.display = totalPaginas > 1 ? 'block' : 'none';
    }

    function mudarPagina(incremento) {
        const novaPagina = paginaAtual + incremento;

        if (novaPagina >= 1 && novaPagina <= totalPaginas) {
            paginaAtual = novaPagina;
            buscarSeries();
        }
    }

    function scrollParaTopo() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.querySelector('#paginationControls button:nth-child(1)').addEventListener('click', () => mudarPagina(-1));
    document.querySelector('#paginationControls button:nth-child(3)').addEventListener('click', () => mudarPagina(1));
    buscarSeries();
});