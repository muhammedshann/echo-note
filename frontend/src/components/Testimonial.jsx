const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechFlow",
      content:
        "EchoNote has revolutionized how we handle our sprint planning meetings. The AI summaries are incredibly accurate and save us hours of manual note-taking.",
      rating: 5,
      avatar: "SC",
    },
    {
      name: "Marcus Rodriguez",
      role: "VP Engineering",
      company: "DataSync",
      content:
        "The transcription quality is phenomenal. Even with technical discussions and multiple speakers, EchoNote captures everything with perfect accuracy.",
      rating: 5,
      avatar: "MR",
    },
    {
      name: "Emily Watson",
      role: "Sales Director",
      company: "GrowthLab",
      content:
        "Client calls are now so much more productive. I can focus on the conversation knowing EchoNote will capture every detail for follow-up actions.",
      rating: 5,
      avatar: "EW",
    },
  ];

  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Loved by <span className="gradient-text">thousands</span> of teams
          </h2>
          <p className="text-xl text-muted-foreground">
            See what professionals are saying about EchoNote
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="feature-card p-8 animate-fade-in bg-white/5 rounded-2xl shadow-card"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Quote Icon */}
              <div className="mb-6 text-ai-primary text-2xl">❝</div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-ai rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="glass-card p-8 max-w-2xl mx-auto glow-hover rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">
              Ready to transform your meetings?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of professionals who trust EchoNote with their most
              important conversations
            </p>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex -space-x-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gradient-ai rounded-full border-2 border-background"
                  ></div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold gradient-text">50,000+</span> happy
                users
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
