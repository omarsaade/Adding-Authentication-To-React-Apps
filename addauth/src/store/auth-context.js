import React, { useState, useEffect, useCallback } from 'react'

//Global Variable
//bteshtegel la hala
//initially undefined
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
    const storedToken = localStorage.getItem('token');// hsaye262
    const storedExpirationDate = localStorage.getItem('expirationTime');// 1,5 mins
    const remainingTime = calculateRemainingTime(storedExpirationDate); // 90 mins

    if (remainingTime <= 60000) { // < 1 min
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
    // console.log(tokenData);
    console.log(tokenData); //{token: 'eyJhbGciOiJwtdw', duration: 3401577}
    let initialToken;
    if (tokenData) {
        initialToken = tokenData.token; //eyJhbGciOiJwtdw
    }
    // initially initialToken is undefined
    const [token, setToken] = useState(initialToken);
    //false cz there is no token / we use casting here 
    // So we don't even need a separate state for this.
    // We can infer it from this state.
    const userIsLoggedIn = !!token;//true






    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);





    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime);

        const remainingTime = calculateRemainingTime(expirationTime);
        logoutTimer = setTimeout(logoutHandler, remainingTime); //1000ms

    }




    useEffect(() => {
        // console.log("hello");
        if (tokenData) {
            console.log(tokenData.duration);
            logoutTimer = setTimeout(logoutHandler, tokenData.duration); //1000ms
        }
    }, [tokenData, logoutHandler]);




    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    }


    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}




export default AuthContext;