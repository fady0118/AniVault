import { createContext, useContext, useState, useEffect } from "react";
import { account, ID, storage, tablesDB } from "../appwrite";

export const AuthContext = createContext(null);
export default function AuthProvider({ children }) {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [avatarImg, setAvatarImg] = useState(null);

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
        setUserData(null);
        setAvatarImg(null);
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

  useEffect(() => {
    // fetch user Data on loggedInUser change
    async function getUserData() {
      if (!loggedInUser) return;
      const result = await tablesDB.getRow({
        databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
        tableId: import.meta.env.VITE_TABLE_ID_USER_PROFILE,
        rowId: loggedInUser.$id,
      });
      setUserData(result);
    }
    getUserData();
  }, [loggedInUser]);

  // fetch avatarImg and update its local state
  async function fetchAvatarFromBucket(id) {
    if (!id) return;
    try {
      const res = await storage.getFileView({
        bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
        fileId: id,
      });
      if (res.code >= 400) return;
      setAvatarImg(res);
    } catch (error) {
      console.log(error);
    }
  }
  // if the user changes or his data change refetch the avatar from storage
  useEffect(() => {
    if (!loggedInUser) return;
    if (!userData) return;
    fetchAvatarFromBucket(userData.avatarId);
  }, [loggedInUser, userData]);

  return <AuthContext value={{ login, register, logout, init, loggedInUser, setLoggedInUser, userData, setUserData, avatarImg, setAvatarImg }}>{children}</AuthContext>;
}

// custom auth hook
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
