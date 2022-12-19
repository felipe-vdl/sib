import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Home(props) {
  return <p>Home</p>
}

export const getServerSideProps = async context => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      },
      props: {}
    }
  }

  return {
    redirect: {
      destination: '/registros',
      permanent: false
    },
    props: {}
  }
}