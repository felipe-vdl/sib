import prisma from '../../../db';
import path from 'path';
import fs from 'fs/promises';

export default async function (req, res) {
  const id = +req.query.id;
  const registro = await prisma.registro.findUnique({
    where: { id }
  });

  if (!registro) return res.status(404).json('O registro não existe.');

  try {
    await fs.readdir(path.join(process.cwd() + '/storage/images'));

  } catch (error) {
    await fs.mkdir(path.join(process.cwd(), '/storage'));
    await fs.mkdir(path.join(process.cwd() + '/storage', '/images'));
  }

  try {
    const foto = await fs.readFile(path.join(process.cwd() + '/storage/images/' + registro.foto));
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(foto);

  } catch (error) {
    return res.status(404).json('Foto não existe.');
  }

}