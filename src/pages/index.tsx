import Head from "next/head";
import styles from "@/styles/home.module.css";
import Image from "next/image";

import HeroImg from '../../public/assets/hero.png';

export default function Home() {
  return (
    <>
      <Head>
        <title>Board Tasks</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            src={HeroImg}
            alt="Logo Board Tasks"
            priority
          />
        </div>
        <h1 className={styles.title}>
          Organize seus estudos<br />com o Board Taks
        </h1>
        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+12 posts</span>
          </section>
          <section className={styles.box}>
            <span>+90 comentários</span>
          </section>
        </div>
      </main>
    </>
  );
}
