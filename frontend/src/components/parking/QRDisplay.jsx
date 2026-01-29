import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { QR_CONFIG } from "@/utils/constants";

const QRDisplay = ({ data, size = 160, showLogo = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (data && canvasRef.current) {
      generateQR();
    }
  }, [data, size]);

  const generateQR = async () => {
    try {
      await QRCode.toCanvas(canvasRef.current, data, {
        width: size,
        height: size,
        margin: QR_CONFIG.margin,
        color: QR_CONFIG.color,
        errorCorrectionLevel: "M",
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  return (
    <div className="qr-container inline-block">
      <canvas
        ref={canvasRef}
        className="rounded-lg"
        style={{
          width: size,
          height: size,
          imageRendering: "pixelated",
        }}
      />
      {showLogo && (
        <div className="text-center mt-2">
          <p className="text-xs text-slate-500 font-medium">
            Quét mã để thanh toán
          </p>
        </div>
      )}
    </div>
  );
};

export default QRDisplay;
