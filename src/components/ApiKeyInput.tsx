
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Key } from "lucide-react";

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  className?: string;
}

const ApiKeyInput = ({ apiKey, setApiKey, className }: ApiKeyInputProps) => {
  const [showApiKey, setShowApiKey] = useState(false);

  const toggleShowApiKey = () => setShowApiKey(!showApiKey);
  
  const handleSave = () => {
    if (apiKey) {
      localStorage.setItem("gemini-api-key", apiKey);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Key className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-medium">API Key</p>
      </div>
      
      <div className="relative flex items-center">
        <Input
          type={showApiKey ? "text" : "password"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key"
          className="pr-20 font-mono text-sm"
        />
        <div className="absolute right-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={toggleShowApiKey}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleSave}
            className="h-8 text-xs"
          >
            Save
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Get your API key from the{" "}
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-apple-blue hover:underline"
        >
          Google AI Studio
        </a>
      </p>
    </div>
  );
};

export default ApiKeyInput;
