function saveCredentialsToLocalStorage(login: string, password: string): void {
    try {
        localStorage.setItem('login', login);
        localStorage.setItem('password', password);
    } catch (error) {
        console.error('Erro ao salvar as credenciais no localStorage:', error);
    }
}

function getCredentialsFromLocalStorage(): { login: string | null, password: string | null } {
    const login = localStorage.getItem('login');
    const password = localStorage.getItem('password');

return { login, password };
}

function isValid(login: string, password: string): Promise<boolean> {
	return new Promise((res, rej) => {
		setTimeout(() => {
			if (login === "admin" && password === "admin")
				res(true)

			res(false)
		}, 1000);
	
	})
}

export async function login(
    login: string,
    passwd: string
) {
    saveCredentialsToLocalStorage(login, passwd);
    return await isValid(login, passwd);
}