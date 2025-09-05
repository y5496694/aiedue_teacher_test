import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Aiedu Teacher</title>
      </Head>
      <main>
        <h1>Welcome to the Next.js version of Aiedu Teacher</h1>
        <p>The site has been migrated to use React and Next.js. Add your components here.</p>
        <p>
          <Link href="/sketchbook">Go to 에이두 스케치북</Link>
        </p>
      </main>
    </>
  );
}

