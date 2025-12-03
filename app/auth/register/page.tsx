"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ⬇️ shadcn/ui Select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DISTRICTS, REGIONS } from "@/mock/auth";

type FormData = {
  fullName: string;
  age: string;
  schoolName: string;
  region: string; // viloyat
  district: string; // tuman
};

const Register = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    age: "",
    schoolName: "",
    region: "",
    district: "",
  });

  // Tanlangan viloyatga mos tumanlar
  const districtOptions = useMemo(() => {
    return formData.region
      ? DISTRICTS[formData.region as keyof typeof DISTRICTS]
      : [];
  }, [formData.region]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.age ||
      !formData.schoolName ||
      !formData.region ||
      !formData.district
    ) {
      toast("Iltimos majburiy maydonlarni to'ldiring", {
        position: "top-right",
      });
      return;
    }

    localStorage.setItem("pirlsUser", JSON.stringify(formData));

    setTimeout(() => {
      router.push("/passages");
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Select uchun yordamchi setterlar
  const setRegion = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      region: value,
      district: "", // viloyat o‘zgarsa, tumanni tozalaymiz
    }));
  };
  const setDistrict = (value: string) => {
    setFormData((prev) => ({ ...prev, district: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-linear-to-r px-4 from-cyan-500 to-green-500">
        <Header />
      </div>

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="animate-fade-in-up shadow-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">
                PIRLS EDU ga qo&apos;shiling
              </CardTitle>
              <CardDescription>
                Shaxsiy hisob yarating va o‘quv safaringizni boshlang.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">To‘liq ism</Label>
                  <Input
                    className="bg-background"
                    id="fullName"
                    name="fullName"
                    placeholder="To‘liq ismingizni kiriting..."
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Yosh</Label>
                  <Input
                    className="bg-background"
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Yoshingizni kiriting..."
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-3 items-center">
                  {/* Viloyat (region) */}
                  <div className="space-y-2 w-full">
                    <Label>Viloyat</Label>
                    <Select value={formData.region} onValueChange={setRegion}>
                      <SelectTrigger className="bg-background w-full">
                        <SelectValue placeholder="Viloyatni tanlang..." />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tuman (district) — viloyat tanlanganda aktiv bo‘ladi */}
                  <div className="space-y-2 w-full">
                    <Label>Tuman</Label>
                    <Select
                      value={formData.district}
                      onValueChange={setDistrict}
                      disabled={!formData.region}
                    >
                      <SelectTrigger className="bg-background w-full">
                        <SelectValue placeholder="Tumanni tanlang..." />
                      </SelectTrigger>
                      <SelectContent>
                        {districtOptions.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* School number */}
                <div className="space-y-2">
                  <Label htmlFor="schoolName">Maktab nomi</Label>
                  <Input
                    className="bg-background"
                    id="schoolName"
                    name="schoolName"
                    placeholder="Maktabingiz nomini kiriting... (34-maktab)"
                    value={formData.schoolName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full hover:scale-[1.01]"
                  size="lg"
                >
                  Qo‘shilish
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
