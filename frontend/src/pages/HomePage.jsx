import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonial";
import Footer from "../components/Footer";

function HomePage(){
    return (
        <div className="min-h-screen">
        <Header />
        <main>
            <Hero />
            <Features />
            <Testimonials />
        </main>
        <Footer />
        </div>
  );
}
export default HomePage;