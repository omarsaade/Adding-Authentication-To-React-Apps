import { useState, useRef } from 'react';
import classes from './AuthForm.module.css';


const AuthForm = () => {


  const [isLogin, setIsLogin] = useState(true);


  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };




  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (isLogin) {


      //hello
    } else {
      // send http request with fetch function
      fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC6St6YTqMuqE2_3jy09LrAHqTuXGBOBFU",
        {
          method: 'POST',
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }),
          headers: { 'Content-Type': 'application/json' }
          //handling errors and handling response
        }).then((res) => {
          if (res.ok) {
            //...
            console.log(res);
          } else {
            // this response data hold some extra info about error
            return res.json().then((data) => {
              //show an error modal
              // console.log(data);
              // console.log(data.error.message);
            });
          }
        });


    }
  }



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
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
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
