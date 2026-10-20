import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contacts";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Reviews />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
