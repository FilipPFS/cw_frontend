import { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { User } from "../components/SignlePost/SinglePost";

interface UserContextType {
  sessionUser: User | undefined;
  getSessionUser: () => Promise<void>;
  setSessionUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sessionUser, setSessionUser] = useState<User | undefined>(undefined);

  const getSessionUser = async () => {
    const token = localStorage.getItem("token");

    try {
      const response: AxiosResponse<User> = await axios.get(
        "http://localhost:5000/api/users/session",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSessionUser(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getSessionUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ sessionUser, getSessionUser, setSessionUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
