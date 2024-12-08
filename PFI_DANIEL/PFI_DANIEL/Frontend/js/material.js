document.addEventListener('DOMContentLoaded', () => {
    const formMaterial = document.getElementById('formMaterial');
    const materiaisContainer = document.getElementById('materiaisContainer');
    const tituloInput = document.getElementById('tituloMaterial');
    const disciplinaInput = document.getElementById('disciplinaMaterial');
    const linkInput = document.getElementById('linkMaterial');
    const usuarioId = localStorage.getItem('usuarioId'); // Substitua pelo ID do usuário autenticado
    let editingMaterialId = null;

    // Carrega os materiais ao carregar a página
    carregarMateriais();

    // Evento de submissão do formulário
    formMaterial.addEventListener('submit', async (event) => {
        event.preventDefault();

        const material = {
            titulo: tituloInput.value,
            disciplina: disciplinaInput.value,
            link: linkInput.value,
            id_usuario: usuarioId,
        };

        if (editingMaterialId) {
            // Editar material existente
            material.id = editingMaterialId;
            await editarMaterial(material);
        } else {
            // Adicionar novo material
            await adicionarMaterial(material);
        }

        // Limpa o formulário e recarrega a lista de materiais
        formMaterial.reset();
        editingMaterialId = null;
        carregarMateriais();
    });

    // Função para carregar materiais
    async function carregarMateriais() {
        try {
            const response = await fetch(`http://localhost:3000/materiais/${usuarioId}`);
            const materiais = await response.json();

            materiaisContainer.innerHTML = ''; // Limpa o contêiner antes de atualizar
            materiais.forEach((material) => {
                const div = document.createElement('div');
                div.classList.add('material');
                div.innerHTML = `
                    <h3 class="titulo">${material.titulo}</h3>
                    <p class="disciplina">Disciplina: ${material.disciplina}</p>
                    <a href="${material.link}" target="_blank" class="link" >Acessar Material</a>
                    <div class="buttons">
                        <button class="editar" data-id="${material.id}">Editar</button>
                        <button class="excluir" data-id="${material.id}">Excluir</button>
                    </div>
                `;
                materiaisContainer.appendChild(div);
            });

            // Adiciona eventos aos botões de editar e excluir
            document.querySelectorAll('.editar').forEach((button) => {
                button.addEventListener('click', () => carregarFormulario(button.dataset.id));
            });

            document.querySelectorAll('.excluir').forEach((button) => {
                button.addEventListener('click', () => excluirMaterial(button.dataset.id));
            });
        } catch (error) {
            console.error('Erro ao carregar materiais:', error);
        }
    }

    // Função para adicionar material
    async function adicionarMaterial(material) {
        try {
            await fetch('http://localhost:3000/materiais', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(material),
            });
        } catch (error) {
            console.error('Erro ao adicionar material:', error);
        }
    }

    // Função para carregar um material no formulário para edição
    async function carregarFormulario(id) {
        try {
            const response = await fetch(`http://localhost:3000/materiais/${usuarioId}`);
            const materiais = await response.json();
            const material = materiais.find((m) => m.id == id);

            if (material) {
                editingMaterialId = material.id;
                tituloInput.value = material.titulo;
                disciplinaInput.value = material.disciplina;
                linkInput.value = material.link;
            }
        } catch (error) {
            console.error('Erro ao carregar material para edição:', error);
        }
    }

    // Função para editar material
    async function editarMaterial(material) {
        try {
            await fetch(`http://localhost:3000/materiais/${material.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(material),
            });
        } catch (error) {
            console.error('Erro ao editar material:', error);
        }
    }

    // Função para excluir material
    async function excluirMaterial(id) {
        try {
            await fetch(`http://localhost:3000/materiais/${id}`, {
                method: 'DELETE',
            });
            carregarMateriais(); // Atualiza a lista após a exclusão
        } catch (error) {
            console.error('Erro ao excluir material:', error);
        }
    }
});