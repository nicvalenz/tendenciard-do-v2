#!/bin/bash
cd "$(dirname "$0")"
echo "Iniciando Noticias TendenciaRD..."
echo "Instalando dependencias (esto solo tomara un momento la primera vez)..."
npm install
echo "Abriendo el panel en el navegador..."
open http://localhost:3000
echo "Iniciando servidor local..."
npm run dev
