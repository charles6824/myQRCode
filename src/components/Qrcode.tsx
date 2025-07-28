import React, { useRef, useState } from 'react';
import QRCode from 'qrcode';
import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import logo from '../assets/logo.png'; // Ensure logo exists

const QRGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [qrImage, setQrImage] = useState<string>('');
  const qrRef = useRef<HTMLDivElement>(null);

  const generateQR = async () => {
    if (!input) return;

    const canvas = document.createElement('canvas');

    await QRCode.toCanvas(canvas, input, {
      width: 512, // HD Quality
      margin: 2,
      scale: 10, // increases sharpness
    });

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const logoImg = new Image();
      logoImg.src = logo;
      logoImg.onload = () => {
        const size = 50; // increase logo size for HD canvas
        ctx.drawImage(
          logoImg,
          canvas.width / 2 - size / 2,
          canvas.height / 2 - size / 2,
          size,
          size
        );
        setQrImage(canvas.toDataURL('image/png', 1.0));
      };
    }
  };

  const downloadImage = async (type: 'png' | 'jpeg') => {
    if (!qrRef.current) return;
    const dataUrl = type === 'png'
      ? await toPng(qrRef.current, { quality: 1.0 })
      : await toJpeg(qrRef.current, { quality: 1.0 });
    const link = document.createElement('a');
    link.download = `qr-code.${type}`;
    link.href = dataUrl;
    link.click();
  };

  const downloadPDF = async () => {
    if (!qrRef.current) return;
    const dataUrl = await toPng(qrRef.current);
    const pdf = new jsPDF();
    pdf.addImage(dataUrl, 'PNG', 10, 10, 180, 180);
    pdf.save('qr-code.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          🔳 QR Code Generator
        </h2>

        <input
          type="text"
          placeholder="Enter text or URL..."
          className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 px-4 py-3 rounded-lg text-gray-700 text-sm mb-4"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={generateQR}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 cursor-pointer"
        >
          Generate QR Code
        </button>

        {qrImage && (
          <div className="mt-8 flex flex-col items-center gap-6">
            <div
              ref={qrRef}
              className="bg-white p-3 rounded-lg shadow-md border border-gray-200"
            >
              <img src={qrImage} alt="Generated QR Code" className="w-64 h-64 object-contain" />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => downloadImage('png')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Download PNG
              </button>
              <button
                onClick={() => downloadImage('jpeg')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Download JPG
              </button>
              <button
                onClick={downloadPDF}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRGenerator;
