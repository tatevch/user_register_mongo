import fs from 'fs';
import url from 'url';
import path from 'path';
import { Documents } from '../models';

export default async (req, res, next) => {
  try {
    const { originalUrl, query } = req;

    if ('download' in query) {
      const filepath = url.parse(originalUrl).pathname;

      if (fs.existsSync(path.join(__dirname, '../public', filepath))) {
        const file = await Documents.findOne({ url: filepath });

        const name = file && file.originalName ? file.originalName : path.basename(filepath);

        res.set('Content-Disposition', `attachment; filename="${name}"`);
      }
    }

    next();
  } catch (e) {
    next(e);
  }
};
