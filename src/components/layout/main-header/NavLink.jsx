import Link from 'next/link';
import { useRouter } from 'next/router';
import classes from './nav-link.module.css';

export default function NavLink({ href, children, ...props }) {
  const router = useRouter();
  const isActive = router.pathname === href || router.asPath === href;

  return (
    <Link href={href} {...props} className={`${classes.link} ${isActive ? classes.active : ""}`}>
      {children}
    </Link>
  );
}
