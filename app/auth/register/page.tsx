"use client";

import { useState } from "react";
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

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    schoolName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.age || !formData.schoolName) {
      //   toast({
      //     title: "Missing Information",
      //     description: "Please fill in all fields",
      //     variant: "destructive",
      //   });
      return;
    }

    // Save to localStorage
    localStorage.setItem("pirlsUser", JSON.stringify(formData));

    // toast({
    //   title: "Registration Successful!",
    //   description: `Welcome, ${formData.fullName}! Let's start learning.`,
    // });

    // Navigate to passages page
    setTimeout(() => {
      router.push("/passages");
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-linear-to-r from-cyan-500 to-green-500">
        <Header />
      </div>

      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-md">
          <Card className="animate-fade-in-up shadow-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center mb-4">
                <UserPlus className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Join PIRLS EDU</CardTitle>
              <CardDescription>
                Create your account and start your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    className="bg-background"
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    className="bg-background"
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    max="100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    className="bg-background"
                    id="schoolName"
                    name="schoolName"
                    placeholder="Enter your school name"
                    value={formData.schoolName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
                  size="lg"
                >
                  Start Learning
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
