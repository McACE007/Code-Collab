import { ResolvedTheme, Theme } from "@/types";

const themeMapper = (theme: Theme, resolvedTheme: ResolvedTheme): string => {
  switch (theme) {
    case "light":
      return "vs-light";
    case "dark":
      return "vs-dark";
    case "system":
      return resolvedTheme === "light" ? "vs-light" : "vs-dark";
    default:
      return resolvedTheme === "light" ? "vs-light" : "vs-dark";
  }
};

export default themeMapper;
