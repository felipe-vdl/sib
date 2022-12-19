import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Registros(props) {
  <div>
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>Protocolo</th>
          <th>Setor</th>
          <th>Cargo</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {props.registros.map(registro => {
          return (
            <tr>
              <td>{registro.nome}</td>
              <td>{registro.cpf}</td>
              <td>{registro.protocolo}</td>
              <td>{registro.setor}</td>
              <td>{registro.cargo}</td>
              <td>
                <a title="Frente" href={`api/frente/${registro.id}.jpg`}></a>
                <a title="Verso" href={`api/verso/${registro.id}.jpg`}></a>
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>Protocolo</th>
          <th>Setor</th>
          <th>Cargo</th>
          <th>Ações</th>
        </tr>
      </tfoot>
    </table>
  </div>
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

  const registros = await prisma.registro.findMany();
  return {
    props: {
      registros,
    }
  }
}