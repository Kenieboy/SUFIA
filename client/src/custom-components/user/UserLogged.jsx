import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { logout } from "@/redux/authSlice";

function UserLogged() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3001/api/auth/logout",
        {},
        { withCredentials: true }
      );

      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-[10px]">
          Hi <span className="font-bold">{currentUser?.NAME},</span> Good
          morning!
        </p>
        <p className="text-[10px] cursor-pointer" onClick={handleLogout}>
          Logout
        </p>
      </div>
    </div>
  );
}

export default UserLogged;
