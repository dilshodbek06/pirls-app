"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MessageSquare, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      //   toast({
      //     title: "Missing Information",
      //     description: "Please fill in all required fields",
      //     variant: "destructive",
      //   });
      return;
    }

    // Mock submission
    // toast({
    //   title: "Message Sent!",
    //   description: "Thank you for contacting us. We will get back to you soon.",
    // });

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-linear-to-r px-4 from-cyan-500 to-green-500">
        <Header />
      </div>

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Biz bilan bog&apos;laning
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Bog&apos;lanish</h1>
            <p className="text-lg text-muted-foreground">
              Savollaringiz bormi? Sizdan xabar kutamiz.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="animate-fade-in-up">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center mb-4">
                  <Send className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>Bizga xabar yuboring</CardTitle>
                <CardDescription>
                  Formani to&apos;ldiring, imkon qadar tezda sizga javob
                  beramiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ism *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Ismingiz"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="emailingiz@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Mavzu</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Bu nima haqida?"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Xabar *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Batafsil yozib qoldiring..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" variant="hero" className="w-full">
                    Xabarni yuborish
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div
              className="space-y-6 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-linear-to-br from-primary/10 to-accent/10 p-3">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Bizga email yozing</h3>
                      <p className="text-sm text-muted-foreground">
                        support@pirlsedu.com
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">
                    Tez-tez beriladigan savollar
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-foreground mb-1">
                        Qanday boshlash mumkin?
                      </p>
                      <p className="text-muted-foreground">
                        Ro&apos;yxatdan o&apos;tish va matnlarni o&apos;rganish
                        uchun &quot;Start Learning&quot; tugmasini bosing.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">
                        PIRLS EDU bepulmi?
                      </p>
                      <p className="text-muted-foreground">
                        Ha! Barcha o&apos;qish matnlari va savollar bepul.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">
                        O&apos;qituvchilar ushbu platformadan
                        foydalana oladimi?
                      </p>
                      <p className="text-muted-foreground">
                        Albatta! O&apos;qituvchilar matnlarni dars
                        mashg&apos;ulotlari va topshiriqlarda ishlata olishadi.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-linear-to-r from-primary to-accent rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold text-primary-foreground mb-2">
                  Tezkor javob
                </h3>
                <p className="text-primary-foreground/90 text-sm">
                  Odatda barcha murojaatlarga 24 soat ichida javob beramiz
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
