import { prisma } from '../../../db';
import Jimp from 'jimp';
import path from 'path';

export default async function (req, res) {
  try {
    const { id } = req.query;
    let parsedId = +id.substr(0, id.indexOf('.'));

    const registro = await prisma.registro.findUnique({ where: { id: parsedId } });
    const foto = await Jimp.read(path.join(process.cwd(), '/storage/images', registro.foto));
    foto.resize(355, 473);

    const frente = await Jimp.read(path.join(process.cwd(), '/images', '/frente.jpg'));
    frente.composite(foto, 136, 259);

    // Nome
    await Jimp.loadFont(path.join(process.cwd(), '/fonts', '/Frente-Nome.fnt')).then(font => {
      const w = frente.bitmap.width;
      const h = frente.bitmap.height;
      const text = registro.nome.substring(0, 15).toUpperCase().trim();
      const textWidth = Jimp.measureText(font, text);
      const textHeight = Jimp.measureTextHeight(font, text);

      frente.print(font, w / 2 - textWidth / 2, 765, {
        text: text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      }, textWidth, textHeight);
    });

    // Cargo
    await Jimp.loadFont(path.join(process.cwd(), '/fonts', '/Frente-CargoSetor.fnt')).then(font => {
      const w = frente.bitmap.width;
      const h = frente.bitmap.height;
      const text = registro.cargo.substring(0, 22).toUpperCase().trim();
      const textWidth = Jimp.measureText(font, text);
      const textHeight = Jimp.measureTextHeight(font, text);

      frente.print(font, w / 2 - textWidth / 2, 813, {
        text: text,
        //alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      }, textWidth, textHeight);
    });

    // Setor
    await Jimp.loadFont(path.join(process.cwd(), '/fonts', '/Frente-CargoSetor.fnt')).then(font => {
      const w = frente.bitmap.width;
      const h = frente.bitmap.height;
      const text = registro.setor.substring(0, 19).toUpperCase().trim();
      const textWidth = Jimp.measureText(font, text);
      const textHeight = Jimp.measureTextHeight(font, text);

      frente.print(font, w / 2 - textWidth / 2, 833, {
        text: text,
        //alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      }, textWidth, textHeight);
    });

    frente.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
      res.writeHead(200, { 'Content-Type': 'image/jpg' });
      res.end(buffer);
    });

  } catch (error) {
    console.log(error);
    return res.json(error);
  }
}