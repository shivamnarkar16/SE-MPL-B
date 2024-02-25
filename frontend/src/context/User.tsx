import { request } from "@/lib/Request";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

type UserProps = {
  username: string;
  email: string;
  userid: number;
  isSuperUser: boolean;
} | null;

type LoginProps = {
  username: string;
  password: string;
};

const User = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  setOrdersData: () => {},
  orders: [],
} as { user: UserProps; login: (user: LoginProps) => void; logout: () => void; orders: Array<object>; setOrdersData: (order: object) => void });

export { User };

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProps>(null);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  async function login(values: LoginProps) {
    await request({
      method: "POST",
      url: "token",
      data: values,
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.access}`;
      })
      .catch((error) => {
        console.log(error.message);
      });

    await request({
      method: "GET",
      url: "user",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        setUser(response.data);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  function logout() {
    setUser(null);
  }

  // const defaultCity = "Mumbai";
  function setOrdersData(order: any) {
    setOrders(order);
  }

  return (
    <User.Provider value={{ user, login, logout, orders, setOrdersData }}>
      {children}
    </User.Provider>
  );
}

export function useUserContext() {
  const { user, login, logout, orders, setOrdersData } = useContext(User);

  return { user, login, logout, orders, setOrdersData };
}
