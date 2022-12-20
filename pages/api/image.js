import formidable from 'formidable';
import path from 'path';
import fs from 'fs/promises';
import prisma from '../../db';

export const config = {
  api: {
    bodyParser: false,
  }
}

const readFile = (req, saveLocally) => {
  const options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/storage/images");
    options.filename = (name, ext, path, form) => {
      return `${Date.now().toString()}_${Math.floor(Math.random() * 10001)}_${path.originalFilename}`;
    }
  }

  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    })
  });
}

export default async function handler(req, res) {
  try {
    await fs.readdir(path.join(process.cwd() + "/storage", "/images"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd(), "/storage"));
    await fs.mkdir(path.join(process.cwd() + "/storage", "/images"));
  }

  const data = await readFile(req, true);
  const { nome, cpf, setor, cargo } = data.fields;

  const newRecord = await prisma.registro.create({
    data: {
      nome: nome.toUpperCase(),
      cpf,
      setor: setor.toUpperCase(),
      cargo: cargo.toUpperCase(),
      protocolo: `${nome.substring(0, 3).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()}${cpf.substring(0, 3)}-${Math.floor(Math.random() * 999999)}`,
      foto: data.files.image.newFilename,
    }
  });

  return res.status(200).json({ message: 'All done!', record: newRecord });
}