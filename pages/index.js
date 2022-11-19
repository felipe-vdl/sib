import Link from 'next/link'
import { useRouter } from 'next/router';
import { useState } from "react";
import path from 'path';
import fs from 'fs/promises';

export default function Home({ dirs }) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedImage, setSelectedImage] = useState();
  const router = useRouter();
  
  const formInit = {
    nome: '',
    cpf: '',
    cargo: '',
    setor: ''
  }
  const [form, setForm] = useState(formInit);

  const handleUpload = async () => {
    try {
      if (!selectedFile) return;

      setUploading(true);
      const formData = new FormData();
      formData.append("image", selectedFile);
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
      setSelectedFile("");
      setSelectedImage("");
      setUploading(false);
      //router.reload(window.location.pathname);

    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = evt => {
    setForm(st => ({...st, [evt.target.name]: evt.target.value}));
  }

  return (
    <div className="flex flex-col m-auto mt-4 w-full">
      <div className="mx-auto w-2/3 flex flex-col gap-8 rounded p-4 shadow-md bg-slate-700">
        <div className='flex flex-wrap text-white'>
          <div className='w-1/2 px-2 flex flex-col'>
            <label className='mb-2' htmlFor='nome'>Nome:</label>
            <input onChange={handleChange} value={form.nome} className='p-2 rounded text-slate-900' id='nome' type="text" name="nome" />
          </div>
          <div className='w-1/2 px-2 flex flex-col'>
            <label className='mb-2' htmlFor='cpf'>CPF:</label>
            <input onChange={handleChange} value={form.cpf} className='p-2 rounded text-slate-900' id='cpf' type="text" name="cpf" />
          </div>
          <div className='w-1/2 px-2 flex flex-col'>
            <label className='my-2' htmlFor='setor'>Setor:</label>
            <input onChange={handleChange} value={form.setor} className='p-2 rounded text-slate-900' id='setor' type="text" name="setor" />
          </div>
          <div className='w-1/2 px-2 flex flex-col'>
            <label className='my-2' htmlFor='cargo'>Cargo:</label>
            <input onChange={handleChange} value={form.cargo} className='p-2 rounded text-slate-900' id='cargo' type="text" name="cargo" />
          </div>
        </div>
        <div className='flex flex-col gap-8'>
          {/* Input */}
          <label>
            <input
              type="file"
              hidden
              onChange={({ target }) => {
                if (target.files) {
                  const file = target.files[0];
                  setSelectedImage(URL.createObjectURL(file));
                  setSelectedFile(file);
                }
              }}
            />
            <div className="mx-auto w-1/3 flex items-center justify-center border-2 border-dashed cursor-pointer text-white p-4 rounded">
              {selectedImage ? (
                <img src={selectedImage} alt="Your selected image" />
              ) : (
                <span className="">Select an Image</span>
              )}
            </div>
          </label>
          {/* Upload Btn */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{ opacity: uploading ? '.5' : '1' }}
            className="bg-indigo-600 mx-auto rounded p-2 px-4 cursor-pointer text-white hover:bg-indigo-700"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {/* Stored images */}
      </div>
      <div className="mx-auto w-1/2 mt-8 flex flex-col space-y-4 bg-slate-700 rounded p-4">
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