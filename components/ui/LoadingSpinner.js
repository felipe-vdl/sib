import React from 'react'
import styles from './LoadingSpinner.module.css'

export default function LoadingSpinner({className}) {
  return (
    <div className={`${styles['lds-ring']} ${className}`}><div></div><div></div><div></div><div></div></div>
  )
}