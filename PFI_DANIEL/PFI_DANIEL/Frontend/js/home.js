document.addEventListener('DOMContentLoaded', async () => {
    // Exibe o nome do usuário
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    if (nomeUsuario) {
        document.querySelector('#home h2 span').textContent = nomeUsuario;
    } else {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = './login.html';
    }

    // Carrega as tarefas urgentes
    const usuarioId = localStorage.getItem('usuarioId'); // Substitua pelo ID do usuário autenticado
    const tarefasUrgentesContainer = document.querySelector('#tarefasUrgentes ul');

    try {
        const response = await fetch(`http://localhost:3000/tarefas/${usuarioId}`);
        const tarefas = await response.json();

        // Filtra as tarefas urgentes (prazo em até 2 dias)
        const agora = new Date();
        const tarefasUrgentes = tarefas.filter((tarefa) => {
            const prazo = new Date(tarefa.prazo);
            const diferencaEmMilissegundos = prazo - agora;
            const diferencaEmDias = diferencaEmMilissegundos / (1000 * 60 * 60 * 24);
            return diferencaEmDias > 0 && diferencaEmDias <= 2;
        });

        // Atualiza a lista de tarefas urgentes
        tarefasUrgentesContainer.innerHTML = ''; // Limpa a lista antes de atualizar
        if (tarefasUrgentes.length === 0) {
            tarefasUrgentesContainer.innerHTML = '<li>Não há tarefas urgentes no momento.</li>';
        } else {
            tarefasUrgentes.forEach((tarefa) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${tarefa.titulo}</span>
                    <small>Vence em ${Math.ceil(
                        (new Date(tarefa.prazo) - agora) / (1000 * 60 * 60 * 24)
                    )} dia(s)</small>
                `;
                tarefasUrgentesContainer.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar tarefas urgentes:', error);
        tarefasUrgentesContainer.innerHTML = '<li>Erro ao carregar tarefas urgentes.</li>';
    }
});