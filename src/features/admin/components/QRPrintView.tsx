import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, ExternalLink } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface QRPrintViewProps {
  restaurantName: string;
  tableNumber: string; // e.g. "4" or "" for general menu
  qrUrl: string;
}

export const QRPrintView: React.FC<QRPrintViewProps> = ({
  restaurantName,
  tableNumber,
  qrUrl,
}) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownloadPng = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 600;
    canvas.height = 600;

    img.onload = () => {
      if (!ctx) return;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 50, 50, 500, 500);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = tableNumber
        ? `${restaurantName.toLowerCase().replace(/\s+/g, '-')}-table-${tableNumber}-qr.png`
        : `${restaurantName.toLowerCase().replace(/\s+/g, '-')}-menu-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Printable Card Template */}
      <div
        id="printable-qr-stand"
        className="bg-white p-6 rounded-3xl border-2 border-forest-900/10 shadow-sm flex flex-col items-center justify-center text-center max-w-sm mx-auto"
      >
        <div className="text-xs uppercase font-extrabold tracking-widest text-warm-600 mb-1">
          Scan to Order & Pay
        </div>
        <h3 className="text-lg font-extrabold text-forest-950 mb-3">{restaurantName}</h3>

        <div
          ref={qrRef}
          className="p-4 bg-surface-sand rounded-2xl border border-surface-border shadow-xs mb-3 flex items-center justify-center"
        >
          <QRCodeSVG
            value={qrUrl}
            size={180}
            level="H"
            includeMargin={false}
            fgColor="#0F3E2E"
          />
        </div>

        <div className="font-extrabold text-base text-forest-950">
          {tableNumber ? `Table ${tableNumber}` : 'Digital Menu'}
        </div>
        <p className="text-[11px] text-stone-500 mt-1 max-w-[220px]">
          Point your smartphone camera to open the menu and place your order.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-2 pt-1">
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Printer className="w-4 h-4" />}
          onClick={handlePrint}
        >
          Print Stand
        </Button>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Download className="w-4 h-4" />}
          onClick={handleDownloadPng}
        >
          Download PNG
        </Button>
        <a href={qrUrl} target="_blank" rel="noreferrer">
          <Button
            variant="outline"
            size="sm"
            rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Test
          </Button>
        </a>
      </div>
    </div>
  );
};
