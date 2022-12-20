import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

import { useState } from 'react';

const registerPage = props => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });

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

  const handleSubmit = async evt => {
    evt.preventDefault();
    if (form.currentPassword.trim().length && form.newPassword.trim()) {
      setNotification(notificationInitialState);
      const res = await fetch('/api/user/change-password', {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword
        })
      });

      if (!res.ok) {
        const data = await res.json();
        setNotification({ message: data, status: "error" });
        return;
      }

      const data = await res.json();
      setForm({ currentPassword: "", newPassword: "" });
      setNotification({ message: "Senha alterada com sucesso.", status: "success" });
    }
  }

  return (
    <form
      action="/api/auth/signIn"
      method="POST"
      onSubmit={handleSubmit}
      className="drop-shadow-md bg-slate-300 m-auto rounded flex flex-col w-11/12 md:w-8/12 lg:w-6/12">
      <div className='text-center border-b border-slate-100 py-4'>
        <h1 className='font-bold text-2xl text-slate-600'>Alterar Senha</h1>
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
          <label title='Senha Atual' htmlFor="currentPassword" className='cursor-help flex justify-center items-center p-2 text-white bg-slate-800 rounded-l'>
            <svg xmlns="http://www.w3.org/2000/svg" className='w-[2rem]' fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            </svg>
          </label>
          <input
            id="currentPassword"
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Senha Atual"
            className={`w-full rounded-r p-2 focus:outline-0 bg-slate-100`}
            required
          />
        </div>
        <div className="flex">
          <label title='Senha Nova' htmlFor="newPassword" className='cursor-help flex justify-center items-center p-2 text-white bg-slate-800 rounded-l'>
            <svg xmlns="http://www.w3.org/2000/svg" className='w-[2rem]' fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            </svg>
          </label>
          <input
            id="newPassword"
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Senha Nova"
            className="w-full rounded-r p-2 focus:outline-0 bg-slate-100"
            required
          />
        </div>
        <div className="flex justify-center mt-4">
          <input
            type="submit"
            value="Enviar"
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