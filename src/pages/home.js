// pages/index.js
import Link from "next/link";
import { useSelector } from "react-redux";
import ImageSlideshow from "@/components/images/ImageSlideshow";
import classes from "@/styles/Home.module.css"; // adjust if located elsewhere

export default function HomePage() {
  const { name, userId } = useSelector((state) => state.auth);

  return (
    <div className={classes.wrapper}>
      <header className={classes.header}>
        <div className={classes.slideshow}>
          <ImageSlideshow />
        </div>
        <div>
          <div className={classes.hero}>
            <h1>Great Food for Foodies</h1>
            <p>Taste & share food from all over the world.</p>
          </div>
          <div className={classes.cta}>
            <Link href="/community" className="primary">
              Join the Community
            </Link>
            <Link href={`/meals/${userId}`} className="secondary">
              Explore Meals
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className={classes.section}>
          <h2>How it works</h2>
          <p>
            Meal Mingle is a platform for foodies to share their favorite
            recipes with the world. It's a place to discover new dishes, and to
            connect with other food lovers.
          </p>
          <p>
            Meal Mingle is a place to discover new dishes, and to connect with
            other food lovers.
          </p>
        </section>

        <section className={classes.section}>
          <h2>Why Meal Mingle?</h2>
          <p>
            Meal Mingle is a platform for foodies to share their favorite
            recipes with the world. It's a place to discover new dishes, and to
            connect with other food lovers.
          </p>
          <p>
            Meal Mingle is a place to discover new dishes, and to connect with
            other food lovers.
          </p>
        </section>
      </main>
    </div>
  );
}
