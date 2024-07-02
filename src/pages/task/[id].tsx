import Head from "next/head";
import styles from './styles.module.css';
import { GetServerSideProps } from "next";

import { db } from '../../services/firebaseConfiguration';
import {
    doc,
    collection,
    query,
    where,
    getDoc,
    addDoc,
    getDocs,
    deleteDoc,
} from 'firebase/firestore';
import { Textarea } from "@/components/Textarea";
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { PiTrash } from "react-icons/pi";

interface ITaskProps {
    item: {
        task: string;
        public: boolean;
        user: string;
        created: string;
        taskId: string;

    };
    allComments: ICommentsProps[];
}

interface ICommentsProps {
    id: string;
    comments: string;
    taskId: string;
    user: string;
    name: string;
}

export default function Task({ item, allComments }: ITaskProps) {
    const { data: session } = useSession();

    const [input, setInput] = useState('');
    const [comments, setComments] = useState<ICommentsProps[]>(allComments || []);


    const handleComment = async (e: FormEvent) => {
        e.preventDefault();

        if (input === '') return;
        if (!session?.user?.email || !session?.user?.name) return;

        try {
            const docRef = await addDoc(collection(db, 'comments'), {
                comment: input,
                created: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item.taskId
            });

            const data: ICommentsProps = {
                id: docRef.id,
                comments: input,
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item.taskId
            }

            setComments((oldItems) => [...oldItems, data]);
            setInput('');
        } catch (error) {
            console.log(error);


        }

    }

    const handleDelete = async (id: string) => {

        try {
            const docRef = doc(db, 'comments', id);
            await deleteDoc(docRef);

            const deleteComment = comments.filter((item) => item.id != id);

            setComments(deleteComment);


        } catch (error) {
            console.log(error)
        }


    }

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
            <section className={styles.commentsContainer}>
                <h2 className={styles.commentsTitle}>Deixar comentário</h2>
                <form onSubmit={handleComment}>
                    <Textarea
                        placeholder="Digite seu comentário...."
                        value={input}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                    />
                    <button
                        disabled={!session?.user}
                        className={styles.commentsButton}
                    >Enviar comentário</button>
                </form>
            </section>
            <section className={styles.commentsContainer}>
                <h2 className={styles.commentsTitle}>Todos comentários</h2>

                {
                    comments.length === 0 && <span>Nenhum comentário foi encontrado...</span>
                }
                {
                    comments.map((comment) => (
                        <article key={comment.id} className={styles.comment}>
                            <div className={styles.headComment}>
                                <label className={styles.commentsLabel}>{comment.name}</label>
                                <button className={styles.buttonTrash} onClick={() => handleDelete(comment.id)}>
                                    {
                                        session?.user?.email === comment.user &&
                                        <PiTrash
                                            size={24}
                                            color="#ea3140"
                                        />
                                    }
                                </button>
                            </div>
                            <p>{comment.comments}</p>
                        </article>
                    ))
                }
            </section>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const id = params?.id as string;

    const docRef = doc(db, 'tarefas', id);

    const q = query(collection(db, 'comments'), where('taskId', '==', id))
    const snapshotComments = await getDocs(q);

    let allComments: ICommentsProps[] = [];

    snapshotComments.forEach((comment) => {
        allComments.push({
            id: comment.id,
            comments: comment.data().comment,
            user: comment.data().user,
            name: comment.data().name,
            taskId: comment.data().taskId
        })
    })
    const snapshot = await getDoc(docRef);

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
            item: task,
            allComments: allComments
        }
    }
}