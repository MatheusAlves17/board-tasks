import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState
} from "react";

import Head from "next/head";
import { GetServerSideProps } from "next";
import { getSession } from 'next-auth/react';

import styles from './styles.module.css';
import { PiShareDuotone, PiTrash } from "react-icons/pi";

import { Textarea } from "@/components/Textarea";

import { db } from "@/services/firebaseConfiguration";
import {
    addDoc,
    collection,
    query,
    where,
    orderBy,
    onSnapshot
} from "firebase/firestore";

interface DashboardProps {
    user: {
        email: string
    }
}

interface TasksProps {
    id: string;
    created: string;
    public: string;
    tarefa: string;
    user: string;
}

export default function Dashboard({ user }: DashboardProps) {

    const [input, setInput] = useState('');
    const [publicTask, setPublicTask] = useState(false);
    const [tasks, setTasks] = useState<TasksProps[]>([]);

    const handlePublicTask = (event: ChangeEvent<HTMLInputElement>) => {
        setPublicTask(event.target.checked);
    }

    const handleRegisterTask = async (event: FormEvent) => {
        event.preventDefault();

        if (input === "") return;

        try {
            await addDoc(collection(db, 'tarefas'), {
                tarefa: input,
                created: new Date(),
                user: user.email,
                public: publicTask
            });

            setInput('');
            setPublicTask(false);

        } catch (error) {
            console.log(error);
        };
    };

    useEffect(() => {
        const loadTasks = async () => {
            const tasksRef = collection(db, 'tarefas');
            const q = query(
                tasksRef,
                orderBy('created', 'desc'),
                where("user", "==", user?.email)
            )

            onSnapshot(q, (snapshot) => {
                let taskList = [] as TasksProps[];

                snapshot.forEach((doc) => {
                    taskList.push({
                        id: doc.id,
                        tarefa: doc.data().tarefa,
                        created: doc.data().created,
                        public: doc.data().public,
                        user: doc.data().user,
                    });
                });

                console.log(taskList);
                setTasks(taskList);
            });
        };
        loadTasks();
    }, [user.email]);

    return (
        <>
            <Head>
                <title>Meu painel de tarefas</title>
            </Head>
            <main className={styles.main}>
                <section className={styles.content}>
                    <div className={styles.contentForm}>
                        <h1 className={styles.title}>Qual a tarefa?</h1>
                        <form onSubmit={handleRegisterTask} >
                            <Textarea
                                placeholder="Digite sua tarefa"
                                value={input}
                                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
                            />
                            <div className={styles.checkboxArea}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={publicTask}
                                    onChange={handlePublicTask}
                                />
                                <label className={styles.label}>Deixar tarefa pública?</label>
                            </div>
                            <button type="submit" className={styles.button}>Registrar</button>
                        </form>
                    </div>
                </section>
                <section className={styles.taskContainer}>
                    <h1 className={styles.titleTask}>Minhas tarefas</h1>
                    {
                        tasks.map((item) => (
                            <article key={item.id} className={styles.task}>
                                {item.public &&
                                    <div className={styles.tagContainer}>
                                        <label className={styles.tag}>PÚBLICA</label>
                                        <button className={styles.tagButton}>
                                            <PiShareDuotone
                                                size={22}
                                                color="#3183ff"
                                            />
                                        </button>
                                    </div>
                                }
                                <div className={styles.taskContent}>
                                    <p>{item.tarefa}</p>
                                    <button className={styles.buttonTrash}>
                                        <PiTrash
                                            size={24}
                                            color="#ea3140"
                                        />
                                    </button>
                                </div>
                            </article>
                        ))
                    }
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
        props: {
            user: {
                email: session?.user?.email
            }
        }
    };
}