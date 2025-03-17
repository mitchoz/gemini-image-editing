
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Download, Loader, SparklesIcon } from "lucide-react";
import ApiKeyInput from "@/components/ApiKeyInput";
import ImageUploader from "@/components/ImageUploader";
import PromptInput from "@/components/PromptInput";

const ImageGenerator = () => {
  const [apiKey, setApiKey] = useState("");
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Load API key from localStorage
    const savedApiKey = localStorage.getItem("gemini-api-key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleGenerate = async () => {
    if (!apiKey) {
      toast.error("Please enter your Gemini API key");
      return;
    }

    if (!sourceImage) {
      toast.error("Please upload an image");
      return;
    }

    if (!prompt) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      // Extract base64 data from data URL
      const base64Data = sourceImage.split(",")[1];

      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=" + apiKey, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Data
                  }
                }
              ]
            }
          ],
          generationConfig: {
            responseModalities: ["Text", "Image"]
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to generate image");
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content;
      const parts = content?.parts || [];
      const imagePart = parts.find(p => p.inlineData);
      const imageData = imagePart?.inlineData?.data;

      if (imageData) {
        setGeneratedImage(`data:image/png;base64,${imageData}`);
        toast.success("Image successfully generated!");
      } else {
        throw new Error("No image in the response");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `gemini-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8 md:py-12 lg:py-16 space-y-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm bg-apple-blue/10 text-apple-blue rounded-full font-medium animate-fade-in">
          <SparklesIcon className="h-4 w-4 mr-2" />
          <span>Powered by Google Gemini</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight animate-fade-up">
          Transform Images with AI
        </h1>
        <p className="text-muted-foreground text-balance animate-fade-up delay-100">
          Upload an image, describe how you want to transform it, and watch Gemini work its magic
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="border border-border/40 bg-card/50 backdrop-blur-xs overflow-hidden animate-scale-in">
          <CardContent className="p-6">
            <div className="space-y-6">
              <ApiKeyInput 
                apiKey={apiKey} 
                setApiKey={setApiKey} 
              />
              
              <Separator />
              
              <ImageUploader
                image={sourceImage}
                setImage={setSourceImage}
              />
              
              <PromptInput
                prompt={prompt}
                setPrompt={setPrompt}
              />
              
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !apiKey || !sourceImage || !prompt}
                className="w-full bg-apple-blue hover:bg-apple-blue/90 text-white py-6"
              >
                {isGenerating ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="mr-2 h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 bg-card/50 backdrop-blur-xs h-full animate-scale-in delay-100">
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Generated Image</h3>
              {generatedImage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="text-xs"
                >
                  <Download className="mr-2 h-3 w-3" />
                  Download
                </Button>
              )}
            </div>
            
            <div className="flex-1 bg-black/5 rounded-xl flex items-center justify-center overflow-hidden">
              {isGenerating ? (
                <div className="text-center p-10">
                  <Loader className="h-8 w-8 mx-auto mb-4 animate-spin text-muted-foreground" />
                  <p className="text-muted-foreground">Generating your image...</p>
                </div>
              ) : generatedImage ? (
                <div className="relative w-full h-full">
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-auto object-contain animate-fade-in"
                  />
                </div>
              ) : (
                <div className="text-center p-10">
                  <SparklesIcon className="h-8 w-8 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">Your generated image will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageGenerator;
