import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, Users, Target, Sparkles } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-linear-to-r px-4 from-cyan-500 to-green-500">
        <Header />
      </div>

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">PIRLS EDU haqida</h1>
            <p className="text-lg text-muted-foreground">
              O‘quvchilarda o‘qishga bo‘lgan ishonchni shakllantirish
            </p>
          </div>

          <div className="space-y-12">
            <section className="animate-fade-in-up">
              <div className="bg-card rounded-xl p-8 border border-border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="rounded-lg bg-linear-to-br from-primary/10 to-accent/10 p-3">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      Bizning maqsadimiz
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      PIRLS EDU butun dunyo maktab o‘quvchilari o‘rtasida o‘qish
                      savodxonligini oshirishga bag‘ishlangan. Biz o‘qish va
                      matnni tushunish ko‘nikmalari akademik muvaffaqiyat hamda
                      umrbod o‘qishga bo‘lgan qiziqishning asosini tashkil
                      etadi, deb ishonamiz. Bizning platformamiz o‘quvchilarga
                      tanqidiy fikrlash va matnni chuqur tushunish
                      qobiliyatlarini rivojlantirishga yordam beruvchi,
                      ehtiyotkorlik bilan tanlangan matnlar va savollarni taqdim
                      etadi.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              <div className="bg-card rounded-xl p-8 border border-border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="rounded-lg bg-linear-to-br from-secondary/10 to-accent/10 p-3">
                    <BookOpen className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      Biz taklif etamiz
                    </h2>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span>
                          Turli mavzular va murakkablik darajalarini qamrab
                          olgan xilma-xil o‘qish matnlari
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span>
                          Tushunishni tekshiruvchi interaktiv savollar
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span>
                          O‘quvchilarga javoblaridan o‘rganishga yordam beruvchi
                          darhol fikr-mulohaza
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span>
                          Maktab yoshidagi o‘quvchilar uchun moslashtirilgan
                          yoshga mos mazmun
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span>
                          O‘qishni yoqimli jarayonga aylantiruvchi qulay va
                          foydalanuvchiga mos interfeys
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <div className="bg-card rounded-xl p-8 border border-border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="rounded-lg bg-linear-to-br from-accent/10 to-primary/10 p-3">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      O‘quvchilar va o‘qituvchilar uchun
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Agar siz o‘qish ko‘nikmalaringizni rivojlantirmoqchi
                      bo‘lgan o‘quvchi bo‘lsangiz yoki sinfingiz uchun sifatli
                      resurslarni izlayotgan o‘qituvchi bo‘lsangiz, PIRLS EDU
                      sizga yordam berishga tayyor. Bizning platformamizdan
                      mustaqil mashg‘ulotlar, uy vazifalari yoki sinfdagi dars
                      faoliyatlari uchun foydalanish mumkin.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Biz mazmunimizni doimiy ravishda yangilab boramiz, shunda
                      u qiziqarli, dolzarb va ta’lim standartlariga mos bo‘lib
                      qoladi. Keling, barcha o‘quvchilar uchun o‘qish va
                      tushunishni qulay hamda zavqli jarayonga aylantiraylik!
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <div className="bg-linear-to-r from-primary to-accent rounded-xl p-8 text-center">
                <Sparkles className="h-12 w-12 text-primary-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-primary-foreground mb-2">
                  Bugunoq o‘qish safaringizni boshlang
                </h2>
                <p className="text-primary-foreground/90">
                  PIRLS EDU yordamida o‘qish ko‘nikmalarini rivojlantirayotgan
                  minglab o‘quvchilarga qo‘shiling
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
