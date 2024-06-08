import Head from "next/head";
import { GetServerSideProps } from "next";
import { PiShareDuotone, PiTrash } from "react-icons/pi";

import { getSession } from 'next-auth/react';

import styles from './styles.module.css';
import { Textarea } from "@/components/Textarea";

export default function Dashboard() {
    return (
        <>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>
            <main className={styles.main}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Qual a tarefa?</h1>
                        <form>
                            <Textarea
                                placeholder="Digite sua tarefa"
                            />
                            <div className={styles.checkboxArea}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                />
                                <label className={styles.label}>Deixar tarefa pública?</label>
                            </div>
                            <button type="submit" className={styles.button}>Registrar</button>
                        </form>
                    </div>
                </section>
                <section className={styles.taskContainer}>
                    <h1 className={styles.titleTask}>Minhas tarefas</h1>
                    <article className={styles.task}>
                        <div className={styles.tagContainer}>
                            <label className={styles.tag}>PÚBLICO</label>
                            <button className={styles.tagButton}>
                                <PiShareDuotone
                                    size={22}
                                    color="#3183ff"
                                />
                            </button>
                        </div>
                        <div className={styles.taskContent}>
                            <p>Tarefa 1</p>
                            <button className={styles.buttonTrash}>
                                <PiTrash
                                    size={24}
                                    color="#ea3140"
                                />
                            </button>
                        </div>
                    </article>
                </section>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    const session = await getSession({ req });

    if (!session?.user) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
        };
    };

    return {
        props: {}
    };
}