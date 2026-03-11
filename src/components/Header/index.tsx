import { CalendarIcon } from "lucide-react";

type HeaderProps = {
  title: string;
  description?: string;
};

export const Header = ({ title, description }: HeaderProps) => (
  <div className="py-8">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-md bg-primary w-fit">
        <CalendarIcon className="w-7 h-7 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  </div>
);
