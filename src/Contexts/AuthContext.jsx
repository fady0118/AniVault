import { createContext, useContext, useState } from "react";
import { account, ID } from "../appwrite";

export const AuthContext = createContext(null);
export default function AuthProvider({ children }) {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userData, setUserData] = useState(null);

  async function login(email, password) {
    await account.createEmailPasswordSession({
      email,
      password,
    });
    setLoggedInUser(await account.get());
  }

  async function register(email, password, name) {
    const user = await account.create({
      userId: ID.unique(),
      email: email,
      password: password,
      name: name,
    });
    await login(email, password);
    return user;
  }

  async function logout() {
    await account.deleteSession("current");
    try {
      const user = await account.get(); // throws 401 if no session
    } catch (error) {
      if (error?.code === 401) {
        // reset user state
        setLoggedInUser(null);
      } else {
        // session deletion failed
        throw error;
      }
    }
  }

  async function init() {
    try {
      const user = await account.get();
      setLoggedInUser(user);
    } catch (e) {
      // no session found
    }
  }

  return <AuthContext value={{ login, register, logout, init, loggedInUser, setLoggedInUser, userData, setUserData }}>{children}</AuthContext>;
}

// custom auth hook
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
