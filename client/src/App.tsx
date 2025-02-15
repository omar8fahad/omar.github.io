
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ThemeToggle from "@/components/layout/ThemeToggle";
import ColorCustomizer from "@/components/layout/ColorCustomizer";
import React from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background">
          <div className="fixed top-4 right-4 flex gap-2">
            <ColorCustomizer />
            <ThemeToggle />
          </div>
          <Router />
          <Toaster />
        </div>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
