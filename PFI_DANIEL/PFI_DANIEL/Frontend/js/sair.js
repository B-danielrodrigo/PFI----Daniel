document.getElementById('sair').addEventListener('click', (event) => {
    event.preventDefault(); // Impede o comportamento padrão do link
    if (confirm('Tem certeza de que deseja sair?')) {
        localStorage.clear(); // Limpa todos os dados armazenados no localStorage
        alert('Você saiu com sucesso!');
        window.location.href = './login.html'; // Redireciona para a página de login
    }
});