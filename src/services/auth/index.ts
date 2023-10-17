import axios from 'axios';
import { createFinalUrl } from '../utils';

const apiUrl = process.env["NEXT_PUBLIC_API_URL"] || "";
const authEndpoint = createFinalUrl(apiUrl, "/users?auth");

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
