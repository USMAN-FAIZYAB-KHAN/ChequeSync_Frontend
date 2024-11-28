
import { auth } from "./global/global";

const token = auth.accessToken



const api_url = 'http://192.168.1.6:5000/api';
// const api_url = 'http://localhost:5000/api';
// const api_url = 'http://192.168.3.101:5000/api';
// const api_url = 'http:// 10.200.255.21:5000/api';
// const api_url = 'http://192.168.3.100:5000/api';
//10.200.254.243


export const saveChequeRequest = async (data) => {
    console.log(token)
    console.log("Saving cheque request...");
    console.log("Size of data:", new Blob([JSON.stringify(data)]).size, "bytes");

    try {
        const response = await fetch(`${api_url}/cheques/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${data.accessToken}`
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
                'authorization': `Bearer ${token}`
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

export const getmembersCheque = async (id, accessToken) => {
    try {
        console.log("response")
        const response = await fetch(`${api_url}/cheques/membercheque/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${accessToken}`
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
export const getMembersPostedCheque = async (accessToken) => {
    try {
        console.log('in server', accessToken)
        const response = await fetch(`${api_url}/cheques/memberpostedcheque`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${accessToken}`
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
export const getAllMemberCheques = async (month, year, accessToken) => {
    try {
        let url = `${api_url}/cheques/allmembercheques?year=${year}&month=${month}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${accessToken}`
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        if (result?.data?.cheques) {
            return result
        } else {
            return [];
        }


    } catch (error) {
        console.error("Error fetching member's filtered cheques:", error.message)
    }
};


export const getUserdetail = async (userId, accessToken) => {
    try {
        console.log("1",accessToken)
        console.log("2")
        const url = `${api_url}/users/getuserdetail`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        console.log(response)
        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Error fetching user details:", error.message);
        throw error;
    }
};

export const updatepassword = async (userId, confirmpswd) => {
    try {
        console.log("INUpdate..........")
        const url = `${api_url}/users/updatepassword`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId, confirmpswd }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log("serverRequest.................", result)
        return result;

    } catch (error) {
        console.error("Error fetching user details:", error.message);
        throw error; // Rethrow the error to handle it where the function is called
    }
}
export const checkoldpassword = async (userId, oldpswd, accessToken) => {
    try {
        console.log("INcheck..........", accessToken)
        const url = `${api_url}/users/checloldpassword`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ userId, oldpswd }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log("serverRequest.................", result)
        return result;

    } catch (error) {
        console.error("Error fetching user details:", error.message);
        throw error; // Rethrow the error to handle it where the function is called
    }
}


export const updateChequeStatus = async (messageId, status, message = null, image = null, Role = null) => {
    console.log("BramchMnagerinupate.......................", messageId, status, Role)
    try {
        const response = await fetch(`${api_url}/cheques/updatechequestatus`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ "messageId": messageId, "status": status, "message": message, "image": image, "Role": Role })
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


export const getNotifications = async (membertype, _id = null, accessToken=null) => {
    console.log("ENTER", _id)
    try {
        const response = await fetch(`${api_url}/cheques/get-notifications?memberType=${membertype}&id=${_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${accessToken}`
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


export const getBranchReceivedCheque = async (accessToken) => {
    console.log("ENT")
    try {

        const response = await fetch(`${api_url}/cheques/branchReceivedCheques`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${accessToken}`
            },
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const result = response.json();
        console.log(result)
        return result;
    } catch (error) {
        console.error("Error fetching member's received cheques:", error.message);
        return { error: error.message };
    }
};






