document.addEventListener('DOMContentLoaded', () => {
    const formAnotacao = document.getElementById('formAnotacao');
    const anotacoesContainer = document.getElementById('anotacoesContainer');
    const conteudoInput = document.getElementById('conteudoAnotacao');
    const usuarioId = localStorage.getItem('usuarioId'); // Substitua pelo ID do usuário autenticado
    let editingAnotacaoId = null;

    // Carrega as anotações ao carregar a página
    carregarAnotacoes();

    // Evento de submissão do formulário
    formAnotacao.addEventListener('submit', async (event) => {
        event.preventDefault();

        const anotacao = {
            conteudo: conteudoInput.value,
            id_usuario: usuarioId,
        };

        if (editingAnotacaoId) {
            // Editar anotação existente
            anotacao.id = editingAnotacaoId;
            await editarAnotacao(anotacao);
        } else {
            // Adicionar nova anotação
            await adicionarAnotacao(anotacao);
        }

        // Limpa o formulário e recarrega a lista de anotações
        formAnotacao.reset();
        editingAnotacaoId = null;
        carregarAnotacoes();
    });

    // Função para carregar anotações
    async function carregarAnotacoes() {
        try {
            const response = await fetch(`http://localhost:3000/anotacoes/${usuarioId}`);
            const anotacoes = await response.json();

            anotacoesContainer.innerHTML = ''; // Limpa o contêiner antes de atualizar
            anotacoes.forEach((anotacao) => {
                const div = document.createElement('div');
                div.classList.add('container-item');
                div.innerHTML = `
                    <p>${anotacao.conteudo}</p>
                    <div class="buttons">
                        <button class="editar" data-id="${anotacao.id}">Editar</button>
                        <button class="excluir" data-id="${anotacao.id}">Excluir</button>
                    </div>
                `;
                anotacoesContainer.appendChild(div);
            });

            // Adiciona eventos aos botões de editar e excluir
            document.querySelectorAll('.editar').forEach((button) => {
                button.addEventListener('click', () => carregarFormulario(button.dataset.id));
            });

            document.querySelectorAll('.excluir').forEach((button) => {
                button.addEventListener('click', () => excluirAnotacao(button.dataset.id));
            });
        } catch (error) {
            console.error('Erro ao carregar anotações:', error);
        }
    }

    // Função para adicionar anotação
    async function adicionarAnotacao(anotacao) {
        try {
            await fetch('http://localhost:3000/anotacoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(anotacao),
            });
        } catch (error) {
            console.error('Erro ao adicionar anotação:', error);
        }
    }

    // Função para carregar uma anotação no formulário para edição
    async function carregarFormulario(id) {
        try {
            const response = await fetch(`http://localhost:3000/anotacoes/${usuarioId}`);
            const anotacoes = await response.json();
            const anotacao = anotacoes.find((a) => a.id == id);

            if (anotacao) {
                editingAnotacaoId = anotacao.id;
                conteudoInput.value = anotacao.conteudo;
            }
        } catch (error) {
            console.error('Erro ao carregar anotação para edição:', error);
        }
    }

    // Função para editar anotação
    async function editarAnotacao(anotacao) {
        try {
            await fetch(`http://localhost:3000/anotacoes/${anotacao.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(anotacao),
            });
        } catch (error) {
            console.error('Erro ao editar anotação:', error);
        }
    }

    // Função para excluir anotação
    async function excluirAnotacao(id) {
        try {
            await fetch(`http://localhost:3000/anotacoes/${id}`, {
                method: 'DELETE',
            });
            carregarAnotacoes(); // Atualiza a lista após a exclusão
        } catch (error) {
            console.error('Erro ao excluir anotação:', error);
        }
    }
});
