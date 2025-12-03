"use client";

import { useMemo, useState } from "react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  MapPin,
  Building2,
  User,
  Mail,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/actions/auth";
import toast from "react-hot-toast";

// --- Data: Viloyatlar → Tumanlar ---
const UZ_REGIONS: Record<string, string[]> = {
  "Toshkent shahri": [
    "Bektemir",
    "Chilonzor",
    "Mirobod",
    "Mirzo Ulug‘bek",
    "Olmazor",
    "Sergeli",
    "Shayxontohur",
    "Uchtepa",
    "Yakkasaroy",
    "Yashnobod",
    "Yunusobod",
  ],
  "Toshkent viloyati": [
    "Bekobod",
    "Bo‘stonliq",
    "Bo‘ka",
    "Chinoz",
    "Ohangaron",
    "Oqqo‘rg‘on",
    "Parkent",
    "Piskent",
    "Quyichirchiq",
    "O‘rta Chirchiq",
    "Yuqori Chirchiq",
    "Zangiota",
    "Yangiyo‘l",
    "Qibray",
    "Nurafshon sh.",
  ],
  Andijon: [
    "Andijon sh.",
    "Andijon t.",
    "Asaka",
    "Baliqchi",
    "Bo‘z",
    "Buloqboshi",
    "Izboskan",
    "Jalaquduq",
    "Marhamat",
    "Oltinko‘l",
    "Paxtaobod",
    "Qo‘rg‘ontepa",
    "Shahrixon",
    "Ulug‘nor",
    "Xo‘jaobod",
  ],
  Buxoro: [
    "Buxoro sh.",
    "Buxoro t.",
    "G‘ijduvon",
    "Jondor",
    "Kogon",
    "Olot",
    "Peshko‘",
    "Qorako‘l",
    "Qorovulbozor",
    "Romitan",
    "Shofirkon",
    "Vobkent",
  ],
  "Farg'ona": [
    "Farg‘ona sh.",
    "Beshariq",
    "Bog‘dod",
    "Buvayda",
    "Dang‘ara",
    "Farg‘ona t.",
    "Furqat",
    "Qo‘shtepa",
    "Quva",
    "Quvasoy",
    "Oltiariq",
    "Rishton",
    "So‘x",
    "Toshloq",
    "Uchko‘prik",
    "Yozyovon",
  ],
  Jizzax: [
    "Jizzax sh.",
    "Arnasoy",
    "Baxmal",
    "Do‘stlik",
    "Forish",
    "G‘allaorol",
    "Mirzacho‘l",
    "Paxtakor",
    "Yangiobod",
    "Zafarobod",
    "Zarbdor",
  ],
  Namangan: [
    "Namangan sh.",
    "Chortoq",
    "Chust",
    "Kosonsoy",
    "Mingbuloq",
    "Namangan t.",
    "Norin",
    "Pop",
    "To‘raqo‘rg‘on",
    "Uchqo‘rg‘on",
    "Yangiqo‘rg‘on",
  ],
  Navoiy: [
    "Navoiy sh.",
    "Konimex",
    "Karmana",
    "Qiziltepa",
    "Nurota",
    "Tomdi",
    "Uchquduq",
    "Xatirchi",
  ],
  Qashqadaryo: [
    "Qarshi sh.",
    "Dehqonobod",
    "G‘uzor",
    "Kasbi",
    "Kitob",
    "Koson",
    "Mirishkor",
    "Muborak",
    "Nishon",
    "Qamashi",
    "Qarshi t.",
    "Shahrisabz",
    "Yakkabog‘",
  ],
  "Qoraqalpog'iston": [
    "Nukus sh.",
    "Amudaryo",
    "Beruniy",
    "Chimboy",
    "Ellikqal‘a",
    "Kegeyli",
    "Mo‘ynoq",
    "Qanliko‘l",
    "Qonliko‘l",
    "Qo‘ng‘irot",
    "Shumanay",
    "Taxtako‘pir",
    "To‘rtko‘l",
    "Xo‘jayli",
  ],
  Samarqand: [
    "Samarqand sh.",
    "Bulung‘ur",
    "Ishtixon",
    "Jomboy",
    "Kattaqo‘rg‘on",
    "Narpay",
    "Nurobod",
    "Oqdaryo",
    "Pastdarg‘om",
    "Paxtachi",
    "Payariq",
    "Qo‘shrabot",
    "Samarqand t.",
    "Toyloq",
    "Urgut",
  ],
  Sirdaryo: [
    "Guliston sh.",
    "Boyovut",
    "Sardoba",
    "Sayxunobod",
    "Sirdaryo t.",
    "Xovos",
    "Mirzaobod",
    "Oqoltin",
  ],
  Surxondaryo: [
    "Termiz sh.",
    "Angor",
    "Boysun",
    "Denov",
    "Jarqo‘rg‘on",
    "Muzrabot",
    "Oltinsoy",
    "Qiziriq",
    "Qumqo‘rg‘on",
    "Sariosiyo",
    "Sherobod",
    "Shurchi",
    "Termiz t.",
    "Uzun",
  ],
  Xorazm: [
    "Urganch sh.",
    "Bog‘ot",
    "Gurlan",
    "Hazorasp",
    "Hiva",
    "Xonqa",
    "Qo‘shko‘pir",
    "Shovot",
    "Urganch t.",
    "Yangiariq",
    "Yangibozor",
  ],
};

const provinces = Object.keys(UZ_REGIONS);

const TeacherRegister = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
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

    if (parseInt(formData.age) < 18 || parseInt(formData.age) > 100) {
      setError("Yosh 18 dan 100 gacha bo'lishi kerak");
      setIsLoading(false);
      return;
    }

    // Validate school name format (e.g., "45-maktab")
    const schoolNamePattern = /^\d+-/;
    if (!schoolNamePattern.test(formData.schoolName.trim())) {
      setError(
        'Maktab nomi raqam bilan boshlanishi kerak (masalan: "45-maktab")'
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

      const result = await registerAction(formDataObj);

      if (result?.error) {
        setError(result.error);
      } else {
        toast.success("Tizimga muvaffaqiyatli kirdingiz!");
        router.push("/");
      }
    } catch (err) {
      setError("Ro'yhatdan o'tishda xatolik yuz berdi. Qayta urinib ko'ring.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // When province changes, clear district to force re-select
      ...(field === "province" ? { district: "" } : {}),
    }));
  };

  // Memoized list of districts based on selected province
  const districts = useMemo(() => {
    return formData.province ? UZ_REGIONS[formData.province] ?? [] : [];
  }, [formData.province]);

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
              O‘qituvchi Kabineti
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Ta’lim materiallariga kirish va o‘quvchilaringiz natijalarini
              kuzatish uchun ro‘yxatdan o‘ting.
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
                  {/* Full Name */}
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
                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age">Yosh</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Yoshingizni kiriting..."
                      value={formData.age}
                      onChange={(e) => handleChange("age", e.target.value)}
                      min={18}
                      max={100}
                      className="h-11"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {/* Province */}
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
                        {provinces.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* District */}
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
                        {districts.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* School Name */}
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
                      placeholder="maktab nomini kiriting...(45-maktab)"
                      value={formData.schoolName}
                      onChange={(e) =>
                        handleChange("schoolName", e.target.value)
                      }
                      className="h-11"
                      required
                      disabled={isLoading}
                    />
                  </div>
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
                    variant={"hero"}
                    type="submit"
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

export default TeacherRegister;
