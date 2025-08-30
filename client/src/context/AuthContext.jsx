import { createContext, useContext, useReducer, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true, error: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case "AUTH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        token: null,
      };
    case "LOGOUT":
      return { ...state, user: null, token: null, loading: false };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token in API headers
  useEffect(() => {
    if (state.token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
      localStorage.setItem("token", state.token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [state.token]);

  // Check auth on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await api.get("/auth/me");
        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user: response.data.user, token },
        });
      } catch (error) {
        dispatch({ type: "AUTH_ERROR", payload: "Session expired" });
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await api.post("/auth/login", { email, password });
      dispatch({
        type: "AUTH_SUCCESS",
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      dispatch({ type: "AUTH_ERROR", payload: message });
      throw new Error(message);
    }
  };

  const register = async (name, email, password) => {
    try {
      dispatch({ type: "AUTH_START" });
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      dispatch({
        type: "AUTH_SUCCESS",
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      dispatch({ type: "AUTH_ERROR", payload: message });
      throw new Error(message);
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
