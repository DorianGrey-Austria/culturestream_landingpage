"use client";

import { useEffect, useState } from "react";
import { Globe2, Users, Video, Palette, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import dynamic from 'next/dynamic';

// Dynamischer Import der 3D-Komponenten, die nur clientseitig geladen werden
const Portal = dynamic(() => import('./components/3d/Portal').then(mod => mod.Portal), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center">Lade Portal...</div>
});

const Globe = dynamic(() => import('./components/3d/Globe').then(mod => mod.Globe), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center">Lade Globus...</div>
});

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollY, setScrollY] = useState(0);
  const [activeTeamMember, setActiveTeamMember] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    
    // Nur im Browser ausführen
    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", handleScroll);

      // Verbesserte Intersection Observer Konfiguration
      const observer = new IntersectionObserver(
        (entries) => {
          // Finde die Sektion mit der höchsten Sichtbarkeit
          let maxVisibility = 0;
          let mostVisibleSection = null;

          entries.forEach((entry) => {
            const visiblePx = entry.intersectionRect.height;
            const ratio = visiblePx / window.innerHeight;
            
            if (ratio > maxVisibility) {
              maxVisibility = ratio;
              mostVisibleSection = entry.target.id;
            }
          });

          if (mostVisibleSection) {
            setActiveSection(mostVisibleSection);
          }
        },
        {
          root: null,
          threshold: Array.from({ length: 100 }, (_, i) => i / 100), // Erstelle 100 Schwellenwerte für präzisere Erkennung
          rootMargin: "0px"
        }
      );

      // Beobachte alle Sektionen
      const sections = ["hero", "weltkarte", "vision", "features", "team", "contact", "verein", "zitate"];
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) observer.observe(element);
      });

      // Cleanup
      return () => {
        window.removeEventListener("scroll", handleScroll);
        observer.disconnect();
      };
    }
    
    // Dummy-Cleanup-Funktion für SSR
    return () => {};
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const slideIn = {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <main className="relative min-h-screen">
      <ThemeToggle />
      {/* Navigation Dots */}
      <motion.nav 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed right-8 top-1/2 -translate-y-1/2 z-50"
      >
        <ul className="flex flex-col gap-6">
          {["hero", "weltkarte", "vision", "features", "team", "contact", "verein", "zitate"].map((section) => (
            <li key={section}>
              <button
                onClick={() => scrollToSection(section)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  activeSection === section
                    ? "bg-primary scale-150"
                    : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                )}
                aria-label={`Scroll to ${section} section`}
              >
                <span className="sr-only">
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        id="hero"
        className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-background to-accent"
      >
        {/* Background Video */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-20"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
            preload="auto"
            poster="/images/hero-poster.jpg"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Logo Animation Background */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-0 transition-opacity duration-500 group-hover:opacity-10">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-contain rounded-[2rem]"
          >
            <source src="/videos/Logo Animation.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Logo and Title Container */}
          <div className="flex justify-center items-center gap-8 mb-8">
            {/* Logo Container with Hover Effect */}
            <div className="group relative inline-block">
              {/* Logo Animation on Hover */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[66px] h-[66px] opacity-0 group-hover:opacity-100 transition-all duration-700">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-contain rotate-90"
                >
                  <source src="/videos/Logo Animation.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Main Logo */}
              <div 
                onClick={() => scrollToSection('verein')}
                className="relative w-16 h-16 transform-gpu transition-all duration-500 cursor-pointer z-10 group-hover:opacity-0"
                style={{ transformOrigin: 'center center' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-secondary/3 blur-lg animate-pulse rounded-xl" />
                <img
                  src="/images/Logo.jpg"
                  alt="CultureStream Logo"
                  className="relative w-full h-full object-contain drop-shadow-xl opacity-75 transition-all duration-500 group-hover:opacity-0 rounded-xl"
                />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              CultureStream
            </h1>
          </div>

          <p className="text-2xl md:text-3xl mb-8 text-foreground/80">
            Das Fenster zur Welt!!
          </p>
          <button 
            onClick={() => scrollToSection('vision')}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-all duration-300"
          >
            Entdecken Sie mehr
          </button>
        </div>
      </motion.section>

      {/* Weltkarte Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-20%" }}
        variants={staggerChildren}
        id="weltkarte"
        className="min-h-screen py-20 bg-background relative"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Globales Netzwerk
          </motion.h2>

          {/* 3D Globe */}
          <motion.div
            variants={fadeInUp}
            className="w-full h-[600px] mb-16 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
            <div className="w-full h-full relative">
              <Globe />
            </div>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Unsere Vision einer vernetzten Welt: Verbinden Sie sich mit Künstler:innen, Kulturschaffenden und Interessierten aus der ganzen Welt durch unsere innovativen Live-Stream-Portale.
          </motion.p>
        </div>
      </motion.section>

      {/* Vision Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-20%" }}
        variants={staggerChildren}
        id="vision"
        className="min-h-screen py-20 bg-accent relative"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Unsere Vision
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              {
                icon: Globe2,
                title: "Globale Vernetzung",
                description: "Verbinden Sie sich mit Menschen weltweit durch innovative Live-Stream-Portale. Unsere Technologie ermöglicht es Ihnen, Grenzen zu überwinden und authentische Verbindungen in Echtzeit aufzubauen. Durch hochmoderne Streaming-Lösungen schaffen wir einen Raum für bedeutungsvolle internationale Begegnungen und Kollaborationen.",
              },
              {
                icon: Users,
                title: "Kultureller Austausch",
                description: "Fördern Sie interkulturellen Dialog und Verständigung in Echtzeit. Tauchen Sie ein in lebendige Diskussionen und entdecken Sie die vielfältigen Perspektiven verschiedener Kulturen auf unserer Plattform. Unser Ziel ist es, kulturelle Barrieren abzubauen und ein tieferes Verständnis zwischen Menschen unterschiedlicher Hintergründe zu schaffen.",
              },
              {
                icon: Palette,
                title: "Kreative Innovation",
                description: "Erleben Sie Kunst und Kultur in einer völlig neuen digitalen Dimension. Unsere Plattform bietet innovative Werkzeuge und Räume, die es Künstler:innen und Kulturschaffenden ermöglichen, ihre Kreativität grenzenlos zu entfalten und mit einem globalen Publikum zu teilen. Wir verbinden traditionelle künstlerische Ausdrucksformen mit modernster Technologie, um einzigartige digitale Kunsterlebnisse zu schaffen.",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative p-8 rounded-3xl bg-white shadow-sm border border-border/40
                  transition-all duration-500 hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800"
              >
                <div className="relative z-10">
                  <div className="relative w-20 h-20 mx-auto mb-8">
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-2xl transform rotate-6 transition-transform duration-500 group-hover:rotate-12" />
                    <div className="relative flex items-center justify-center h-full">
                      <card.icon className="w-10 h-10 text-primary transition-transform duration-500 group-hover:scale-110 dark:text-primary/80" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-6 text-center dark:text-white">
                    {card.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300 text-justify leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-20%" }}
        variants={staggerChildren}
        id="features"
        className="min-h-screen py-20 bg-accent"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Features
          </motion.h2>
          <div className="space-y-20">
            {[
              {
                title: "Live-Streaming Technologie",
                description: "In unserem kleinen Studio haben wir eine besondere Art der Live-Übertragung entwickelt. Sie ermöglicht es, dass sich Menschen trotz der Entfernung ganz nah fühlen können - als säßen sie gemeinsam in einem Raum. Die Bildqualität ist dabei so klar und die Übertragung so direkt, dass man manchmal fast vergisst, dass der Gesprächspartner eigentlich hunderte Kilometer entfernt ist. Das schafft eine Vertrautheit, die wir bei digitalen Begegnungen sonst oft vermissen.",
                image: "/images/feature-1.jpg",
              },
              {
                title: "KI-gestützte Übersetzung",
                description: "Die Sprache sollte nie ein Hindernis sein, wenn Menschen sich austauschen möchten. Deshalb nutzen wir einen cleveren digitalen Übersetzer, der im Hintergrund still und leise arbeitet. Er hilft dabei, dass sich zum Beispiel eine Künstler:in aus Graz ganz entspannt mit einem Kunstinteressierten aus Lublijana unterhalten kann - jeder in seiner eigenen Sprache, aber mit gegenseitigem Verständnis. Das öffnet Türen für wunderbare neue Begegnungen und Gespräche über Alltag, Kunst & Kultur, die sonst nie stattgefunden hätten.",
                image: "/images/feature-2.jpg",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-12 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-border/40 dark:bg-gray-800",
                  index % 2 === 1 && "md:flex-row-reverse"
                )}
              >
                <div className="flex-1 space-y-6">
                  <h3 className="text-3xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-justify">
                    {feature.description}
                  </p>
                </div>
                <div className="flex-1">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3]"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-20%" }}
        variants={staggerChildren}
        id="team"
        className="min-h-screen py-20 bg-background"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Unser Team
          </motion.h2>
          
          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {[
              {
                name: "Max",
                role: "Gründer & CEO",
                image: "/images/max.png",
                description: "Als ehemaliger Vermessungstechniker und DJ hatte Max schon immer ein Händchen für technische Präzision und kulturelle Verbindungen. Die Idee zu CultureStream entstand 2019 aus seinem Wunsch, Kunst und Technologie auf eine neue Art zu verbinden. Heute leitet er als Obmann unseren Kulturverein und bringt dabei seine vielfältigen Erfahrungen aus der Event-Szene und der technischen Welt zusammen.",
              },
              {
                name: "Dorian",
                role: "Mitbegründer & Marketing",
                image: "/images/dorian.png",
                description: "Mit seiner Erfahrung in der Organisation großer Events wie dem Peal Festival bringt Dorian nicht nur Marketing-Expertise mit, sondern auch ein tiefes Verständnis für die Kunstszene. Als begeisterter Webdesigner und KI-Enthusiast verbindet er kreatives Design mit technologischer Innovation. Seine Leidenschaft für digitale Trends und kulturelle Veranstaltungen macht ihn zu unserem Brückenbauer zwischen Kunst und Technologie.",
              },
              {
                name: "Martha",
                role: "Design",
                image: "/images/marta.png",
                description: "Martha vereint ihr Studium an der FH mit ihrer Tätigkeit als selbstständige Designerin und Videokünstlerin. Mit ihrem weitverzweigten Netzwerk in der Kunstszene und ihrem Gespür für zeitgemäßes Design bringt sie frische Perspektiven in unser Team. Ihre kreativen Visionen und ihr Talent für visuelles Storytelling prägen maßgeblich die Ästhetik unserer Projekte.",
              },
              {
                name: "Leo",
                role: "Creative Director",
                image: "/images/leo.png",
                description: "Als Bildhauer und kreativer Kopf hinter unseren Portal-Designs verbindet Leo handwerkliches Können mit künstlerischer Vision. Seine Erfahrung in der Art- und Eventbranche und seine zahlreichen kreativen Hobbys machen ihn zu einem wahren Multitalent. Er versteht es, physische und digitale Räume so zu gestalten, dass sie Menschen zusammenbringen und inspirieren.",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative"
                onMouseEnter={() => setActiveTeamMember(member.name)}
              >
                <div className="overflow-hidden rounded-2xl relative">
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 dark:group-hover:bg-yellow-400/20 transition-all duration-300 z-10" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="text-white text-2xl font-semibold">
                        {member.name}
                      </h3>
                      <p className="text-white/80">{member.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Centered Description Box */}
          <motion.div 
            variants={fadeInUp}
            className="w-full"
          >
            {[
              {
                name: "Max",
                description: "Als ehemaliger Vermessungstechniker und DJ hatte Max schon immer ein Händchen für technische Präzision und kulturelle Verbindungen. Die Idee zu CultureStream entstand 2019 aus seinem Wunsch, Kunst und Technologie auf eine neue Art zu verbinden. Heute leitet er als Obmann unseren Kulturverein und bringt dabei seine vielfältigen Erfahrungen aus der Event-Szene und der technischen Welt zusammen.",
              },
              {
                name: "Dorian",
                description: "Mit seiner Erfahrung in der Organisation großer Events wie dem Peal Festival bringt Dorian nicht nur Marketing-Expertise mit, sondern auch ein tiefes Verständnis für die Kunstszene. Als begeisterter Webdesigner und KI-Enthusiast verbindet er kreatives Design mit technologischer Innovation. Seine Leidenschaft für digitale Trends und kulturelle Veranstaltungen macht ihn zu unserem Brückenbauer zwischen Kunst und Technologie.",
              },
              {
                name: "Martha",
                description: "Martha vereint ihr Studium an der FH mit ihrer Tätigkeit als selbstständige Designerin und Videokünstlerin. Mit ihrem weitverzweigten Netzwerk in der Kunstszene und ihrem Gespür für zeitgemäßes Design bringt sie frische Perspektiven in unser Team. Ihre kreativen Visionen und ihr Talent für visuelles Storytelling prägen maßgeblich die Ästhetik unserer Projekte.",
              },
              {
                name: "Leo",
                description: "Als Bildhauer und kreativer Kopf hinter unseren Portal-Designs verbindet Leo handwerkliches Können mit künstlerischer Vision. Seine Erfahrung in der Art- und Eventbranche und seine zahlreichen kreativen Hobbys machen ihn zu einem wahren Multitalent. Er versteht es, physische und digitale Räume so zu gestalten, dass sie Menschen zusammenbringen und inspirieren.",
              },
            ].map((member) => (
              <div
                key={member.name}
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-border/40",
                  activeTeamMember === member.name ? "block" : "hidden"
                )}
              >
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed text-justify">
                  {member.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-20%" }}
        variants={staggerChildren}
        id="contact"
        className="min-h-screen py-20 bg-accent"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Kontakt
          </motion.h2>
          <div className="max-w-2xl mx-auto">
            <form 
              className="space-y-6" 
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                
                try {
                  console.log('Teste Supabase-Verbindung...');
                  
                  const { data, error } = await supabase
                    .from('contact_messages')
                    .insert([
                      {
                        name: formData.get('name'),
                        email: formData.get('email'),
                        message: formData.get('message'),
                      },
                    ])
                    .select();

                  if (error) {
                    console.error('Supabase Error:', error);
                    throw error;
                  }

                  form.reset();
                  toast.success('Nachricht gesendet!', {
                    description: 'Vielen Dank für Ihre Nachricht. Wir werden uns bald bei Ihnen melden.',
                    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
                    duration: 5000,
                    className: 'bg-background border border-border',
                  });
                } catch (error: any) {
                  console.error('Detailed error:', error);
                  
                  let errorMessage = 'Es gab einen Fehler beim Senden der Nachricht. ';
                  
                  if (error?.code === 'PGRST301' || error?.code === '42P01') {
                    errorMessage += 'Die Datenbanktabelle wurde nicht gefunden. Bitte kontaktieren Sie den Administrator.';
                  } else if (error?.message?.includes('Failed to fetch')) {
                    errorMessage += 'Verbindung zu Supabase konnte nicht hergestellt werden. Bitte überprüfen Sie Ihre Internetverbindung.';
                  } else {
                    errorMessage += error?.message || 'Bitte versuchen Sie es später erneut.';
                  }
                  
                  toast.error('Fehler beim Senden', {
                    description: errorMessage,
                    icon: <XCircle className="h-5 w-5 text-red-500" />,
                    duration: 5000,
                    className: 'bg-background border border-border',
                  });
                }
              }}
            >
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                  placeholder="Ihr Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                  placeholder="ihre@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nachricht</label>
                <textarea
                  name="message"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background min-h-[150px]"
                  placeholder="Ihre Nachricht"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Senden
              </button>

              {/* WhatsApp Button */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4">Oder kontaktieren Sie uns direkt über WhatsApp:</p>
                <a
                  href="https://wa.me/436504251513"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.373 12-12 0-6.627-5.372-12-12-12zm6.016 16.31c-.235.717-.694 1.337-1.313 1.804-1.023.772-2.287 1.154-3.587 1.082-.991-.056-1.971-.24-2.912-.57-2.253-.793-4.192-2.097-5.742-3.85-1.351-1.527-2.145-3.385-2.317-5.363-.114-1.309.267-2.61 1.069-3.647.188-.242.398-.465.627-.666l.673-.607c.237-.214.487-.414.748-.598.247-.175.502-.338.768-.484.17-.093.327-.203.495-.304.241-.146.513-.147.754-.001.326.197.651.396.977.595.327.199.652.402.979.601.293.179.426.507.326.823-.082.26-.173.517-.264.774l-.156.456c-.072.211-.152.417-.223.628-.071.211-.133.424-.204.636-.137.41-.542.593-.937.436-.158-.063-.312-.138-.466-.211-.154-.073-.31-.142-.464-.215-.154-.073-.308-.147-.462-.221-.138-.066-.321-.037-.392.098-.116.219-.239.434-.359.65-.12.217-.237.435-.356.652-.142.26-.057.554.203.693.488.26.982.506 1.482.737.131.061.272.101.415.127.478.088.967.098 1.439-.022.569-.145 1.117-.335 1.644-.579.186-.086.375-.167.534-.304.162-.141.296-.312.396-.502.114-.217.242-.425.371-.633.13-.208.26-.417.39-.625.139-.223.414-.314.658-.212.233.098.466.196.699.294.233.098.466.197.699.295.239.101.424.304.463.557.067.433.097.873.086 1.312-.02.836-.217 1.65-.609 2.387z"/>
                  </svg>
                  Via WhatsApp kontaktieren
                </a>
              </div>
            </form>
          </div>
        </div>
      </motion.section>

      {/* Verein Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-20%" }}
        variants={staggerChildren}
        id="verein"
        className="min-h-screen py-20 bg-background"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-primary"
          >
            Über den Verein
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Mission & Vision */}
            <motion.div variants={fadeInUp} className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-3xl font-semibold text-blue-400">Mission</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                  Unsere Mission ist es, durch den Aufbau eines globalen Netzwerks an Portalen dauerhafte kulturelle Brücken und neue Formen der sozialen Interaktion zu schaffen. Durch laufende Adaptionen und Implementierungen neuer Technologien (KI, Speech to Text, immersive Spiele usw.), bilden wir nachhaltig eine länderübergreifende Spielwiese und binden Hochschulen und die Crowdsourcing-Gemeinschaft aktiv in die Mitgestaltung ein.
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-3xl font-semibold text-blue-400">Vision</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                  Unsere Vision ist eine besser vernetzte Welt, in der Menschen verschiedenster Kulturen und Hintergründe auf spielerische Weise miteinander interagieren. Es sollen fixe Orte des Austausches, der Inspiration und des Lernens entstehen, die ein tieferes Verständnis von Kunst und kultureller Vielfalt fördern und prägen.
                </p>
              </div>
            </motion.div>

            {/* Vereinszweck */}
            <motion.div variants={fadeInUp} className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-3xl font-semibold text-blue-400">Vereinszweck</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                  Der Zweck des Vereins "CultureStream" ist die Förderung und Unterstützung des internationalen Dialogs und kulturellen Austauschs, die Verbreitung von lokaler Kunst und Kultur durch innovative digitale Plattformen und die Schaffung eines umfassenden Bewusstseins für die Vielfalt europäischer Werte und Kulturen.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                  Über die Schaffung einer globalen Portalinfrastruktur soll eine Plattform geschaffen werden, die nicht nur von einer breiten Bevölkerungsschicht genutzt werden soll, sondern auch die Möglichkeit bietet, Beiträge verschiedenster kultureller Couleur auf einfache Weise einer internationalen Community zugänglich zu machen.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Zitate Section */}
      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-20%" }}
        variants={staggerChildren}
        id="zitate"
        className="min-h-screen py-20 bg-accent"
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Zitate
            <span className="block text-2xl md:text-3xl mt-4 text-gray-600 dark:text-gray-400">
              - die unser Projekt inspirierten -
            </span>
          </motion.h2>
          
          <motion.div 
            variants={fadeInUp} 
            className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <blockquote className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-border/40">
              <p className="text-xl italic text-gray-600 dark:text-gray-300 mb-4">
                "Kreativität ist, verschiedene Dinge zu sehen und zu denken, wo andere eine Gerade sehen."
              </p>
              <footer className="text-right text-gray-500 dark:text-gray-400">- Ai Weiwei</footer>
            </blockquote>

            <blockquote className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-border/40">
              <p className="text-xl italic text-gray-600 dark:text-gray-300 mb-4">
                "Der wahre Entdecker ist nicht derjenige, der neue Länder findet, sondern der, der neue Augen hat."
              </p>
              <footer className="text-right text-gray-500 dark:text-gray-400">- Marcel Proust</footer>
            </blockquote>

            <blockquote className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-border/40">
              <p className="text-xl italic text-gray-600 dark:text-gray-300 mb-4">
                "Ohne Kultur bleibt der Mensch ein Fremder für sich selbst."
              </p>
              <footer className="text-right text-gray-500 dark:text-gray-400">- François Mitterrand</footer>
            </blockquote>

            <blockquote className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-border/40">
              <p className="text-xl italic text-gray-600 dark:text-gray-300 mb-4">
                "The more we share, the more we have."
              </p>
              <footer className="text-right text-gray-500 dark:text-gray-400">- Leonard Nimoy</footer>
            </blockquote>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}