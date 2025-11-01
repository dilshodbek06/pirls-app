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
            <h1 className="text-4xl font-bold mb-4">About PIRLS EDU</h1>
            <p className="text-lg text-muted-foreground">
              Empowering students to become confident readers
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
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      PIRLS EDU is dedicated to improving reading literacy among
                      school students worldwide. We believe that strong reading
                      comprehension skills are the foundation of academic
                      success and lifelong learning. Our platform provides
                      carefully crafted reading passages and questions that help
                      students develop critical thinking and comprehension
                      abilities.
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
                    <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span>
                          Diverse reading passages covering various topics and
                          difficulty levels
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span>
                          Interactive comprehension questions that test
                          understanding
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span>
                          Immediate feedback to help students learn from their
                          answers
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span>
                          Age-appropriate content designed for school-level
                          learners
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span>
                          A user-friendly interface that makes learning
                          enjoyable
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
                      For Students and Educators
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Whether you&apos;re a student looking to improve your
                      reading skills or an educator seeking quality resources
                      for your classroom, PIRLS EDU is here to help. Our
                      platform can be used for independent practice, homework
                      assignments, or classroom activities.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      We continuously update our content to ensure it remains
                      engaging, relevant, and aligned with educational
                      standards. Join us in making reading comprehension
                      accessible and fun for all learners!
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
                  Start Your Journey Today
                </h2>
                <p className="text-primary-foreground/90">
                  Join thousands of students improving their reading skills with
                  PIRLS EDU
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
