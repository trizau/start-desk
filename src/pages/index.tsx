import type {NextPage} from 'next';

const Home: NextPage = () => {

    return <>
        <div onClick={async () => {
            alert(await window.api.ipcRenderer.invoke('message', 'Hello'))
        }}>Hello NextJS
        </div>
    </>
}

export default Home
