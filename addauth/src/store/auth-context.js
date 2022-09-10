import React, { useState, useEffect } from 'react'

//Global Variable
let logoutTimer;

//Default Value
const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { }
});



// Methods
const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime(); //time now 11000ms
    //erpiration time me3tberbina string bteje
    const adjExpirationTime = new Date(expirationTime).getTime();//time baad se3a 12000ms
    const remainingDuration = adjExpirationTime - currentTime;// 1000ms
    return remainingDuration; //nes se3a 1000ms
}


const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime');
    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if (remainingTime <= 60000) {
        localStorage.removeItem('item');
        localStorage.removeItem('expirationTime');
        return null;
    }

    return {
        token: storedToken,
        duration: remainingTime
    }

}

//infer : istantej
export const AuthContextProvider = (props) => {
    const tokenData = retrieveStoredToken();
    let initialToken;
    if (tokenData) {
        initialToken = tokenData.token;
    }
    // initially initialToken is undefined
    const [token, setToken] = useState(initialToken);
    //false cz there is no token / we use casting here 
    // So we don't even need a separate state for this.
    // We can infer it from this state.
    const userIsLoggedIn = !!token;//true





    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }





    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime);

        const remainingTime = calculateRemainingTime(expirationTime);
        logoutTimer = setTimeout(logoutHandler, remainingTime); //1000ms

    }


    useEffect(() => {
        if (tokenData) {
            console.log(tokenData.duration);
            logoutTimer = setTimeout(logoutHandler, tokenData.duration); //1000ms
        }
    }, [tokenData]);


    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    }


    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}




export default AuthContext;