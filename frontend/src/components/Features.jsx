// import voiceImg from '../media/voiceImg'

function Features () {
  return (
    <section id="features" className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything you need for{" "}
            <span className="gradient-text">smarter meetings</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Our AI understands your meetings better than you do. Get insights, 
            summaries, and action items without lifting a finger.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="feature-card group animate-fade-in">
            <div className="relative mb-6">
              <img 
                src="../media/voiceImg.webp" 
                alt="Smart Transcription"
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="absolute -top-2 -right-2 p-2 bg-gradient-ai rounded-lg">
                <div className="h-4 w-4 text-white">🎤</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:gradient-text transition-smooth">
              Smart Transcription
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              AI-powered transcription that understands context, speakers, and technical terms with 99.8% accuracy.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card group animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="relative mb-6">
              <img 
                src="/summary-icon.jpg" 
                alt="Intelligent Summarization"
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="absolute -top-2 -right-2 p-2 bg-gradient-ai rounded-lg">
                <div className="h-4 w-4 text-white">📝</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:gradient-text transition-smooth">
              Intelligent Summarization
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Get key insights, action items, and decisions extracted automatically from your meetings.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card group animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative mb-6">
              <img 
                src="/history-icon.jpg" 
                alt="Meeting History"
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="absolute -top-2 -right-2 p-2 bg-gradient-ai rounded-lg">
                <div className="h-4 w-4 text-white">⏰</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:gradient-text transition-smooth">
              Meeting History
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Search, organize, and revisit all your meeting transcripts and summaries in one central place.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card group animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative mb-6">
              <img 
                src="/summary-icon.jpg" 
                alt="Export Anywhere"
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="absolute -top-2 -right-2 p-2 bg-gradient-ai rounded-lg">
                <div className="h-4 w-4 text-white">⬇️</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 group-hover:gradient-text transition-smooth">
              Export Anywhere
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Export to PDF, Word, or integrate with your favorite tools like Notion, Slack, and more.
            </p>
          </div>
        </div>

        {/* Demo Process */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              See it in <span className="gradient-text">action</span>
            </h3>
            <p className="text-lg text-muted-foreground">
              Upload → AI Transcribes → Get Summary
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center animate-fade-in">
              <div className="glass-card p-8 mb-6 glow-hover">
                <div className="w-12 h-12 bg-gradient-ai rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <div className="h-12 w-12 text-ai-primary mx-auto">🎤</div>
              </div>
              <h4 className="text-lg font-semibold mb-2">Upload Meeting</h4>
              <p className="text-muted-foreground">
                Drag and drop your audio or video file
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="glass-card p-8 mb-6 glow-hover">
                <div className="w-12 h-12 bg-gradient-ai rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <div className="relative">
                  <div className="h-12 w-12 text-ai-secondary mx-auto">📝</div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-ai-neon rounded-full animate-pulse"></div>
                </div>
              </div>
              <h4 className="text-lg font-semibold mb-2">AI Processing</h4>
              <p className="text-muted-foreground">
                Our AI transcribes and analyzes your content
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="glass-card p-8 mb-6 glow-hover">
                <div className="w-12 h-12 bg-gradient-ai rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <div className="h-12 w-12 text-ai-accent mx-auto">📄</div>
              </div>
              <h4 className="text-lg font-semibold mb-2">Get Summary</h4>
              <p className="text-muted-foreground">
                Receive insights, action items, and key points
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
