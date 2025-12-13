"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  GraduationCap,
  Lock,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { registerPupil } from "@/actions/auth";
import { DISTRICTS, REGIONS } from "@/mock/auth";
import toast from "react-hot-toast";

type FormData = {
  fullName: string;
  age: string;
  province: string;
  district: string;
  schoolName: string;
  email: string;
  password: string;
};

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    age: "",
    province: "",
    district: "",
    schoolName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const districtOptions = useMemo(() => {
    return formData.province
      ? DISTRICTS[formData.province as keyof typeof DISTRICTS]
      : [];
  }, [formData.province]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "province" ? { district: "" } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (
      !formData.fullName ||
      !formData.age ||
      !formData.province ||
      !formData.district ||
      !formData.schoolName ||
      !formData.email ||
      !formData.password
    ) {
      setError("Barcha maydonlar talab etiladi");
      setIsLoading(false);
      return;
    }

    const ageNum = Number.parseInt(formData.age, 10);
    if (Number.isNaN(ageNum) || ageNum < 6 || ageNum > 20) {
      setError("Yosh 6 dan 20 gacha bo'lishi kerak");
      setIsLoading(false);
      return;
    }

    // Validate school name format (e.g., "45-maktab")
    const schoolNamePattern = /^\d+-/;
    if (!schoolNamePattern.test(formData.schoolName.trim())) {
      setError(
        'Maktab ushbu tartibda kiritilinishi kerak (masalan: "45-maktab")'
      );
      setIsLoading(false);
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append("email", formData.email);
      formDataObj.append("password", formData.password);
      formDataObj.append("fullName", formData.fullName);
      formDataObj.append("age", formData.age);
      formDataObj.append("province", formData.province);
      formDataObj.append("region", formData.district);
      formDataObj.append("schoolName", formData.schoolName);

      const result = await registerPupil(formDataObj);

      if (result?.error) {
        setError(result.error);
      } else {
        toast.success("Ro'yxatdan muvaffaqiyatli o'tdingiz!");
        router.push("/passages");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("Ro'yhatdan o'tishda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-6 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <GraduationCap className="h-12 w-12 md:h-16 md:w-16 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              O‘quvchi Kabineti
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Matnlarni ko‘rish va o‘quv safaringizni davom ettirish uchun
              ro‘yxatdan o‘ting.
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="fullName"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4 text-primary" />
                      To‘liq ism
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="To‘liq ismingizni kiriting..."
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className="h-11"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Yosh</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Yoshingizni kiriting..."
                      value={formData.age}
                      onChange={(e) => handleChange("age", e.target.value)}
                      min={6}
                      max={20}
                      className="h-11"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="province"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4 text-primary" />
                      Viloyat
                    </Label>
                    <Select
                      value={formData.province}
                      onValueChange={(value) => handleChange("province", value)}
                      required
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Viloyatingizni tanlang" />
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="district"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4 text-primary" />
                      Tuman/Shahar
                    </Label>
                    <Select
                      value={formData.district}
                      onValueChange={(value) => handleChange("district", value)}
                      disabled={!formData.province || isLoading}
                      required
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue
                          placeholder={
                            formData.province
                              ? "Tumanni tanlang"
                              : "Avval viloyatni tanlang"
                          }
                        />
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="schoolName"
                      className="flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4 text-primary" />
                      Maktab nomi
                    </Label>
                    <Input
                      id="schoolName"
                      type="text"
                      placeholder="Maktab nomini kiriting... (45-maktab)"
                      value={formData.schoolName}
                      onChange={(e) =>
                        handleChange("schoolName", e.target.value)
                      }
                      className="h-11"
                      required
                      disabled={isLoading}
                    />
                  </div>

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

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4 text-primary" />
                      Parol
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Parol o'ylab toping..."
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="h-11"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full gap-2 hover:scale-[1.01]"
                    disabled={isLoading}
                  >
                    <GraduationCap className="h-5 w-5" />
                    {isLoading
                      ? "Ro'yhatdan o'tilmoqda..."
                      : "Ro'yxatdan o'tish"}
                  </Button>
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

export default Register;
