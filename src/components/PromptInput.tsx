
import React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  className?: string;
}

const PromptInput = ({ prompt, setPrompt, className }: PromptInputProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-medium">Prompt</p>
      </div>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe how you want to transform this image..."
        className="min-h-[100px] text-sm resize-none"
      />
      <p className="text-xs text-muted-foreground">
        Be specific with details like style, mood, lighting, and elements you want to change.
      </p>
    </div>
  );
};

export default PromptInput;
