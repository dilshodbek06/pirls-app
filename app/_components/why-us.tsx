import { Award, BookOpen, Sparkles, TrendingUp } from "lucide-react";

const WhyUs = () => {
  const benefits = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "O‘qish tushunishni yaxshilaydi",
      description:
        "Puxta tanlangan matnlar va savollar orqali o‘qish ko‘nikmalaringizni mustahkamlang.",
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Qiziqarli va interaktiv mashg‘ulotlar",
      description:
        "O‘qishni yanada zavqli qiladigan qiziqarli hikoyalar va mavzular bilan shug‘ullaning.",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Tracks Your Progress",
      description:
        "See your scores and improvements as you complete more passages.",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "School-Level Learning",
      description:
        "Designed specifically for school students with age-appropriate content.",
    },
  ];
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
            {benefits.map((benefit, index) => (
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
