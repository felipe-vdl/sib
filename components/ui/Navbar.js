import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { status } = useSession();

  const handleLogout = async evt => {
    await signOut({
      redirect: false,
    });

    Router.push('/login');
  }

  return (
    <nav>
      <ul className='flex items-center justify-between text-white'>
        <li className="brand text-white text-2xl hover:text-slate-400"><Link href="/">SIB</Link></li>
        {status === "authenticated" &&
          <>
            <ul>
              <li className="hover:text-slate-400"><Link href="/registros">Registros</Link></li>
            </ul>
            <ul className='flex gap-5 items-center'>
              <li className="hover:text-slate-400">
                <Link href="/changepassword" title='Mudar Senha'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-key-fill" viewBox="0 0 16 16">
                    <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                  </svg>
                </Link>
              </li>
              <li className="hover:text-slate-400">
                <Link href="/register" title='Novo Usuário'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-plus-fill" viewBox="0 0 16 16">
                    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                    <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
                  </svg>
                </Link>
              </li>
              <li className="hover:text-slate-400">
                <a href='#' onClick={handleLogout} title="Logout">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-door-open-fill" viewBox="0 0 16 16">
                    <path d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15H1.5zM11 2h.5a.5.5 0 0 1 .5.5V15h-1V2zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z" />
                  </svg>
                </a>
              </li>
            </ul>
          </>
        }
        {status === "unauthenticated" &&
          <>
            <li className="hover:text-slate-400">
              <Link href="/login" title="Login">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-door-open" viewBox="0 0 16 16">
                  <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z" />
                  <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117zM11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5zM4 1.934V15h6V1.077l-6 .857z" />
                </svg>
              </Link>
            </li>
          </>
        }
      </ul>
    </nav>
  )
}
