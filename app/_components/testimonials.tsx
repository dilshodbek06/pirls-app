import { Quote, Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Azizbek Karimov",
      role: "5-sinf o'quvchisi",
      opinion:
        "PIRLS EDU menga o‘qishni maroqli qildi! Men matnni tushunish ko‘nikmalarimni yaxshiladim va test natijalarim oshdi.",
      rating: 5,
    },
    {
      name: "Dilnoza Tursunova",
      role: "Ota-ona",
      opinion:
        "Qizim bu platformadan foydalanishni juda yoqtiradi. Juda qiziqarli va men uning o‘qish ko‘nikmalaridagi haqiqiy o‘sishni ko‘ryapman.",
      rating: 5,
    },
    {
      name: "Jamshid Rasulov",
      role: "5-sinf o'quvchisi",
      opinion:
        "Matnlar juda qiziqarli, savollar esa o‘qiganlarimni yaxshiroq tushunishga yordam beradi. Barchaga tavsiya qilaman!",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Foydalanuvchilar fikrlari
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            PIRLS EDU’ning afzalliklarini ko‘rgan o‘quvchilar va ota-onalarning
            fikrlarini o‘qing.
          </p>
        </div>

        <div className="relative">
          <div className="flex animate-marquee">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border shrink-0 w-[350px] mx-3"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-primary text-primary"
                    />
                  ))}
                </div>

                <Quote className="h-8 w-8 text-primary/20 mb-3" />

                <p className="text-muted-foreground mb-4 italic">
                  &quot;{testimonial.opinion}&quot;
                </p>

                <div className="border-t border-border pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
