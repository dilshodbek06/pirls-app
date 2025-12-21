"use client";

import { useCallback } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  passageTitle: string;
  studentName: string;
  score: number;
};

export default function CertificateDownloadButton({
  passageTitle,
  studentName,
  score,
}: Props) {
  const handleDownload = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 800, 600);

      ctx.strokeStyle = "#6D28D9";
      ctx.lineWidth = 10;
      ctx.strokeRect(20, 20, 760, 560);

      ctx.strokeStyle = "#A78BFA";
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, 720, 520);

      ctx.fillStyle = "#6D28D9";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Muvaffaqiyat sertifikati", 400, 120);

      ctx.fillStyle = "#4B5563";
      ctx.font = "24px Arial";
      ctx.fillText("Ushbu sertifikat topshirildi", 400, 180);

      ctx.fillStyle = "#1F2937";
      ctx.font = "bold 40px Arial";
      ctx.fillText(studentName, 400, 250);

      ctx.fillStyle = "#4B5563";
      ctx.font = "20px Arial";
      ctx.fillText("matnni muvaffaqiyatli o'qib tugatganligi uchun", 400, 310);

      ctx.fillStyle = "#6D28D9";
      ctx.font = "bold 28px Arial";
      ctx.fillText(`"${passageTitle}"`, 400, 360);

      ctx.fillStyle = "#4B5563";
      ctx.font = "18px Arial";
      const date = new Date().toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      ctx.fillText(`Sana: ${date}`, 400, 440);

      ctx.fillStyle = "#6D28D9";
      ctx.font = "bold 28px Arial";
      ctx.fillText("PIRLS EDU", 400, 520);
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sertifikat-${passageTitle
        .toLowerCase()
        .replace(/\s+/g, "-")}.png`;
      link.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [passageTitle, studentName]);

  const isEligible = score >= 80;

  return (
    <Button
      onClick={handleDownload}
      variant={isEligible ? "default" : "outline"}
      className="cursor-pointer"
      disabled={!isEligible}
    >
      <Download className="h-4 w-4" />
      Sertifikat
    </Button>
  );
}
