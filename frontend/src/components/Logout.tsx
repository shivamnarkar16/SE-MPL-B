import { useEffect } from "react";
import axios from "axios";
import { useUserContext } from "@/context/User";
import { useNavigate } from "react-router-dom";
import { request } from "@/lib/Request";
import Loading from "./Loading";

export const Logout = () => {
  const { logout } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await request({
          method: "POST",
          url: "logout",
          data: {
            refresh_token: localStorage.getItem("refresh_token"),
          },

          headers: { "Content-Type": "application/json" },
        });
        localStorage.removeItem("access_token");
        // localStorage.removeItem("refresh_token");
        axios.defaults.headers.common["Authorization"] = null;
        logout();
        // window.location.href = "/login";
        
        navigate("/login");
      } catch (e) {
        console.log("logout not working", e);
      }
    })();
  }, []);
  return <div>
        <Loading text="Logging Out "/>

  </div>;
};

export default Logout;
