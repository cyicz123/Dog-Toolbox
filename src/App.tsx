import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
