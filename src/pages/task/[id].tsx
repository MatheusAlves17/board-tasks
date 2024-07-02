import Head from "next/head";
import styles from './styles.module.css';
import { GetServerSideProps } from "next";

import { db } from '../../services/firebaseConfiguration';
import {
    doc,
    collection,
    query,
    where,
    getDoc
} from 'firebase/firestore';
import { Textarea } from "@/components/Textarea";

interface ITaskProps {
    item: {
        task: string;
        public: boolean;
        user: string;
        created: string;
        taskId: string;

    }
}

export default function Task({ item }: ITaskProps) {
    return (
        <div className={styles.container}>
            <Head>
                <title>Board Tasks - Detalhes da tarefa</title>
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>Tarefa</h1>
                <article className={styles.task}>
                    <p>{item?.task}</p>
                </article>
            </main>
            <section className={styles.comments}>
                <h2 className={styles.commentsTitle}>Deixar comentário</h2>
                <form>
                    <Textarea
                        placeholder="Digite seu comentário...."
                    />
                    <button className={styles.commentsButton}>Enviar comentário</button>
                </form>
            </section>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const id = params?.id as string;

    const docRef = doc(db, 'tarefas', id);

    const snapshot = await getDoc(docRef)

    if (snapshot.data() === undefined || !snapshot.data()?.public) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }

        }
    }

    const miliseconds = snapshot.data()?.created?.seconds * 1000;

    const task = {
        task: snapshot.data()?.tarefa,
        public: snapshot.data()?.public,
        user: snapshot.data()?.user,
        created: new Date(miliseconds).toLocaleDateString(),
        taskId: id,
    }

    return {
        props: {
            item: task
        }
    }
}