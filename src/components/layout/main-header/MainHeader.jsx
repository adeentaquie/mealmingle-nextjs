import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import Image from "next/image";
import classes from "./main-header.module.css";
import NavLink from "./NavLink";
import MainHeaderBackground from "./MainHeaderBackground";

export default function MainHeader() {
  const { userId } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const mealsLink = userId ? `/meals/${userId}` : "/meals";
  const dashboardLink = userId ? `/dashboard/${userId}` : "/";

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
  };

  return (
    <>
      <MainHeaderBackground />
      <header className={classes.header}>
        <Link className={classes.logo} href="/home">
          <Image src="/logo.png" alt="logo image" width={80} height={80} />
          MEAL MINGLE
        </Link>

        <nav className={classes.nav}>
          <ul>
            <li><NavLink href={mealsLink}>Browse Meals</NavLink></li>
            <li><NavLink href={dashboardLink}>User Dashboard</NavLink></li>
            <li><NavLink href="/community">Community</NavLink></li>
            <li>
              {userId && (
                <NavLink href="/" className={classes.logoutLink} onClick={handleLogout}>
                  Logout
                </NavLink>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
