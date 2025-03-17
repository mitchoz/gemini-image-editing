
import ImageGenerator from "@/components/ImageGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-apple-gray">
      <header className="py-6 px-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <h2 className="text-xl font-medium">Image Magic</h2>
          <nav>
            <ul className="flex items-center gap-8">
              <li>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Get API Key
                </a>
              </li>
              <li>
                <a 
                  href="https://ai.google.dev/gemini/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Gemini API
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="pb-20">
        <ImageGenerator />
      </main>
      
      <footer className="py-8 px-4 border-t border-border/40 bg-apple-gray">
        <div className="max-w-screen-xl mx-auto text-center text-sm text-muted-foreground">
          <p>Built with Google Gemini API • Images are processed in your browser</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
