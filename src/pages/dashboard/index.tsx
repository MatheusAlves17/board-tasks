import { GetServerSideProps } from "next";
import Head from "next/head";

import { getSession } from 'next-auth/react';

export default function Dashboard() {
    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <h1>Dashboard</h1>
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