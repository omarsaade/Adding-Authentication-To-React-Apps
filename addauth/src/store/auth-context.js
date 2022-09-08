import React, { useState } from 'react'



//Default Value
const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { }
});


// Methods
const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime(); //time now
    const adjExpirationTime = new Date(expirationTime).getTime();//time baad se3a
    const remainingDuration = adjExpirationTime - currentTime;//
    return remainingDuration; //nes se3a
}



//infer : istantej
export const AuthContextProvider = (props) => {
    const initialToken = localStorage.getItem('token');
    // initially initialToken is undefined
    const [token, setToken] = useState(initialToken);
    //false cz there is no token / we use casting here 
    // So we don't even need a separate state for this.
    // We can infer it from this state.
    const userIsLoggedIn = !!token;//true





    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem('token');
    }





    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);

        const remainingTime = calculateRemainingTime(expirationTime);
        setTimeout(logoutHandler, remainingTime);
    }




    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    }


    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}




export default AuthContext;