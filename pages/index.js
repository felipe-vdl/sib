import React, { useState } from "react";
import path from 'path';
import fs from 'fs/promises';

import Link from 'next/link';
import InputMask from 'react-input-mask';

export default function Home({ dirs }) {
  const [uploading, setUploading] = useState(false);
  const [src, setSrc] = useState(null);

  const formInit = {
    nome: '',
    cpf: '',
    cargo: '',
    setor: ''
  }
  const [form, setForm] = useState(formInit);

  const handleUpload = async evt => {
    evt.preventDefault();
    try {
      if (!src) return;

      setUploading(true);
      const formData = new FormData();
      formData.append("image", croppedImage);
      formData.append("nome", form.nome);
      formData.append("cpf", form.cpf);
      formData.append("setor", form.setor);
      formData.append("cargo", form.cargo);

      const res = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      setForm(formInit);
      setSrc(null);
      setFile(null);
      setUploading(false);

    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = evt => {
    setForm(st => ({ ...st, [evt.target.name]: evt.target.value }));
  }

  const handleFileChange = evt => {
    if (evt.target.files && evt.target.files.length > 0) {
      const file = evt.target.files[0];
      setSrc(URL.createObjectURL(file));
    }
  }

  return (
    <div className="flex flex-col m-auto mt-4 w-full bg-slate-400">
      <form onSubmit={handleUpload} className="mx-auto w-2/3 flex flex-col gap-8 rounded p-4 shadow-md bg-slate-700">
        <div className='flex flex-wrap text-white'>
          <div className='lg:w-1/2 w-full px-2 flex flex-col'>
            <label className='mb-2' htmlFor='nome'>Nome Completo:</label>
            <input required onChange={handleChange} value={form.nome} className='p-2 rounded text-slate-900' id='nome' type="text" name="nome" placeholder="Ex.: Arthur de Oliveira" />
          </div>
          <div className='lg:w-1/2 w-full px-2 flex flex-col'>
            <label className='mb-2' htmlFor='cpf'>CPF:</label>
            <InputMask onChange={handleChange} value={form.cpf} mask="999.999.999-99">
              {(inputProps) => <input required {...inputProps} className='p-2 rounded text-slate-900' id='cpf' type="text" name="cpf" placeholder="Ex.: 111.111.111-11" />}
            </InputMask>
          </div>
          <div className='lg:w-1/2 w-full px-2 flex flex-col'>
            <label className='my-2' htmlFor='setor'>Setor:</label>
            <input required onChange={handleChange} value={form.setor} className='p-2 rounded text-slate-900' id='setor' type="text" name="setor" placeholder="Ex.: CRAS" />
          </div>
          <div className='lg:w-1/2 w-full px-2 flex flex-col'>
            <label className='my-2' htmlFor='cargo'>Cargo:</label>
            <input required onChange={handleChange} value={form.cargo} className='p-2 rounded text-slate-900' id='cargo' type="text" name="cargo" placeholder="Ex.: Técnico de Informática" />
          </div>
        </div>
        <div className='flex flex-col gap-8'>
          {/* Input */}
          <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded inline-block mx-auto text-white">
            Selecionar Foto
            <input required
              accept="image/*"
              multiple={false}
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </label>
          {/* React Crop */}
          <div className="mx-auto lg:w-1/3 w-1/2 flex items-center justify-center border-2 border-dashed text-white p-2 rounded">
            {src ? (
              <ReactCrop keepSelection aspect={aspect} crop={crop} onComplete={handleComplete} onChange={(_, percentCrop) => setCrop(percentCrop)}>
                <img src={src} onLoad={handleLoad} alt="Your selected image" />
              </ReactCrop>
            ) : (
              <span></span>
            )}
          </div>
          {/* Upload Btn */}
          <button
            disabled={uploading}
            style={{ opacity: uploading ? '.5' : '1' }}
            className="bg-indigo-600 mx-auto rounded p-2 px-4 cursor-pointer text-white hover:bg-indigo-700"
          >
            {uploading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
      {/* Stored images */}
      <div className="mx-auto mb-8 w-1/2 mt-8 flex flex-col space-y-4 bg-slate-700 rounded p-4">
        <p className='text-white text-xl text-center italic'>Storage: /public/images</p>
        {dirs.length > 0 && dirs.map((item) => (
          <Link
            target="_blank"
            className="text-indigo-500 hover:underline"
            key={item}
            href={`/images/${item}`}
          >
            {item}
          </Link>
        ))}
        {dirs.length === 0 && <span className='text-red-200 text-center'>No files</span>}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const props = { dirs: [] };
  try {
    const dirs = await fs.readdir(path.join(process.cwd(), "/public/images"));
    props.dirs = dirs;
    return { props }

  } catch (error) {
    return { props };
  }
}