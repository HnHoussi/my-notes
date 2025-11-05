import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {FaReact, FaServer, FaProjectDiagram, FaCheck} from 'react-icons/fa';
import styles from './index.module.css';

export default function Home() {
    return (
        <Layout title="Home" description="Programming Cheatsheets and Project Guides">
            <main className={styles.main}>
                {/* Hero Section */}
                <section className={styles.hero}>
                    <h1 className={styles.title}>Web Dev Cheatsheets</h1>
                    <p className={styles.subtitle}>
                        Frontend, Backend, and Project Guides for web development
                    </p>
                    <Link className={styles.cta} to="/docs/frontend/react">
                        Start Learning
                    </Link>
                </section>

                {/* Main Categories */}
                <section className={styles.cards}>
                    <Link className={`${styles.card} ${styles.frontend}`} to="/docs/frontend/react">
                        <FaReact size={40} />
                        <h2>Frontend</h2>
                        <p>React, Next.js, TypeScript and many more ...</p>
                    </Link>

                    <Link className={`${styles.card} ${styles.backend}`} to="/docs/backend/nodejs">
                        <FaServer size={40} />
                        <h2>Backend</h2>
                        <p>Node.js, ExpressJS, PostgreSQL, Symfony, API Platform ...</p>
                    </Link>

                    <Link className={`${styles.card} ${styles.tests}`} to="/docs/test/test-types">
                        <FaCheck size={40} />
                        <h2>Testing</h2>
                        <p>A comprehensive testing cheat sheet</p>
                    </Link>

                    <Link className={`${styles.card} ${styles.projects}`} to="/docs/projects/cv-ai-assistant">
                        <FaProjectDiagram size={40} />
                        <h2>Projects</h2>
                        <p>Step-by-step project guides</p>
                    </Link>

                </section>
            </main>
        </Layout>
    );
}
