const api_url = 'http://192.168.100.11:5000/api';


export const registerRequest = async (data) => {
    try {
        console.log("E1")
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

