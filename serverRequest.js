// const api_url = 'http://192.168.100.11:5000/api';
// const api_url = 'http://localhost:5000/api';
const api_url = 'http://192.168.1.6:5000/api';
// const api_url = 'http:// 10.200.255.21:5000/api';
//10.200.254.243


export const saveChequeRequest = async (data) => {
    console.log("Saving cheque request...");
    console.log("Size of data:", new Blob([JSON.stringify(data)]).size, "bytes");

    try {
        const response = await fetch(`${api_url}/cheques/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Check if the response is not ok
        if (!response.ok) {
            const errorText = await response.text(); // Get the response text (in case it's not JSON)
            console.error("Error response body:", errorText);
            throw new Error(`Error: ${errorText || response.statusText}`);
        }

        // Try to parse JSON if the response is valid
        const result = await response.json();
        console.log("Response:", result);
        return result;
    } catch (error) {
        // Catch any JSON parsing errors or network errors
        console.error("Error occurred while saving cheque request:", error);
        return error.message; // Return the error message
    }
};

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

export const getmembersCheque = async () =>{
    try {
        console.log("response")
        const response = await fetch(`${api_url}/cheques/membercheque/67350c318bf3ff24bfc3a74e`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
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
}
export const getMembersPostedCheque = async () => {
    try {
        
        const response = await fetch(`${api_url}/cheques/memberpostedcheque`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const result = response.json();
        return result;
    } catch (error) {
        console.error("Error fetching member's posted cheques:", error.message);
        return { error: error.message };
    }
};

export const getAllMemberCheques = async () => {
    try {
        const response = await fetch(`${api_url}/cheques/allmembercheques`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        console.log(result)
        return result;
    } catch (error) {
        console.error("Error fetching member's posted cheques:", error.message);
        return { error: error.message };
    }
};


export const updateChequeStatus = async (messageId, status) => {
    try {
        const response = await fetch(`${api_url}/cheques/updatechequestatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"messageId":messageId, "status": status})
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching member's posted cheques:", error.message);
        return { error: error.message };
    }
};


export const getNotifications = async (membertype) => {
    console.log("ENTER")
    try {
        const response = await fetch(`${api_url}/cheques/get-notifications?memberType=${membertype}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        console.log(result)
        return result;
    } catch (error) {
        console.error("Error fetching member's posted cheques:", error.message);
        return { error: error.message };
    }
};






