import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FullPassage } from "@/types";

interface PassageCardProps {
  passage: FullPassage;
}

const PassageCard = ({ passage }: PassageCardProps) => {
  const difficultyLevels = {
    GRADE_3: "bg-accent/10 text-accent border-accent/20",
    GRADE_4: "bg-secondary/10 text-secondary border-secondary/20",
  };

  return (
    <div className="group bg-card rounded-xl border border-border p-6 transition-all hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-linear-to-br from-primary/10 to-accent/10 p-3">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <Badge variant="outline" className={difficultyLevels[passage.grade]}>
            {passage.grade === "GRADE_3"
              ? "3-sinf"
              : passage.grade === "GRADE_4"
              ? "4-sinf"
              : ""}
          </Badge>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
        {passage.title}
      </h3>

      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {passage.content}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {passage.questions.length} savol
        </span>
        <Link href={`/passages/${passage.id}`}>
          <Button variant="ghost" size="sm">
            O&apos;qish
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PassageCard;
