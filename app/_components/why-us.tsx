import { type ReactNode } from "react";

import { Award, BookOpen, Globe2, TrendingUp } from "lucide-react";

type Benefit = {
  icon: ReactNode;
  title: string;
  description: string;
};

const BENEFITS: Benefit[] = [
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: "Matnni anglash strategiyalari",
    description:
      "PIRLS uslubidagi topshiriqlar orqali asosiy g‘oya va dalillarni aniqlash ko‘nikmasini rivojlantiring.",
  },

  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Natijalarni kuzatish",
    description: "Har bir testdan so‘ng individual tahlillarni ko‘ring.",
  },

  {
    icon: <Award className="h-8 w-8" />,
    title: "Standartlarga mos mazmun",
    description:
      "Milliy dastur va PIRLS talablariga mos, sinf darajasiga moslashtirilgan materiallar.",
  },

  {
    icon: <Globe2 className="h-8 w-8" />,
    title: "O‘zbek tiliga mos platforma",
    description: "Ona tildagi matnlar va o‘quvchiga yaqin tushunarli kontekst.",
  },
];

const WhyUs = () => {
  return (
    <div>
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-340 mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nega aynan PIRLS EDU?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Bizning platformamiz sizni ishonchli va mohir o‘quvchiga
              aylantiradigan barcha imkoniyatlarni taqdim etadi.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="rounded-lg bg-linear-to-br from-primary/10 to-accent/10 w-16 h-16 flex items-center justify-center mb-4 text-primary">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyUs;
