// api/media.js - Endpoint para servir arquivos de mídia
const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  // Habilita CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  const { type, file } = req.query;
  
  // Mapeamento de tipos de arquivo
  const mediaTypes = {
    audio: {
      directory: 'public/audio',
      mime: {
        mp3: 'audio/mpeg',
        ogg: 'audio/ogg',
        wav: 'audio/wav'
      }
    },
    image: {
      directory: 'public/images',
      mime: {
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        png: 'image/png'
      }
    }
  };
  
  if (!mediaTypes[type] || !file) {
    return res.status(400).json({ error: 'Parâmetros inválidos' });
  }
  
  // Constrói caminho do arquivo
  const filePath = path.join(process.cwd(), mediaTypes[type].directory, file);
  const ext = path.extname(file).substring(1);
  const mimeType = mediaTypes[type].mime[ext];
  
  if (!mimeType) {
    return res.status(415).json({ error: 'Tipo de arquivo não suportado' });
  }
  
  // Verifica se arquivo existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado' });
  }
  
  // Serve o arquivo
  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    'Content-Type': mimeType,
    'Content-Length': stat.size,
    'Cache-Control': 'public, max-age=31536000' // Cache por 1 ano
  });
  
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
}

// Para rotas específicas (ex: /api/audio/narracao)
export const config = {
  api: {
    bodyParser: false, // Importante para arquivos grandes
  },
};