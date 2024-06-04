import { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

const initialState={
    user: null,
    isAuthenticated: false,
}

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
       ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case "logout":
      return {
       ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      throw new Error("Unknown action");
  }
}

const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
  };

function AuthProvider({ children }) {
    const [{user,isAuthenticated}, dispatch] = useReducer(reducer, initialState);
   

    function login(email, password) {
        if (email === FAKE_USER.email && password === FAKE_USER.password) {
            dispatch({ type: "login", payload: FAKE_USER });
        } else {
            dispatch({ type: "login", payload: null });
        }
    }

    function logout() {
        dispatch({ type: "logout" });
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth(){
    const context = useContext(AuthContext);
    if(context===undefined){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

AuthProvider.propTypes={
    children: PropTypes.node.isRequired
};

export { AuthProvider, useAuth };