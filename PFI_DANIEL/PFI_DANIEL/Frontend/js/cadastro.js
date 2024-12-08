document.getElementById('buttonCadastrar').addEventListener('click', async () => {
    // Captura os valores dos campos
    const email = document.getElementById('email').value;
    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    // Verifica se os campos estão preenchidos
    if (!email || !nome || !senha) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    try {
        // Faz a requisição ao backend para cadastrar o usuário
        const response = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, nome, senha }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            // Cadastro bem-sucedido: redireciona para login.html
            window.location.href = 'login.html';
        } else {
            // Exibe mensagem de erro do backend
            alert(data.message || 'Erro ao cadastrar. Tente novamente.');
        }
        } catch (error) {
            // Trata erros de rede ou no fetch
            console.error('Erro ao cadastrar usuário:', error);
            alert('Erro ao cadastrar. Tente novamente mais tarde.');
        }
});

