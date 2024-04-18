import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { useUserContext } from "@/context/User";

const Navbar = () => {
  const { user } = useUserContext();
  console.log(user);
  return (
    <div>
      <nav className="bg-slate-100/40 z-50 dark:bg-slate-800/40 backdrop-blur shadow-sm	 dark:text-white p-4 flex justify-between fixed w-full">
        <div className="flex items-center">
          <Link to={user ? "/dashboard" : "/"}>
            <h1 className="text-2xl font-bold ml-2 -tracking-[2px]">
              Dine{" "}
              <span className="dark:text-slate-400 text-slate-600"> Smart</span>
            </h1>
          </Link>
        </div>
        <div className="md:flex hidden items-center ">
          <Link to="/" className="mr-4">
            <Button variant={"link"}>Home</Button>
          </Link>
          {user && (
            <Link to="/dashboard" className="mr-2">
              <Button variant={"link"}>Dashboard</Button>
            </Link>
          )}
          {!user ? (
            <Link to="/about" className="mr-4">
              <Button variant={"link"}>About</Button>
            </Link>
          ) : (
            <Link to={"/orders"} className="mr-2">
              <Button variant={"link"}>Orders</Button>
            </Link>
          )}

          <Link to="/contact" className="mr-2">
            <Button variant={"link"}>Contact</Button>
          </Link>
        </div>
        <div className="md:flex hidden space-x-3 items-center">
          {user && (
            <span className="mr-4">
              Welcome, <b>{user?.username}</b>
            </span>
          )}
          {user ? (
            <Link to="/logout">
              <Button
                variant={"destructive"}
                className="bg-rose-800 hover:bg-rose-900"
              >
                Logout
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button>Login</Button>
            </Link>
          )}
          {!user && (
            <Link to="/register">
              <Button className="dark:bg-slate-800 dark:text-white bg-slate-200 text-black hover:bg-slate-700 hover:text-gray-300">
                Register
              </Button>
            </Link>
          )}
          {user?.is_superuser && (
            <Link to={"/admin"}>
              <Button>Admin Panel</Button>
            </Link>
          )}
          <ModeToggle />
        </div>
        <div className="md:hidden flex space-x-2">
          <Sheet>
            <SheetTrigger>
              <MenuIcon />
            </SheetTrigger>
            <SheetContent className="flex flex-col flex-1 bg-white/50 dark:bg-slate-900/45 backdrop-blur shadow-sm">
              <div className="flex  flex-col flex-1 mt-16 space-y-11">
                <SheetClose asChild>
                  {user?.username === "guest" ? (
                    <Link to="/" className="mr-4">
                      <Button
                        variant={"link"}
                        className="text-xl font-semibold "
                      >
                        Home
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="mr-2">
                      <Button
                        variant={"link"}
                        className="text-xl font-semibold "
                      >
                        Dashboard
                      </Button>
                    </Link>
                  )}
                </SheetClose>
                <SheetClose asChild>
                  {!user ? (
                    <Link to="/" className="mr-4">
                      <Button
                        variant={"link"}
                        className="text-xl font-semibold"
                      >
                        About
                      </Button>
                    </Link>
                  ) : (
                    <Link to={"/orders"} className="mr-2">
                      <Button
                        variant={"link"}
                        className="text-xl font-semibold"
                      >
                        Orders
                      </Button>
                    </Link>
                  )}
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/contact" className="mr-4 text-xl font-semibold ">
                    <Button variant={"link"} className="text-xl font-semibold ">
                      Contact
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  {!user ? (
                    <Link to="/login" className="w-full">
                      <Button className="w-full">Login</Button>
                    </Link>
                  ) : (
                    <Link to="/logout" className="w-full">
                      <Button className="w-full">Logout</Button>
                    </Link>
                  )}
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/register" className="">
                    <Button className=" hover:bg-slate-700 hover:text-gray-300 dark:bg-slate-800 dark:text-white bg-slate-200 text-black w-full">
                      Register
                    </Button>
                  </Link>
                </SheetClose>
              </div>
              <SheetFooter className="p-4 ml-auto">
                <ModeToggle />
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
