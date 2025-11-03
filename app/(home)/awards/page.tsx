"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Download, BookCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { passages } from "@/mock/passagesData";

const Awards = () => {
  const handleDownloadCertificate = (passageTitle: string) => {
    // Create a simple certificate
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 800, 600);

      // Border
      ctx.strokeStyle = "#8B5CF6";
      ctx.lineWidth = 10;
      ctx.strokeRect(20, 20, 760, 560);

      // Inner border
      ctx.strokeStyle = "#A78BFA";
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, 720, 520);

      // Title
      ctx.fillStyle = "#8B5CF6";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Certificate of Achievement", 400, 120);

      // Subtitle
      ctx.fillStyle = "#6B7280";
      ctx.font = "24px Arial";
      ctx.fillText("This certifies that", 400, 180);

      // Student name placeholder
      ctx.fillStyle = "#1F2937";
      ctx.font = "bold 36px Arial";
      ctx.fillText("Student Name", 400, 250);

      // Achievement text
      ctx.fillStyle = "#6B7280";
      ctx.font = "20px Arial";
      ctx.fillText("has successfully completed the reading passage", 400, 310);

      // Passage title
      ctx.fillStyle = "#8B5CF6";
      ctx.font = "bold 28px Arial";
      ctx.fillText(`"${passageTitle}"`, 400, 360);

      // Date
      ctx.fillStyle = "#6B7280";
      ctx.font = "18px Arial";
      const date = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      ctx.fillText(`Date: ${date}`, 400, 440);

      // Footer
      ctx.fillStyle = "#8B5CF6";
      ctx.font = "bold 24px Arial";
      ctx.fillText("PIRLS EDU", 400, 520);
    }

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `certificate-${passageTitle
          .toLowerCase()
          .replace(/\s+/g, "-")}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-linear-to-r px-4 from-cyan-500 to-green-500">
        <Header />
      </div>

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Yutuq sertifikatlar
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Sertifikatlar</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tugallangan matnlar uchun sertifikatlaringizni yuklab oling.
            </p>
          </div>

          <div className="space-y-4">
            {passages.map((passage, index) => (
              <Card
                key={passage.id}
                className="hover:shadow-md transition-all hover:-translate-y-0.5 animate-fade-in border"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 p-4 md:p-6">
                  {/* Left side - Passage info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start md:items-center gap-3">
                      <BookCheck className="h-6 w-6 md:h-8 md:w-8 text-primary shrink-0 mt-1 md:mt-0" />
                      <div className="flex-1">
                        <CardTitle className="text-lg md:text-xl mb-1">
                          {passage.title}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          Reading comprehension certificate for successful
                          completion
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:gap-6 ml-0 md:ml-11">
                      <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm font-medium text-muted-foreground">
                          Questions:
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-sm md:text-base font-bold"
                        >
                          {passage.questions.length}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm font-medium text-muted-foreground">
                          Difficulty:
                        </span>
                        <Badge
                          variant="outline"
                          className="capitalize text-xs md:text-sm"
                        >
                          {passage.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Download button */}
                  <div className="shrink-0 w-full md:w-auto">
                    <Button
                      size="lg"
                      className="gap-2 w-full md:min-w-[200px]"
                      onClick={() => handleDownloadCertificate(passage.title)}
                    >
                      <Download className="h-4 w-4 md:h-5 md:w-5" />
                      Yuklab olish
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center p-6 bg-primary/5 rounded-xl border border-primary/20 animate-fade-in">
            <Award className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Earn Your Certificates
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete reading passages and download your personalized
              certificates to celebrate your achievements. Each certificate
              recognizes your dedication to improving reading comprehension
              skills.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Awards;
