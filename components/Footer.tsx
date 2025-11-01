import { BookOpen, Heart } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container max-w-340 mx-auto px-4 sm:px-6 lg:px-0 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-linear-to-br from-primary to-accent p-2">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              PIRLS EDU
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-destructive fill-destructive" />
            <span>for students worldwide</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
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
          © {new Date().getFullYear()} PIRLS EDU. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
