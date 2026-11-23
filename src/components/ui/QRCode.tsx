'use client';

import { useState } from 'react';
import { QrCode, Download, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QRCodeDisplayProps {
  dataUrl?: string;
  businessName?: string;
  scanUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  onDownload?: () => void;
}

export default function QRCodeDisplay({
  dataUrl,
  businessName,
  scanUrl,
  size = 'md',
  onDownload,
}: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const sizes = {
    sm: { qr: 32, container: 'w-32 h-32' },
    md: { qr: 48, container: 'w-48 h-48' },
    lg: { qr: 64, container: 'w-64 h-64' },
  };

  const handleDownload = () => {
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = `${businessName || 'qrcode'}.png`;
      link.href = dataUrl;
      link.click();
    }
    onDownload?.();
  };

  const handleCopyUrl = () => {
    if (scanUrl) {
      navigator.clipboard.writeText(scanUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="text-center">
      <div className="relative inline-block p-4 bg-white rounded-xl shadow-lg">
        {dataUrl ? (
          <img
            src={dataUrl}
            alt="QR Code"
            className={cn('rounded-lg', sizes[size].container)}
          />
        ) : (
          <div
            className={cn(
              'bg-gray-100 rounded-lg flex items-center justify-center',
              sizes[size].container
            )}
          >
            <QrCode className={cn('text-gray-400', `w-${sizes[size].qr / 4} h-${sizes[size].qr / 4}`)} />
          </div>
        )}

        {/* Logo overlay */}
        {businessName && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
            <span className="text-xs font-bold text-primary-600">
              {businessName.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-2 mt-4">
        {dataUrl && (
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        )}
        {scanUrl && (
          <button
            onClick={handleCopyUrl}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <ExternalLink className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
        )}
      </div>
    </div>
  );
}
