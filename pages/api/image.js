import formidable from 'formidable';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '../../db';

export const config = {
  api: {
    bodyParser: false,
  }
}

const readFile = (req, saveLocally) => {
  const options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/images");
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
    await fs.readdir(path.join(process.cwd() + "/public", "/images"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
  }

  const data = await readFile(req, true);
  console.log(data);
  const { nome, cpf, setor, cargo } = data.fields;

  const newRecord = await prisma.registro.create({
    data: {
      nome, cpf, setor, cargo,
      protocolo: `${nome.substring(0, 3).normalize("NFD").replace(/[\u0300-\u036f]/g, "")}${cpf.substring(0, 3)}-${Date.now().toString()}`,
      foto: data.files.image.newFilename,
    }
  });

  return res.status(200).json({ message: 'All done!', record: newRecord });
}