import axios from 'axios';

const authEndpoint = 'http://10.11.19.26:8091/users?auth';

export const loginUser = async (email: string, passwd: string, loginType: string) => {
    const data = `userEmail=${encodeURIComponent(email)}&userPass=${encodeURIComponent(passwd)}&REQUEST_ATTR_USER_EGI=${encodeURIComponent(loginType === 'egi' ? 'EGI_VALUE' : '')}`;

    console.log("Dados enviados:", data);

    const response = await axios.post(authEndpoint, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    return response.data;
};
