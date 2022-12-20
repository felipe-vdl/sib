import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

import { useEffect, useState } from 'react';

const registerPage = props => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "" });
  const [confirmPassword, setConfirmPassword] = useState(null);

  const notificationInitialState = {
    status: '',
    message: ''
  }
  const [notification, setNotification] = useState(notificationInitialState);

  const handleChange = evt => {
    setForm(st => (
      { ...st, [evt.target.name]: evt.target.value }
    ));
  }

  useEffect(() => {
    if (form.password === form.confirmPassword) {
      setConfirmPassword(true);
    } else {
      setConfirmPassword(false);
    }
  }, [form.password, form.confirmPassword]);

  const handleSubmit = async evt => {
    evt.preventDefault();
    if (form.email.trim().length && form.password.trim().length && form.role.trim().length && confirmPassword) {
      setNotification(notificationInitialState);
      const res = await fetch('/api/user/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role
        })
      });

      if (!res.ok) {
        const data = await res.json();
        setNotification({ message: data, status: "error" });
        return;
      }

      const data = await res.json();
      setForm({ name: "", email: "", password: "", confirmPassword: "", role: "" });
      setNotification({ message: "Usuário criado com sucesso.", status: "success" });
    }
  }

  return (
    <form
      action="/api/auth/signIn"
      method="POST"
      onSubmit={handleSubmit}
      className="drop-shadow-md bg-slate-300 m-auto rounded flex flex-col w-11/12 md:w-8/12 lg:w-6/12">
      <div className='text-center border-b border-slate-100 py-4'>
        <h1 className='font-bold text-2xl text-slate-600'>Registrar</h1>
      </div>
      <div className='px-8 flex flex-col gap-4 py-4'>
        {notification.message &&
          <div
            className={`
              ${notification.status === 'error' ? 'bg-red-300 text-red-900' : ''}
              ${notification.status === 'success' ? 'bg-green-300 text-green-900' : ''}
              font-medium m-auto rounded flex flex-col w-full text-center px-2 py-1`
            }
          >
            {notification.message}
          </div>
        }
        <div className="flex">
          <label title='Nome do usuário' htmlFor="name" className='cursor-help flex justify-center items-center p-2 text-white bg-slate-800 rounded-l'>
            <svg xmlns="http://www.w3.org/2000/svg" className='w-[2rem]' fill="currentColor" viewBox="0 0 16 16">
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            </svg>
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="Nome"
            className="w-full rounded-r p-2 focus:outline-0 bg-slate-100"
            required
          />
        </div>
        <div className="flex">
          <label title='E-mail' htmlFor="email" className='cursor-help flex justify-center items-center p-2 text-white bg-slate-800 rounded-l'>
            <svg xmlns="http://www.w3.org/2000/svg" className='w-[2rem]' fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z" />
              <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z" />
            </svg>
          </label>
          <input
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="E-mail"
            className="w-full rounded-r p-2 focus:outline-0 bg-slate-100"
            required
          />
        </div>
        <div className="flex">
          <label title='Senha' htmlFor="password" className='cursor-help flex justify-center items-center p-2 text-white bg-slate-800 rounded-l'>
            <svg xmlns="http://www.w3.org/2000/svg" className='w-[2rem]' fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            </svg>
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Senha"
            className={`w-full rounded-r p-2 focus:outline-0 bg-slate-100`}
            required
          />
        </div>
        <div className="flex">
          <label title='Confirme a senha' htmlFor="confirmPassword" className='cursor-help flex justify-center items-center p-2 text-white bg-slate-800 rounded-l'>
            <svg xmlns="http://www.w3.org/2000/svg" className='w-[2rem]' fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            </svg>
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirme a Senha"
            className={`w-full rounded-r p-2 focus:outline-0 bg-slate-100 ${confirmPassword === false ? 'text-red-500' : ''}`}
            required
          />
        </div>
        <div className="flex">
          <label title="Nível do usuário" htmlFor="role" className='cursor-help flex justify-center items-center p-2 text-white bg-slate-800 rounded-l'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-[2rem]" viewBox="0 0 16 16">
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm9 1.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0-.5.5ZM9 8a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4A.5.5 0 0 0 9 8Zm1 2.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.5.5Zm-1 2C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 0 2 13h6.96c.026-.163.04-.33.04-.5ZM7 6a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />
            </svg>
          </label>
          <select
            id="role"
            name="role"
            defaultValue={form.role}
            onChange={handleChange}
            className={`w-full rounded-r p-2 focus:outline-0 bg-slate-100 ${!form.role ? 'text-slate-400' : ''}`}
            required
          >
            <option value="" disabled>Nível</option>
            <option value="USER" >Usuário</option>
            <option value="ADMIN" >Administrador</option>
            <option value="SUPERADMIN" >Super Administrador</option>
          </select>
        </div>
        <div className="flex justify-center mt-4">
          <input
            type="submit"
            value="Registrar"
            className="bg-slate-600 shadow-inner drop-shadow rounded-full w-full p-2 hover:bg-slate-700 cursor-pointer text-white"
          />
        </div>
      </div>
    </form>
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

  return {
    props: {}
  }
}

export default registerPage;