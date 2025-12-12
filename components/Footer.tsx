import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container max-w-340 mx-auto px-4 sm:px-6 lg:px-0 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div>
              <Image
                className="rounded-full"
                alt="PIRLS EDU"
                src={"/images/logo.png"}
                width={50}
                height={50}
              />
            </div>
            <span className="text-lg font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              PIRLS EDU
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>
              Maqsadimiz-o‘quvchilarni o‘qish jarayonini rivojlantirish
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Biz haqimizda
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Aloqa
            </Link>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PIRLS EDU. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
