import axios from 'axios'


const isUsernameExist = async (username) => {
    let res;
    await axios.get(`${import.meta.env.VITE_BACKEND_URL}auth/checkusername/${username == "" ? " " : username}`)
    .then(rp=> res = rp)
    .catch(error=> res = error.response);
    if(res.status === 200){
        return [true, res.data];
    } else {
        return [false, null]
    }
}

const createUser = async (user) => {
    let res;
    await axios.post(
        import.meta.env.VITE_BACKEND_URL +"auth/signin", 
        user, 
        {
            'Content-Type': 'multipart/form-data'
        }
    ).then(resp=>{
        res = resp;
    })
    .catch((e)=>{
        res = e.response
    });
    return res;
}

const loginUser = async (user) => {
    let res;
    await axios.post(
        import.meta.env.VITE_BACKEND_URL +"auth/login", 
        user, 
        {
            'Content-Type': 'application/json',
            withCredentials: true,
        }
    ).then(resp=>{
        res = resp;
    })
    .catch((e)=>{
        res = e.response
    });
    return res;
}

const logoutUser = async () => {
    let res;
    await axios.post(import.meta.env.VITE_BACKEND_URL +"auth/logout",{},{withCredentials:true})
    .then(rs=>res=rs)
    .catch(error=> res = error);
    return res;
}


const decodeJWT = (token)=>{
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e){
        return null;
    }
}

const isTokenExpired = (token) => {
    const decoded = decodeJWT(token);
    if(decoded && decoded.exp){
        return decoded.exp * 1000 < Date.now();
    }
    return true;
}

const refreshAccessToken = async () => {
    try {
        const res = await axios.post(import.meta.env.VITE_BACKEND_URL +"auth/refreshtoken",{},{withCredentials:true});

        if (res.status === 200 && res.data?.accessToken) {
            localStorage.setItem('accessToken', res.data.accessToken);
            return true;
        }
        return false;
    } catch (error) {
        console.log("Error refreshing access token:", error);
        return false;   
    }
}

const isLoggedIn = async (token) => {
    if(token && !isTokenExpired(token)){
        return true;
    } else if (token && isTokenExpired(token)) {
        const success = await refreshAccessToken();
        return success;
    }
    return false;
}

export {
    isUsernameExist, 
    createUser, 
    loginUser, 
    logoutUser, 
    decodeJWT, 
    isTokenExpired, 
    isLoggedIn, 
    refreshAccessToken
};