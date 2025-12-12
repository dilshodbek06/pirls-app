"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/actions/auth";

const TeacherLogin = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError("Email va parol talab etiladi");
      setIsLoading(false);
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append("email", formData.email);
      formDataObj.append("password", formData.password);

      const result = await loginAction(formDataObj);

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Login vaqti xatolik yuz berdi. Qayta urinib ko'ring.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 md:mb-6 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <GraduationCap className="h-12 w-12 md:h-16 md:w-16 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              O‘qituvchi Kabineti
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Akkauntingizga kirish uchun email va parolni kiriting.
            </p>
          </div>

          <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email manzilingizni kiriting..."
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="h-11"
                    required
                    disabled={isLoading}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Parol
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Parolni kiriting..."
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="h-11"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    variant={"hero"}
                    type="submit"
                    size="lg"
                    className="w-full gap-2 hover:scale-[1.01]"
                    disabled={isLoading}
                  >
                    <GraduationCap className="h-5 w-5" />
                    {isLoading ? "Kirish..." : "Kirish"}
                  </Button>
                </div>

                <div className="pt-2 text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Akkauntingiz yo‘qmi?{" "}
                    <Link
                      href="/auth/teacher-register"
                      className="text-primary hover:underline font-semibold"
                    >
                      Ro‘yxatdan o‘ting
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeacherLogin;
