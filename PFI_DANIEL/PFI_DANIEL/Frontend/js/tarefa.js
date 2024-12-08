document.addEventListener('DOMContentLoaded', () => {
    const formTarefa = document.getElementById('formTarefa');
    const tarefasContainer = document.getElementById('tarefasContainer');
    const tituloInput = document.getElementById('tituloTarefa');
    const descricaoInput = document.getElementById('descricaoTarefa');
    const prazoInput = document.getElementById('prazoTarefa');
    const prioridadeInput = document.getElementById('prioridadeTarefa');
    const idInput = document.getElementById('idTarefa');
    const usuarioId = localStorage.getItem('usuarioId'); // Substitua pelo ID do usuário autenticado

    // Carregar tarefas ao carregar a página
    carregarTarefas();

    // Evento de submissão do formulário
    formTarefa.addEventListener('submit', async (event) => {
        event.preventDefault();

        const tarefa = {
            titulo: tituloInput.value,
            descricao: descricaoInput.value,
            prazo: prazoInput.value,
            prioridade: prioridadeInput.value,
            id_usuario: usuarioId,
        };

        if (idInput.value) {
            // Editar tarefa
            tarefa.id = idInput.value;
            await editarTarefa(tarefa);
        } else {
            // Adicionar nova tarefa
            await adicionarTarefa(tarefa);
        }

        // Limpar formulário e recarregar tarefas
        formTarefa.reset();
        idInput.value = '';
        carregarTarefas();
    });

    // Função para carregar tarefas
    async function carregarTarefas() {
        try {
            const response = await fetch(`http://localhost:3000/tarefas/${usuarioId}`);
            const tarefas = await response.json();

            tarefasContainer.innerHTML = ''; // Limpa o contêiner antes de atualizar
            tarefas.forEach((tarefa) => {
                const li = document.createElement('li');
                li.classList.add('tarefa');
                li.innerHTML = `
                    <h3 class="titulo">${tarefa.titulo}</h3>
                    <p class="descricao">${tarefa.descricao}</p>
                    <p class="prazo" >Prazo: ${tarefa.prazo}</p>
                    <p class="prioridade-${tarefa.prioridade}">Prioridade: ${tarefa.prioridade}</p>
                    <div class="buttons">
                        <button class="editar" data-id="${tarefa.id}">Editar</button>
                        <button class="excluir" data-id="${tarefa.id}">Excluir</button>
                    <div>
                `;
                tarefasContainer.appendChild(li);
            });

            // Adiciona eventos aos botões de editar e excluir
            document.querySelectorAll('.editar').forEach((button) => {
                button.addEventListener('click', () => carregarFormulario(button.dataset.id));
            });

            document.querySelectorAll('.excluir').forEach((button) => {
                button.addEventListener('click', () => excluirTarefa(button.dataset.id));
            });
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error);
        }
    }

    // Função para adicionar tarefa
    async function adicionarTarefa(tarefa) {
        try {
            await fetch('http://localhost:3000/tarefas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tarefa),
            });
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
        }
    }

    // Função para carregar uma tarefa no formulário para edição
    async function carregarFormulario(id) {
        try {
            const response = await fetch(`http://localhost:3000/tarefas/${usuarioId}`);
            const tarefas = await response.json();
            const tarefa = tarefas.find((t) => t.id == id);

            if (tarefa) {
                idInput.value = tarefa.id;
                tituloInput.value = tarefa.titulo;
                descricaoInput.value = tarefa.descricao;
                prazoInput.value = tarefa.prazo;
                prioridadeInput.value = tarefa.prioridade;
            }
        } catch (error) {
            console.error('Erro ao carregar tarefa para edição:', error);
        }
    }

    // Função para editar tarefa
    async function editarTarefa(tarefa) {
        try {
            await fetch(`http://localhost:3000/tarefas/${tarefa.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tarefa),
            });
        } catch (error) {
            console.error('Erro ao editar tarefa:', error);
        }
    }

    // Função para excluir tarefa
    async function excluirTarefa(id) {
        try {
            await fetch(`http://localhost:3000/tarefas/${id}`, {
                method: 'DELETE',
            });
            carregarTarefas(); // Atualiza a lista após a exclusão
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    }
});
