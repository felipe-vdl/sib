import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

import prisma from "../db";
import { v4 as uuid } from 'uuid';
import Image from "next/image";

export default function Registros(props) {
  return (
    <div className="mx-auto w-10/12">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-700 text-sky-100">
            <th className="border border-slate-100">Foto</th>
            <th className="border border-slate-100">Nome</th>
            <th className="border border-slate-100">CPF</th>
            <th className="border border-slate-100">Protocolo</th>
            <th className="border border-slate-100">Setor</th>
            <th className="border border-slate-100">Cargo</th>
            <th className="border border-slate-100">Ações</th>
          </tr>
        </thead>
        <tbody>
          {props.registros.map(registro => {
            return (
              <tr key={uuid()} className="hover:bg-slate-400 font-medium text-slate-900 bg-slate-300">
                <td className="border border-slate-100 text-center"><div className="flex justify-center"><img src={`http://localhost:3000/api/foto/${registro.id}`} width="100" height="133" /></div></td>
                <td className="border border-slate-100 text-center">{registro.nome}</td>
                <td className="border border-slate-100 text-center">{registro.cpf}</td>
                <td className="border border-slate-100 text-center">{registro.protocolo}</td>
                <td className="border border-slate-100 text-center">{registro.setor}</td>
                <td className="border border-slate-100 text-center">{registro.cargo}</td>
                <td className="border border-slate-100 text-center">
                  <div className="flex gap-2 justify-center">
                    <a title="Frente" className="hover:text-green-700" target="_blank" href={`api/frente/${registro.id}.jpg`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm4.5 0a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm5 2.755C12.146 12.825 10.623 12 8 12s-4.146.826-5 1.755V14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-.245z" />
                      </svg>
                    </a>
                    <a title="Verso" className="hover:text-green-700" target="_blank" href={`api/verso/${registro.id}.jpg`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-2zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
                      </svg>
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-slate-700 text-sky-100">
            <th className="border border-slate-100">Foto</th>
            <th className="border border-slate-100">Nome</th>
            <th className="border border-slate-100">CPF</th>
            <th className="border border-slate-100">Protocolo</th>
            <th className="border border-slate-100">Setor</th>
            <th className="border border-slate-100">Cargo</th>
            <th className="border border-slate-100">Ações</th>
          </tr>
        </tfoot>
      </table>
    </div>
  )
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
      registros: registros.map(registro => {
        return {
          ...registro,
          createdAt: registro.createdAt.toDateString(),
          updatedAt: registro.updatedAt ? registro.updatedAt.toDateString() : null,
        }
      }),
    }
  }
}