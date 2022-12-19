import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Router from 'next/router';

export default function Login(props) {
  const notificationInitialState = {
    status: '',
    message: ''
  }
  const [notification, setNotification] = useState(notificationInitialState);

  const [form, setForm] = useState({ email: "", password: "" });
  const handleChange = evt => {
    setForm(st => (
      { ...st, [evt.target.name]: evt.target.value }
    ));
  }

  const handleSubmit = async evt => {
    evt.preventDefault();
    if (form.email.trim().length && form.password.trim().length) {
      setNotification(notificationInitialState);
      const res = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false
      });

      if (!res.error) {
        Router.push('/registros');
      } else {
        setNotification({ message: res.error, status: 'error' });
      }
    }
  }

  return (
    <form
      action="/api/auth/signIn"
      method="POST"
      onSubmit={handleSubmit}
      className="drop-shadow-md bg-slate-300 m-auto rounded flex flex-col w-11/12 md:w-8/12 lg:w-6/12">
      <div className='text-center border-b border-slate-100 py-4'>
        <h1 className='font-bold text-2xl text-slate-600'>Login</h1>
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
          <label title="E-mail" htmlFor="email" className='cursor-help flex justify-center items-center p-2 text-white bg-slate-800 rounded-l'>
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
            className="w-full rounded p-2 focus:outline-0 bg-slate-100"
            required
          />
        </div>
        <div className="flex">
          <label title="Senha" htmlFor="password" className='cursor-help flex justify-center items-center p-2 text-white bg-slate-800 rounded-l'>
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
            className="w-full rounded p-2 focus:outline-0 bg-slate-100"
            required
          />
        </div>
        <div className="flex justify-center mt-4">
          <input
            type="submit"
            onChange={handleChange}
            value="Login"
            className="bg-slate-600 shadow-inner drop-shadow rounded-full w-full p-2 hover:bg-slate-700 cursor-pointer text-white"
          />
        </div>
      </div>
    </form>
  );
}

export const getServerSideProps = async context => {
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: '/registros',
        permanent: false
      },
      props: {}
    }
  }

  return {
    props: {}
  }
}