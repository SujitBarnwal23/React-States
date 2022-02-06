import React, {
  useState,
  useEffect,
  useReducer,
  useContext,
  useRef,
} from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../Input/Input";
// we can pass the function outside because inside this reducer function we dont need any data i.e. generated inside of the reducer function
//it does not need to interact with anything inside of the component function
// all the data it required will be passed into it when it is executed by react automatically
const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.includes("@") };
  }
  return { value: "", isValid: false };
};
const passwordReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  const authCtx = useContext(AuthContext);
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: false,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: false,
  });

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // useEffect(() => {
  //   console.log("EFFECT RUNNING"); //runs after every keystroke in enteredPassword.
  //   return () => {
  //     console.log("Effect cleanUp"); //will run before the whole state function is run first time
  //   }; // when we remove the dependency the return will execute when the component is remove from DOM
  // }, [enteredPassword]);

  /// use the below code to overcome the running of useEffect even after the input is valid and adding more character in input will never change the value of validity
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("checking form validity"); // to set timeout to take all the entered value in a single take when the user stops typing for 5sec.
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      console.log("clean up code"); //this line is run always 1st, after the 1st component reuse is made.
      clearTimeout(identifier); //to clear the timer before setting the new timer in taking the value from input field
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    //using reducer
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
    //we need to use arrow function in setFormIsValid if the next state update depends on the prev state snapshot of the same state
    // but here we depend on the snapshot of different states The function has to be in the following form :-
    // setFormIsValid(() => {});
    // setFormIsValid(event.target.value.includes("@") && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    // setFormIsValid(
    //   enteredEmail.includes("@") && event.target.value.trim().length > 6
    // );
    //using Reducer
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
    setFormIsValid(emailState.isValid && passwordState.isValid);
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(enteredEmail.includes("@")); //we need use function here as at somepoint the react can take the previous entered value and check for validity
    //using reducer
    dispatchEmail({ type: "INPUT_BLUR" });
  }; //here setEmailIsValid always give the latest state update of emaiIsValid State not for the enteredEmail state

  const validatePasswordHandler = () => {
    // setPasswordIsValid(enteredPassword.trim().length > 6);
    //using reducer
    dispatchPassword({ type: "INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      //using reducer
      authCtx.onLogin(emailState.value, passwordState.value);
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
    // props.onLogin(enteredEmail, enteredPassword);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          id="email"
          label="E-Mail"
          type="email"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        ></Input>
        <Input
          ref={passwordInputRef}
          id="password"
          label="Password"
          type="password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        ></Input>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
