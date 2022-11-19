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

  const handleUpload = async () => {
    setUploading(true);
    try {
      if (!selectedFile) return;

      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      router.reload(window.location.pathname);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col m-auto mt-10">
      <div className="flex flex-col rounded p-4 shadow-md bg-slate-700">
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
          <div className="aspect-video flex items-center justify-center border-2 border-dashed cursor-pointer text-white p-4 rounded">
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
          className="bg-indigo-600 mx-auto mt-8 rounded p-2 px-4 cursor-pointer text-white hover:bg-indigo-700"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        {/* Stored images */}
      </div>
      <div className="mt-20 flex flex-col space-y-4 bg-slate-700 rounded p-4">
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