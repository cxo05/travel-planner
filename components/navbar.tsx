import styles from '../styles/Home.module.css'

import { useSession, signIn, signOut } from "next-auth/react"

export default function Navbar() {
  const { data: session, status } = useSession()
  const userEmail = session?.user?.email

  return (
    <nav className="flex gap-4">
      {status === "authenticated" ? (
        <p>Signed in as {userEmail}</p>
      ) : (<></>)
      }
      <div className={styles.signup}>
        {status === "authenticated" ? (
          <button onClick={() => signOut()}>Sign out</button>
        ) : (
          <button onClick={() => signIn()}>Sign in</button>
        )}
      </div>
    </nav>
  );
};