document.querySelector('button').addEventListener('click', async () => {
    // Captura os valores dos campos de email e senha
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Verifica se os campos estão preenchidos
    if (!email || !senha) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    try {
        // Faz a requisição ao backend para verificar as credenciais
        const response = await fetch('http://localhost:3000/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            // Login bem-sucedido: salva o nome do usuário no localStorage e redireciona
            localStorage.setItem('nomeUsuario', data.usuario.nome);
            localStorage.setItem('usuarioId', data.usuario.id); // Armazena o ID do usuário
            // Login bem-sucedido: redireciona para a página home.html
            alert('Login realizado com sucesso!');
            window.location.href = './home.html';
        } else {
            // Exibe a mensagem de erro retornada pelo backend
            alert(data.message || 'Erro ao fazer login. Verifique suas credenciais.');
        }
    } catch (error) {
        // Trata erros de rede ou no fetch
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login. Tente novamente mais tarde.');
    }
});