// const api_url = 'http://192.168.100.11:5000/api';
// const api_url = 'http://localhost:5000/api';
const api_url = 'http://192.168.3.101:5000/api';
// const api_url = 'http:// 10.200.255.21:5000/api';
//10.200.254.243


export const registerRequest = async (data) => {
    try {
        const response = await fetch(`${api_url}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Error: ${error.message || response.statusText}`);
        }

        const result = await response.json();
        console.log(result.statusCode);
        return result.statusCode
    } catch (error) {
        return error.message

    }
};

export const logInRequest = async (data) => {
    try {
        console.log("E1")
        const response = await fetch(`${api_url}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        console.log(response)
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Error: ${error.message || response.statusText}`);
        }

        const result = await response.json();
        console.log(result.statusCode, result);
        return result
    } catch (error) {
        return error.message

    }
};

export const automaticSignUp = async (data) => {
    try {
        console.log("E1", data)
        const response = await fetch(`${api_url}/users/automatic-signUp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        console.log("enter")

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Error: ${error.message || response.statusText}`);
        }

        const result = await response.json();
        console.log(result.statusCode, result);
        return result
    } catch (error) {
        return error.message

    }
}

