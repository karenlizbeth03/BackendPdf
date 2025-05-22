const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const app = express();
app.use(cors()); // Permite peticiones desde otros orígenes (como Flutter Web)

// Almacena archivos temporalmente en la carpeta uploads/
const upload = multer({ dest: 'uploads/' });

// Ruta para recibir PDF y extraer texto
app.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    // Leer el archivo subido
    const dataBuffer = fs.readFileSync(req.file.path);
    
    // Extraer texto
    const data = await pdfParse(dataBuffer);

    // Enviar texto extraído como respuesta
    res.json({ text: data.text });

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

