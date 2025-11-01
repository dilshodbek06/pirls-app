import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PassageCard from "@/components/PassageCard";
import { Library } from "lucide-react";
import { passages } from "@/mock/passagesData";

const Passages = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-linear-to-r from-cyan-500 to-green-500">
        <Header />
      </div>

      <main className="flex-1 py-12 px-4">
        <div className="container max-w-340 mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Library className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Reading Library
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Barcha matnlar</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Matnni tanlang va o‘qish tushunish darajangizni tekshirib ko‘ring.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {passages.map((passage, index) => (
              <div
                key={passage.id}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PassageCard passage={passage} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Passages;
