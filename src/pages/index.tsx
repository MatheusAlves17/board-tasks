import Head from "next/head";
import styles from "../home.module.css";
import Image from "next/image";

import HeroImg from '../../public/assets/hero.png';
import { GetStaticProps } from "next";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/services/firebaseConfiguration";

interface IHomeProps {
  posts: number;
  comments: number;
}

export default function Home({comments, posts}:IHomeProps) {
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
            <span>+{posts} posts</span>
          </section>
          <section className={styles.box}>
            <span>+{comments} comentários</span>
          </section>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {

  const commentsRef = collection(db, 'comments');
  const postsRef = collection(db, 'tarefas')

  const commentSnapshot = await getDocs(commentsRef);
  const postSnapshot = await getDocs(postsRef);

  return {
    props: {
      comments: commentSnapshot.size || 0,
      posts: postSnapshot.size || 0
    },
    revalidate: 60
  }
}
