"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import AnimatedLayout from "@/animations/AnimatedLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Star,
  MessageCircle,
  ThumbsUp,
  ChevronDown,
  Shield,
  ArrowRight,
  Menu,
  CheckCircle,
  Calendar,
  FileText,
  Users,
  LayoutDashboardIcon,
  Route,
  StarIcon,
  BadgeCheck,
  HammerIcon,
  BadgePlus,
  BadgeMinus,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa";
import WordPullUp from "@/components/ui/word-pull-up";
import BlurFade from "@/components/ui/blur-fade";
import TextReveal from "@/components/ui/text-reveal";
import TypingAnimation from "@/components/ui/typing-animation";

const slides = [
  {
    src: "/HomepageImages/dash-1.png?height=400&width=800&text=Slide1",
    alt: "Talk. workspace illustration 1",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    src: "/HomepageImages/customer-journey-1.png?height=400&width=800&text=Slide2",
    alt: "Talk. workspace illustration 2",
    label: "Customer Journey",
    icon: Route,
  },
  {
    src: "/HomepageImages/reviews-1.png?height=400&width=800&text=Slide3",
    alt: "Talk. workspace illustration 3",
    label: "Reviews",
    icon: StarIcon,
  },
  {
    src: "/HomepageImages/badges.png?height=400&width=800&text=Slide4",
    alt: "Talk. workspace illustration 4",
    label: "Badges",
    icon: BadgeCheck,
  },
];

const customerSlides = [
  {
    src: "/HomepageImages/customer-1.png?height=400&width=800&text=Slide1",
    alt: "Talk. workspace illustration 1",
    label: "Select",
    icon: BadgePlus,
  },
  {
    src: "/HomepageImages/customer-2.png?height=400&width=800&text=Slide2",
    alt: "Talk. workspace illustration 2",
    label: "Route",
    icon: Route,
  },
  {
    src: "/HomepageImages/customer-3.png?height=400&width=800&text=Slide3",
    alt: "Talk. workspace illustration 3",
    label: "Build",
    icon: HammerIcon,
  },
  {
    src: "/HomepageImages/customer-4.png?height=400&width=800&text=Slide4",
    alt: "Talk. workspace illustration 4",
    label: "Post",
    icon: FaGoogle,
  },
  {
    src: "/HomepageImages/customer-7.png?height=400&width=800&text=Slide4",
    alt: "Talk. workspace illustration 5",
    label: "Later",
    icon: Clock,
  },
  {
    src: "/HomepageImages/customer-5.png?height=400&width=800&text=Slide3",
    alt: "Talk. workspace illustration 6",
    label: "Detect",
    icon: BadgeMinus,
  },
  {
    src: "/HomepageImages/customer-6.png?height=400&width=800&text=Slide4",
    alt: "Talk. workspace illustration 7",
    label: "Shield",
    icon: Shield,
  },
];

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCustomerSlide, setCurrentCustomerSlide] = useState(0);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const router = useRouter();

  const onGetStarted = () => {
    router.push("/login");
  };

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("authToken")) {
      router.push("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCustomerSlide(
        (prevSlide) => (prevSlide + 1) % customerSlides.length
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const goToCustomerSlide = (index: number) => {
    setCurrentCustomerSlide(index);
  };

  return (
    <AnimatedLayout>
      <div className="flex flex-col min-h-screen bg-[#FFFFFF] text-gray-900">
        <header
          className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            isScrolled ? "bg-white shadow-sm" : "bg-transparent"
          }`}
        >
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link className="flex items-center justify-center" href="/">
              <span className="text-2xl font-bold text-gray-900">Talk.</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <DropdownMenu
                open={isFeaturesOpen}
                onOpenChange={setIsFeaturesOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-gray-600 transition-colors flex items-center"
                  >
                    Product
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        isFeaturesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="#" className="w-full">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="#" className="w-full">
                      Badges
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="#" className="w-full">
                      Customer Journies
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="#" className="w-full">
                      Reviews
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                className="text-sm font-medium hover:text-gray-600 transition-colors mt-2"
                href="/"
              >
                Pricing
              </Link>
            </nav>
            <Button
              variant="outline"
              className="hidden md:inline-flex"
              onClick={onGetStarted}
            >
              Get Started
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          {isMenuOpen && (
            <nav className="md:hidden bg-white p-4 shadow-md">
              <Link
                className="block py-2 text-sm font-medium hover:text-gray-600 transition-colors"
                href="#"
              >
                Features
              </Link>
              <Link
                className="block py-2 text-sm font-medium hover:text-gray-600 transition-colors"
                href="#"
              >
                Templates
              </Link>
              <Link
                className="block py-2 text-sm font-medium hover:text-gray-600 transition-colors"
                href="#"
              >
                Pricing
              </Link>
              <Link
                className="block py-2 text-sm font-medium hover:text-gray-600 transition-colors"
                href="#"
              >
                About
              </Link>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={onGetStarted}
              >
                Get Started
              </Button>
            </nav>
          )}
        </header>
        <main className="flex-1">
          <section className="container mx-auto px-4 py-24 md:py-32 lg:py-24">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <WordPullUp
                className="text-4xl font-bold tracking-[-0.02em] text-black dark:text-white md:text-7xl md:leading-[5rem]"
                words="Customer Feedback in seconds."
              />

              <TypingAnimation
                duration={25}
                className="text-xl max-w-2xl mx-auto"
                text="Routing experiences to their respective channels."
              />
              <div className="relative">
                <Image
                  src={customerSlides[currentCustomerSlide].src}
                  alt={customerSlides[currentCustomerSlide].alt}
                  width={800}
                  height={400}
                  layout="responsive" // Automatically scales images
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="flex justify-center space-x-4">
                {customerSlides.map((slide, index) => (
                  <Badge
                    key={index}
                    variant={
                      currentCustomerSlide === index ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => goToCustomerSlide(index)}
                  >
                    <slide.icon size={12} className="mr-2" />
                    {slide.label}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-center space-x-4">
                <Button variant="default" size="lg" onClick={onGetStarted}>
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    window.open(
                      "https://calendly.com/adnan-karim-Talk.-io/Talk.-demo",
                      "_blank"
                    )
                  }
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"></h1>
              <div className="text-4xl font-bold tracking-[-0.02em] text-black dark:text-white md:text-7xl md:leading-[5rem]">
                <TextReveal text="Customer interactions, captured instantly." />
              </div>
              <p className="text-xl max-w-2xl mx-auto">
                Quick. Engaging. Instant. Insights have never been this simple.
              </p>
              <div className="relative">
                <Image
                  src={slides[currentSlide].src}
                  alt={slides[currentSlide].alt}
                  width={800}
                  height={400}
                  layout="responsive" // Automatically scales images
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="flex justify-center space-x-4">
                {slides.map((slide, index) => (
                  <Badge
                    key={index}
                    variant={currentSlide === index ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => goToSlide(index)}
                  >
                    <slide.icon size={12} className="mr-2" />
                    {slide.label}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    window.open(
                      "https://calendly.com/adnan-karim-Talk.-io/Talk.-demo",
                      "_blank"
                    )
                  }
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </section>

          <section className="py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">
                  Talk. is looking for early adopters
                </h2>
                <Button variant="default" size="lg" onClick={onGetStarted}>
                  Get started
                </Button>
              </div>
            </div>
          </section>
        </main>
        <footer className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <span className="text-xl font-bold text-gray-900">Talk.</span>
              </div>
              <nav className="flex flex-wrap justify-center md:justify-end gap-6">
                <Link
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  href="#"
                >
                  Terms
                </Link>
                <Link
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  href="#"
                >
                  Privacy
                </Link>
                <Link
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  href="#"
                >
                  Contact
                </Link>
                <Link
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  href="#"
                >
                  About us
                </Link>
              </nav>
            </div>
            <div className="mt-8 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Talk.. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </AnimatedLayout>
  );
};
export default LandingPage;
