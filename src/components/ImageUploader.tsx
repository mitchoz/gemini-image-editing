
import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageIcon, X, Upload } from "lucide-react";

interface ImageUploaderProps {
  image: string | null;
  setImage: (image: string | null) => void;
  className?: string;
}

const ImageUploader = ({ image, setImage, className }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleImageSelection(file);
    }
  };

  const handleImageSelection = (file: File) => {
    if (!file.type.match("image.*")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        setImage(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageSelection(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm font-medium">Source Image</p>
      </div>
      
      {!image ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out flex flex-col items-center justify-center gap-3",
            isDragging 
              ? "border-apple-blue bg-apple-blue/5" 
              : "border-border bg-secondary/50 hover:bg-secondary"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <Upload className="w-8 h-8 text-muted-foreground" />
          <div className="text-center">
            <p className="font-medium">Drag & drop an image here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden bg-black/5 animate-fade-in">
          <img 
            src={image} 
            alt="Uploaded" 
            className="w-full h-auto max-h-[300px] object-contain mx-auto"
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-xs hover:bg-background"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveImage();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
