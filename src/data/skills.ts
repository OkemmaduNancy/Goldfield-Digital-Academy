import {
  Bot,
  Clapperboard,
  FolderKanban,
  Palette,
  PenLine,
  Smartphone,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type Skill = {
  name: string;
  icon: LucideIcon;
  description: string;
};

export const skills: Skill[] = [
  {
    name: "Content Creation",
    icon: PenLine,
    description: "Create content that engages an audience.",
  },
  {
    name: "Digital Marketing",
    icon: TrendingUp,
    description: "Promote products and services online.",
  },
  {
    name: "Social Media Management",
    icon: Smartphone,
    description: "Grow and manage brand pages.",
  },
  {
    name: "Video Editing",
    icon: Clapperboard,
    description: "Turn raw footage into polished videos.",
  },
  {
    name: "Graphic Design",
    icon: Palette,
    description: "Design visuals that stand out.",
  },
  {
    name: "Virtual Assistance",
    icon: FolderKanban,
    description: "Support businesses remotely and stay organised.",
  },
  {
    name: "AI Creation and Automation",
    icon: Bot,
    description: "Use AI tools to create and automate work.",
  },
];
