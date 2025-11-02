import Image from "next/image";

const HeroBottom = () => {
  return (
    <div>
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                PIRLS qanaqa tizim?
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                PIRLS tadqiqotlari doirasida turli ta’lim tizimiga ega bo‘lgan
                davlatlar 4-sinf o‘quvchilarining o‘qish sifati va o‘qilgan
                matnni tushunish darajasi o‘rganiladi. Bu tadqiqotlarga 4-sinf
                o‘quvchilarining tanlanishi shu bilan e’tiborliki, aynan
                o‘qishning to‘rtinchi yilida o‘quvchilar o‘qishning yuqori
                darajasiga ega bo‘lishi, ularning keyingi ta’limda bilimni
                egallash qobiliyatini shakllantirish va shu orqali hozirgi
                zamonga muvaffaqiyatli moslashuviga yordam beradi.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                PIRLSni o‘rganish maqsadi dunyoning turli mamlakatlaridan kelgan
                to‘rtinchi sinf o‘quvchilari tomonidan matnni tushunish
                darajasini taqqoslash, shuningdek, milliy ta’lim tizimlarida
                o‘qish savodxonligi o‘rtasidagi tafovutlarni aniqlash.
              </p>
            </div>
            <div className="animate-fade-in">
              <Image
                width={300}
                height={300}
                src={"/images/pirls.jpeg"}
                alt="Students taking digital reading assessment on computers"
                className="rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroBottom;
