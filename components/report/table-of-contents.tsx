"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface TOCItem {
  id: string;
  title: string;
  number: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
  return (
    <nav className={cn("my-12", className)}>
      <h3 className="mb-6 text-sm font-mono uppercase tracking-wider text-muted-foreground">
        Contents
      </h3>
      <ul className="grid gap-2 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="group flex items-center gap-3 border-2 border-foreground p-4 transition-colors hover:bg-foreground hover:text-background cursor-pointer"
            >
              <span className="font-mono text-sm text-muted-foreground group-hover:text-background/70">
                {item.number}
              </span>
              <span className="flex-1 font-medium">{item.title}</span>
              <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
