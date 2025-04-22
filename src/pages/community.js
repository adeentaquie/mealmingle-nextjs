import Image from "next/image";
import styles from "@/styles/Community.module.css";
import meal from "../../public/images/icons/meal.png"
import community from "../../public/images/icons/community.png"
import events from "../../public/images/icons/events.png"


export default function CommunityPage() {
  return (
    <>
      <header className={styles.header}>
        <h1>
          One shared passion: <span className={styles.highlight}>Food</span>
        </h1>
        <p>Join our community and share your favorite recipes!</p>
      </header>

      <main className={styles.main}>
        <h2>Community Perks</h2>
        <ul className={styles.perks}>
          <li>
            <Image
              src={meal}
              alt="A delicious meal"
              width={64}
              height={64}
            />
            <p>Share & discover recipes</p>
          </li>
          <li>
            <Image
              src={community}
              alt="A crowd of people, cooking"
              width={64}
              height={64}
            />
            <p>Find new friends & like-minded people</p>
          </li>
          <li>
            <Image
              src={events}
              alt="A crowd of people at a cooking event"
              width={64}
              height={64}
            />
            <p>Participate in exclusive events</p>
          </li>
        </ul>
      </main>
    </>
  );
}
