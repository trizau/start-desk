import '/styles/globals.scss'
import type {AppProps} from 'next/app'
import Head from "next/head";
import dynamic from "next/dynamic";

function MyApp({Component, pageProps}: AppProps) {
    return <>
        <Head>
            <title>Hello world</title>
            <meta name="viewport"
                  content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"/>
        </Head>
        <Component {...pageProps} />
    </>
}

export default dynamic(() => Promise.resolve(MyApp), {ssr: false});
