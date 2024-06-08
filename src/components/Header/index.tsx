import Link from 'next/link';
import styles from './styles.module.css';
import { useSession, signIn, signOut } from 'next-auth/react';

export function Header() {

    const { data: session, status } = useSession();

    return (
        <header className={styles.header}>
            <section className={styles.content}>
                <nav className={styles.nav}>
                    <Link href='/'>
                        <h1 className={styles.logo}>Board Taks</h1>
                    </Link>
                    <Link href='/dashboard' className={styles.link}>
                        <span>Meu painel</span>
                    </Link>
                </nav>
                {
                    status === 'loading' ? (
                        <></>
                    ) : session ? (
                        <button className={styles.button} onClick={() => signOut()}>Olá, {session?.user?.name}</button>
                    ) : (
                        <button className={styles.button} onClick={() => signIn('google')}>Acessar</button>
                    )
                }
            </section>
        </header>
    )
}