import React, { useState } from 'react'


//Default Value
const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { }
});

//infer : istantej

export const AuthContextProvider = (props) => {

    const [token, setToken] = useState(null);
    //false cz there is no token / we use casting here 
    // So we don't even need a separate state for this.
    // We can infer it from this state.
    const userIsLoggedIn = !!token;

    const loginHandler = (token) => {
        setToken(token);
    }

    const logoutHandler = () => {
        setToken(null);
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