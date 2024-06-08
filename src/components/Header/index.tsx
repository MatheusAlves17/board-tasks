import Link from 'next/link';
import styles from './styles.module.css';

export function Header() {
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
                <button className={styles.button}>Minha conta</button>
            </section>
        </header>
    )
}