import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../../components/video"),
  {
    ssr: false,
  }
);

const Room = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return null;
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Room {id}</h1>
      <DynamicComponentWithNoSSR roomId={String(id)} />
    </div>
  );
};

export default Room;
