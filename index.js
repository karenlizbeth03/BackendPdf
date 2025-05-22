const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const app = express();
app.use(cors()); // Permite peticiones desde otros orígenes (como Flutter Web)

// Verificar si la carpeta uploads existe, si no, crearla
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configurar multer para guardar en la carpeta uploads/
const upload = multer({ dest: 'uploads/' });

// Ruta para recibir PDF y extraer texto
app.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    // Verifica si el archivo fue recibido
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ningún archivo PDF' });
    }

    console.log('Archivo recibido:', req.file); // Para depuración

    // Leer el archivo subido
    const dataBuffer = fs.readFileSync(req.file.path);
    
    // Extraer texto del PDF
    const data = await pdfParse(dataBuffer);

    // Enviar respuesta con información del archivo
    res.json({ 
      status: 'success',
      filename: req.file.originalname,
      size: req.file.size,
      text: data.text 
    });

    // Elimina el archivo del sistema luego de procesarlo
    fs.unlinkSync(req.file.path);
  } catch (err) {
    console.error('Error al procesar PDF:', err);
    res.status(500).json({ error: 'No se pudo procesar el PDF' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
