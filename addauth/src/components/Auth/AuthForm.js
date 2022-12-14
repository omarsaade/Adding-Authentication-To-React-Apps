import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';
import { useHistory } from 'react-router-dom';


const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);


  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };





  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    setIsLoading(true);
    let url;



    if (isLogin) {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC6St6YTqMuqE2_3jy09LrAHqTuXGBOBFU";

    } else {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC6St6YTqMuqE2_3jy09LrAHqTuXGBOBFU";
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

    // send http request with fetch function
    fetch(url,
      {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: { 'Content-Type': 'application/json' }
        //handling errors and handling response
      })
      .then(async (res) => {
        //And once we got a response, so here,
        //no matter if it's an error or not, I wanna set is loading to false.
        setIsLoading(false);
        if (res.ok) {
          return res.json(); // console.log(res);
        } else {
          // this response data hold some extra info about error
          // const data = await res.json();
          //show an error message
          // console.log(data);
          // console.log(data.error.message);
          let errorMessage = 'Authentication failed!';
          // if (data && data.error && data.error.message) {
          //   errorMessage = data.error.message;
          // }
          throw new Error(errorMessage);
        }
      })
      .then((data) => {
        // console.log(data);//3600 * 1000 = 3 600 000
        // seconds to milliseocds dareb 1000
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000
        );
        //se3a
        authCtx.login(data.idToken, expirationTime.toISOString());
        // authCtx.login(data.idToken, data.expiresIn * 1000);
        history.replace('/');

      })
      .catch((err) => {
        alert(err.message);
      });
  };


  //

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending Request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
