import React from 'react';
import LoadingSpinner from "./LoadingSpinner";
import { useSession } from 'next-auth/react';

export default function LoadingProvider({ children }) {
  const { status } = useSession();

  return (
    <>
      {status === "loading" ? (
        <div className="m-auto">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {children}
        </>
      )}
    </>
  )
}
