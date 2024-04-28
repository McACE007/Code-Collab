export function runCommandMapper(language: string) {
  switch (language) {
    case "nodejs":
      return "node index.js\n"

    case "c":
      return "gcc -o main main.c && ./main\n"

    case "cpp":
      return "gcc -o main main.cpp && ./main\n"

    case "python":
      return "python main.py\n"

    case "react":
      return "npm run dev\n"

    default:
      return "";
  }
}
