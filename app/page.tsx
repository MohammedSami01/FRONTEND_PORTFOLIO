"use client"

import { useEffect, useRef, useState } from "react"
import RemoveFormAttributes from "@/components/RemoveFormAttributes"
import {
  ChevronRight,
  ArrowDown,
  ExternalLink,
  Github,
  ArrowUp,
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  Code,
  Terminal,
  FileText,
  Coffee,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const illustrationRef = useRef<HTMLDivElement>(null)
  const portfolioRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const earthRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [displayText, setDisplayText] = useState("Welcome to my interactive portfolio...")
  const [isTyping, setIsTyping] = useState(false)
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  type TerminalMode = "terminal" | "editor" | "matrix";
  const [terminalMode, setTerminalMode] = useState<TerminalMode>("terminal")
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number }>>([])
  const [mounted, setMounted] = useState(false)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [showProjects, setShowProjects] = useState(false)
  const [activeTab, setActiveTab] = useState<'exp' | 'edu'>('exp')
  
  // Remove fdprocessedid attributes that cause hydration mismatches
  useEffect(() => {
    const removeAttributes = () => {
      document.querySelectorAll('[fdprocessedid]').forEach(el => {
        el.removeAttribute('fdprocessedid')
      })
    }
    
    // Run on mount and after a short delay
    removeAttributes()
    const timer = setTimeout(removeAttributes, 1000)
    
    // Also set up a mutation observer to catch dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => removeAttributes())
    })
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['fdprocessedid']
    })
    
    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  
  const toggleProjects = () => {
    setShowProjects(!showProjects);
  };

  const responses: Record<string, string> = {
    hello: "👋 Hello! I'm Mohammed Sami, a passionate Frontend Developer. Type 'help' to get started.",
    help:
      "📋 Available commands:\n• skills\n• about me\n• portfolio\n• experience\n• internship\n• education\n• contact\n• resume\n• clear\n• exit\n",
    
    skills:
      "🛠️ Frontend: HTML5, CSS3, JavaScript, React.js, Next.js, Tailwind CSS, Framer Motion\n" +
      "⚙️ Backend: Node.js, Express.js, MongoDB, RESTful APIs\n" +
      "🧰 Tools: Postman, Docker, GitHub\n" +
      "🎨 Design: Figma, Canva\n" +
      "📱 Social Media Marketing: Instagram\n" +
      "💼 Soft Skills: Leadership, Communication, Time Management, Innovation",
  
    "about me":
      "👨‍💻 Frontend Developer with a strong foundation in building innovative, user-driven web applications. Recently graduated and eager to contribute to impactful projects with modern technologies.",
  
    portfolio:
      "📂 Projects:\n" +
      "• Hostel & Mess Management System – MERN stack platform with role-based access for room allocation, mess subscription, complaints, and analytics.\n" +
      "• PrimePass – Gamified ticket booking platform with user rewards and real-time seat booking.\n" +
      "• Car Rental Platform – Responsive UI with real-time vehicle availability, secure bookings, and payment integration.",
  
    experience:
      "🧠 Built multiple full-stack applications using the MERN stack. Strong focus on responsive design, user experience, and backend API development. Familiar with Agile workflows and collaborative tools like GitHub and Docker.",
  
    internship:
      "🏢 Palindrome Labs (Jan 2025 – May 2025):\nDeveloped modules for Hostel & Mess Management System using React, Node.js, Express.js, and MongoDB. Automated room and mess workflows with secure, role-based access.",
  
    education:
      "🎓 BCA @ KLE Technological University (2022–2025)\n📘 PU @ Samnang Pu College, Commerce (2020–2022)\n🏫 SSLC @ Loyola Convent School (2020)",
  
    contact:
      "📧 Email: itzsamii6980@gmail.com\n📍 Location: Gadag, Karnataka\n📞 Phone: 7483719770",
  
    resume:
      "📄 Download Resume: [Click here](/RESUME_UPDATED.pdf)",
  
    clear: "",
    exit: "👋 Thanks for visiting! Refresh to start over anytime.",
  };
  

  // Enhanced keyboard handling with history and special keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.key) return; // Skip if key is undefined or null
      const key = e.key.toLowerCase()

      // Play typing sound if enabled
      if (soundEnabled && key.length === 1) {
        playTypingSound()
      }

      // Add pressed key to set for visual feedback
      setPressedKeys((prev) => new Set(prev).add(key))

      // Remove key after short delay
      setTimeout(() => {
        setPressedKeys((prev) => {
          const newSet = new Set(prev)
          newSet.delete(key)
          return newSet
        })
      }, 150)

      if (key === "enter") {
        if (typedText.trim() === "clear") {
          setDisplayText("")
          setTypedText("")
          return
        }

        if (typedText.trim() === "matrix") {
          setTerminalMode("matrix")
          setTimeout(() => setTerminalMode("terminal"), 3000)
        }

        // Add to command history
        if (typedText.trim()) {
          setCommandHistory((prev) => [...prev, typedText.trim()])
          setHistoryIndex(-1)
        }

        // Check if typed text matches any response
        const response = responses[typedText.toLowerCase().trim()]
        if (response) {
          typeResponse(response)
        } else if (typedText.trim()) {
          typeResponse("❌ Command not recognized. Type 'help' for available commands.")
        }
        setTypedText("")
      } else if (key === "backspace") {
        setTypedText((prev) => prev.slice(0, -1))
      } else if (key === "arrowup") {
        e.preventDefault()
        if (commandHistory.length > 0) {
          const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
          setHistoryIndex(newIndex)
          setTypedText(commandHistory[newIndex])
        }
      } else if (key === "arrowdown") {
        e.preventDefault()
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1)
            setTypedText("")
          } else {
            setHistoryIndex(newIndex)
            setTypedText(commandHistory[newIndex])
          }
        }
      } else if (key.length === 1 && /[a-zA-Z0-9\s]/.test(key)) {
        setTypedText((prev) => prev + key)
      }
    }

    const typeResponse = (response: string) => {
      setIsTyping(true)
      setDisplayText("")
      let index = 0

      const typeInterval = setInterval(() => {
        if (index < response.length) {
          setDisplayText((prev) => prev + response[index])
          index++
        } else {
          clearInterval(typeInterval)
          setIsTyping(false)
        }
      }, 30)
    }

    const playTypingSound = () => {
      // Create a simple beep sound (original version)
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800 + Math.random() * 200
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [typedText, commandHistory, historyIndex, soundEnabled])

  // Generate particles on mount
  useEffect(() => {
    setMounted(true)
    
    const initialParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: Math.random() * 0.2 - 0.1,
      vy: Math.random() * 0.2 - 0.1,
    }));
    
    setParticles(initialParticles);
  }, []);

  // Enhanced mouse movement with particle effects
  const handleMouseMove = (e: MouseEvent) => {
    if (!illustrationRef.current || !mounted) return

    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window

    // Shift the x-position more to the right by adding an offset
    const xPos = ((clientX / innerWidth - 0.5) * 20) + 10
    const yPos = (clientY / innerHeight - 0.5) * 20

    illustrationRef.current.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) rotateX(${yPos * 0.1}deg) rotateY(${xPos * 0.1}deg)`

    // Update custom cursor with right offset
    if (cursorRef.current) {
      const offsetX = 50; // Adjust this value to move the cursor more or less to the right
      cursorRef.current.style.left = (clientX + offsetX) + "px"
      cursorRef.current.style.top = clientY + "px"
    }

    // Add particle on mouse move (occasionally)
    if (Math.random() < 0.1) {
      const newParticle = {
        id: Date.now(),
        x: clientX,
        y: clientY,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
      }
      setParticles((prev) => [...prev.slice(-20), newParticle])
    }
  }

  const handleScroll = () => {
    const scrolled = window.pageYOffset

    if (heroRef.current) {
      const parallax = scrolled * 0.5
      heroRef.current.style.transform = `translate3d(0, ${parallax}px, 0)`
    }

    // Show/hide back to top button
    setShowBackToTop(scrolled > window.innerHeight)

    // Update current section based on scroll position
    const sections = [heroRef, portfolioRef, skillsRef, contactRef]
    const windowHeight = window.innerHeight

    sections.forEach((ref, index) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
          setCurrentSection(index)
        }
      }
    })
  }

  // Particle animation
  useEffect(() => {
    const animateParticles = () => {
      setParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vx: particle.vx * 0.99,
            vy: particle.vy * 0.99,
          }))
          .filter(
            (particle) =>
              particle.x > -50 &&
              particle.x < window.innerWidth + 50 &&
              particle.y > -50 &&
              particle.y < window.innerHeight + 50 &&
              Math.abs(particle.vx) > 0.1 &&
              Math.abs(particle.vy) > 0.1,
          ),
      )
    }

    const interval = setInterval(animateParticles, 16)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    // Earth rotation animation
    let earthRotation = 0
    const rotateEarth = () => {
      if (earthRef.current) {
        earthRotation += 0.5
        earthRef.current.style.transform = `rotateY(${earthRotation}deg)`
      }
      requestAnimationFrame(rotateEarth)
    }
    rotateEarth()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToSection = (index: number) => {
    const sections = [heroRef, portfolioRef, skillsRef, contactRef]
    if (sections[index]?.current) {
      sections[index].current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const projects = [
    {
      title: "DriveMate",
      description:
        "Drivemate is a modern car rental platform designed for seamless vehicle booking and management. It offers real-time availability tracking, user-friendly search and filter options, secure booking flows, and admin management tools.",
      tech: ["React", "Node.js","Express","MongoDB", "Stripe"],
      image: "/drivemate.png",
      link: "https://drive-mate-dev.vercel.app/login",
      github: "#",
      status: "Live",
      year: "2025",
    },
    {
      title: "PrimePass",
      description:
        "PrimePass is a gamified ticket booking platform that transforms the traditional movie booking experience into an engaging and rewarding journey. Users can earn points, unlock badges, and enjoy a dynamic interface while securing their favorite seats.",
      tech: ["next.js","Raect",,"Typescript","Node","Express", "MongoDb", "Tailwind CSS"],
      image: "/primepass.png",
      link: "https://primepass-app.vercel.app/",
      github: "#",
      status: "In Development",
      year: "2024",
    },
    {
      title: "Seo Agency Landing Page",
      description:
        "A sleek, responsive landing page for SEO agencies, featuring smooth animations and high-performance design to showcase your services effectively.",
      tech: ["Next.js", "React", "TypeScript", "Tailwind"],
      image: "/seo.png",
      link: "https://seo-agency-landing-gamma.vercel.app",
      github: "#", // Replace with your GitHub repo URL
      status: "Live",
      year: "2025",
    },
    {
      title: "Cyberpunk Landing Page",
      description:
        "A sleek, responsive landing page for SEO agencies, featuring smooth animations and high-performance design to showcase your services effectively.",
      tech: ["Next.js", "React", "TypeScript", "Tailwind"],
      image: "/cyberpunk.png",
      link: "https://cyberpunk-landing-page.vercel.app/",
      github: "#", // Replace with your GitHub repo URL
      status: "Live",
      year: "2025",
    },
    {
      title: "Attendance Management",
      description:
        "A simple and intuitive attendance tracking application built with React. Allows users to mark whether a student is present or absent through a clean and responsive interface.",
      tech: ["React", "CSS", "HTML", "JavaScript"],
      image: "/attendance.png",
      link: "https://attendance--management-application.vercel.app/",
      github: "#", // Replace with your GitHub repo URL
      status: "Live",
      year: "2025",
    },
    
  ]

  return (
    <>
      <RemoveFormAttributes />
      <div suppressHydrationWarning className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative main-container">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed-cursor w-4 h-4 bg-purple-500 rounded-full mix-blend-difference transition-transform duration-100"
        style={{ transform: "translate(-50%, -50%)" }}
      />

      {/* Particles */}
      <div className="fixed-particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60"
            style={{
              left: particle.x,
              top: particle.y,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 backdrop-blur-sm bg-black/20" suppressHydrationWarning>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white flex items-center justify-center">
              <div className="w-3 h-3 bg-black transform rotate-45"></div>
            </div>
            <span className="text-xl font-bold tracking-wider">Mohammed Sami</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              suppressHydrationWarning
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-white/60 hover:text-white"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            
            <a
            href="https://mail.google.com/mail/?view=cm&to=itzsamii6980@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              suppressHydrationWarning
              className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 bg-transparent"
            >
              Contact
            </Button>
          </a>


          </div>
        </div>
      </header>

      {/* Side Navigation */}
      <nav className="fixed-side-nav hidden lg:block">
        <div className="flex flex-col space-y-6 text-sm text-white/60">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              onClick={() => scrollToSection(Math.min(index, 3))}
              className={`hover:text-white transition-colors cursor-pointer relative group ${
                currentSection === index ? "text-white" : ""
              }`}
            >
              0{index}
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap">
                {["Hero", "Portfolio", "Skills", "Contact", "More"][index]}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center">
        <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 lg:pr-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-purple-400 mb-4">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-sm uppercase tracking-wider">Myself: Mohammed Sami</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Front-End Software
                <br />
                <span className="text-white/90 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Developer
                </span>
              </h1>

              <p className="text-lg text-white/70 leading-relaxed max-w-lg">
                Resolving design problems, building smart user interfaces and useful interactions, developing rich web
                applications and seamless web experiences.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
              <a href="/RESUME_UPDATED.pdf" download>
                <div className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group">
                  <span className="text-lg">Download Resume</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>


                <div className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer group">
                  <Terminal className="w-5 h-5" />
                  <span className="text-lg">Try the terminal →</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Enhanced 3D Illustration */}
          <div className="relative flex justify-center lg:justify-end">
            <div
              ref={illustrationRef}
              className="relative w-full max-w-2xl transition-transform duration-100 ease-out"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Main Monitor with Enhanced Terminal - Positioned 100px from top */}
              <div className="relative z-10 transition-transform duration-500 group mb-16 mt-24">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 shadow-2xl border border-gray-700 group-hover:border-purple-500/50 transition-colors">
                  <div className="bg-black rounded-md h-64 md:h-80 relative overflow-hidden">
                    <div className="absolute top-2 left-2 flex space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 cursor-pointer transition-colors"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 cursor-pointer transition-colors"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 cursor-pointer transition-colors"></div>
                    </div>

                    {/* Terminal Mode Selector */}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button
                        onClick={() => setTerminalMode("terminal")}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                          terminalMode === "terminal" ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        <Terminal className="w-3 h-3 text-white" />
                      </button>
                      <button
                        onClick={() => setTerminalMode("editor")}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                          terminalMode === "editor" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                        }`}
                      >
                        <Code className="w-3 h-3 text-white" />
                      </button>
                    </div>

                    <div className="p-4 pt-8 text-green-400 font-mono text-xs h-full flex flex-col">
                      {terminalMode === "terminal" && (
                        <>
                          <div className="mb-2 text-purple-400 flex items-center space-x-2">
                            <span>~/portfolio $</span>
                            {soundEnabled && <Volume2 className="w-3 h-3 animate-pulse" />}
                          </div>
                          <div className="mb-2 text-white">
                            {typedText && `> ${typedText}`}
                            {typedText && <span className="animate-pulse">|</span>}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <div
                              className={`text-green-400 break-words ${
                                (terminalMode as string) === 'matrix' ? 'animate-pulse text-green-300' : ''
                              }`}
                            >
                              {displayText}
                              {isTyping && <span className="animate-pulse">|</span>}
                            </div>
                          </div>
                          <div className="mt-auto text-gray-500 text-xs flex items-center justify-between">
                            <span>Try: help, skills, about me, matrix</span>
                            <div className="flex items-center space-x-1">
                              <Coffee className="w-3 h-3" />
                              <span>Ready</span>
                            </div>
                          </div>
                        </>
                      )}

                      {terminalMode === "editor" && (
                        <div className="h-full">
                          <div className="text-blue-400 mb-2">portfolio.js</div>
                          <div className="text-gray-300 text-xs leading-relaxed">
                            <div>
                              <span className="text-purple-400">const</span>{" "}
                              <span className="text-blue-300">developer</span> = {`{`}
                            </div>
                            <div className="ml-4">
                              <span className="text-green-300">name</span>:{" "}
                              <span className="text-yellow-300">'Frontend Developer'</span>,
                            </div>
                            <div className="ml-4">
                              <span className="text-green-300">skills</span>: [
                              <span className="text-yellow-300">'React'</span>,{" "}
                              <span className="text-yellow-300">'Tailwind CSS'</span>,{" "}
                              <span className="text-yellow-300">'Node.js'</span>],
                            </div>
                            <div className="ml-4">
                              <span className="text-green-300">passion</span>:{" "}
                              <span className="text-yellow-300">'Creating amazing UX'</span>
                            </div>
                            <div>{`};`}</div>
                            <div className="mt-2">
                              <span className="text-purple-400">export default</span> developer;
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reposition secondary screen to not interfere
              <div className="absolute -top-8 -right-4 transform -rotate-12 hover:-rotate-6 transition-transform duration-500">
                <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-3 shadow-xl border border-gray-600 w-40 h-28 hover:border-green-500/50 transition-colors">
                  <div className="bg-black rounded h-full p-2 text-purple-400 font-mono text-xs">
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span>npm install</span>
                    </div>
                    <div className="text-green-400 flex items-center space-x-1">
                      <span>✓</span>
                      <span>Success</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Play className="w-3 h-3 text-blue-400" />
                      <span>npm run dev</span>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Enhanced Purple Diamond */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 transform rotate-45 rounded-lg shadow-2xl animate-pulse hover:scale-110 transition-transform cursor-pointer group">
                  <div className="absolute inset-4 bg-white/20 rounded transform -rotate-45 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <div className="text-white font-bold text-lg transform rotate-45">{"</>"}</div>
                  </div>
                  <div className="absolute -inset-2 bg-purple-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>

              {/* Enhanced Functional Keyboard - Positioned below laptop with proper spacing */}
              <div className="relative z-10 mt-8">
                <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg p-3 shadow-xl w-80 h-24 hover:shadow-purple-500/20 hover:shadow-2xl transition-shadow mx-auto">
                  <div className="space-y-1">
                    {/* First Row */}
                    <div className="flex justify-center space-x-1">
                      {["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map((key) => (
                        <div
                          key={key}
                          className={`w-6 h-4 bg-gray-800 rounded-sm flex items-center justify-center text-white text-xs font-mono transition-all duration-150 ${
                            pressedKeys.has(key)
                              ? "bg-purple-600 scale-95 shadow-lg shadow-purple-500/50"
                              : "hover:bg-gray-700 hover:shadow-md"
                          }`}
                        >
                          {key.toUpperCase()}
                        </div>
                      ))}
                    </div>

                    {/* Second Row */}
                    <div className="flex justify-center space-x-1">
                      {["a", "s", "d", "f", "g", "h", "j", "k", "l"].map((key) => (
                        <div
                          key={key}
                          className={`w-6 h-4 bg-gray-800 rounded-sm flex items-center justify-center text-white text-xs font-mono transition-all duration-150 ${
                            pressedKeys.has(key)
                              ? "bg-purple-600 scale-95 shadow-lg shadow-purple-500/50"
                              : "hover:bg-gray-700 hover:shadow-md"
                          }`}
                        >
                          {key.toUpperCase()}
                        </div>
                      ))}
                    </div>

                    {/* Third Row */}
                    <div className="flex justify-center space-x-1">
                      {["z", "x", "c", "v", "b", "n", "m"].map((key) => (
                        <div
                          key={key}
                          className={`w-6 h-4 bg-gray-800 rounded-sm flex items-center justify-center text-white text-xs font-mono transition-all duration-150 ${
                            pressedKeys.has(key)
                              ? "bg-purple-600 scale-95 shadow-lg shadow-purple-500/50"
                              : "hover:bg-gray-700 hover:shadow-md"
                          }`}
                        >
                          {key.toUpperCase()}
                        </div>
                      ))}
                    </div>

                    {/* Space Bar Row */}
                    <div className="flex justify-center space-x-1">
                      <div
                        className={`w-32 h-4 bg-gray-800 rounded-sm flex items-center justify-center text-white text-xs font-mono transition-all duration-150 ${
                          pressedKeys.has(" ")
                            ? "bg-purple-600 scale-95 shadow-lg shadow-purple-500/50"
                            : "hover:bg-gray-700 hover:shadow-md"
                        }`}
                      >
                        SPACE
                      </div>
                      <div
                        className={`w-12 h-4 bg-gray-800 rounded-sm flex items-center justify-center text-white text-xs font-mono transition-all duration-150 ${
                          pressedKeys.has("enter")
                            ? "bg-green-600 scale-95 shadow-lg shadow-green-500/50"
                            : "hover:bg-gray-700 hover:shadow-md"
                        }`}
                      >
                        ↵
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Mouse */}
              <div className="absolute -bottom-8 -right-12 transform -rotate-6 hover:-rotate-3 transition-transform duration-500">
                <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-full w-12 h-16 shadow-xl hover:shadow-blue-500/20 hover:shadow-2xl transition-shadow">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-800 rounded-full"></div>
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Enhanced Coffee Mug */}
              <div className="absolute -bottom-6 right-8 transform rotate-12 hover:rotate-6 transition-transform duration-500 group cursor-pointer">
                <div className="bg-gradient-to-br from-amber-800 to-amber-900 rounded-lg w-8 h-10 shadow-xl relative hover:shadow-amber-500/20 hover:shadow-2xl transition-shadow">
                  <div className="absolute -right-1 top-2 w-2 h-4 border-2 border-amber-800 rounded-full"></div>
                  <div className="absolute top-1 left-1 right-1 h-1 bg-amber-700 rounded-full"></div>
                  <div className="absolute top-2 left-1 right-1 h-6 bg-gradient-to-b from-amber-600 to-amber-800 rounded-sm opacity-80"></div>
                  <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-pulse group-hover:animate-bounce"></div>
                </div>
              </div>

              {/* Enhanced Floating Elements */}
              <div
                className="absolute top-8 -left-4 w-4 h-4 bg-purple-500 transform rotate-45 animate-bounce hover:bg-purple-400 transition-colors cursor-pointer"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="absolute -top-4 right-12 w-3 h-3 bg-blue-500 rounded-full animate-bounce hover:bg-blue-400 transition-colors cursor-pointer"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute bottom-16 -right-4 w-2 h-2 bg-green-500 transform rotate-45 animate-bounce hover:bg-green-400 transition-colors cursor-pointer"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-32 h-32 bg-green-500/5 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </section>

      {/* Portfolio Section - Enhanced */}
      <section ref={portfolioRef} className="relative min-h-screen flex items-center py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 text-purple-400 mb-4">
              <FileText className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider">My Work</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
              Portfolio & Projects
            </h2><br/>
            <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto mb-8">
              I have built various different projects to fit different aspects of the client's business. If you want to
              see more examples of my work than the ones showcased in this site, please{" "}
              <span className="text-orange-400 hover:text-orange-300 cursor-pointer transition-colors">contact me!</span>
            </p>
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={toggleProjects}
                className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors group"
                aria-expanded={showProjects}
                aria-controls="projects-grid"
              >
                <span className="text-lg">{showProjects ? 'Hide Projects' : 'See Projects'}</span>
                <ChevronRight 
                  className={`w-5 h-5 transition-transform ${showProjects ? 'rotate-90' : 'group-hover:translate-x-1'}`} 
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          {showProjects && (
            <div className="mt-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10"
                  >
                    <div className="aspect-video bg-gray-800 relative overflow-hidden">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <div className="flex justify-between items-end">
                          <div>
                            <h3 className="text-xl font-bold text-white">{project.title}</h3>
                            <p className="text-sm text-gray-300 mt-1">{project.year}</p>
                          </div>
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === "Live" 
                            ? "bg-green-500/20 text-green-300" 
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}>
                          {project.status}
                        </span>
                        {/* <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Github className="w-5 h-5" />
                        </a> */}
                      </div>
                      <p className="text-gray-300 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, techIndex) => (
                          <span 
                            key={techIndex} 
                            className="text-xs px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full border border-gray-700 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-purple-300 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-float"></div>
          <div
            className="absolute top-40 right-32 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-32 left-1/4 w-24 h-24 bg-blue-600/10 rounded-full blur-xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-20 right-20 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>
      </section>

      {/* Skills Section - Keep existing implementation */}
      <section ref={skillsRef} className="relative min-h-screen flex items-center py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="text-sm text-white/60 uppercase tracking-wider mb-8">
              A PROBLEM IS A CHANCE FOR YOU TO DO YOUR BEST
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
              Skills 
            </h2><br/>
            <div className="max-w-4xl mx-auto space-y-6 text-lg text-white/70 leading-relaxed">
              <p>The main area of expertise is front end development (client side of the web).</p>
              <p>
                HTML, CSS, JS, building small and medium web applications with Vue or React, custom plugins, features,
                animations, and coding interactive layouts. I have also full-stack developer experience with one of the
                most popular open source CMS on the web - WordPress
              </p>
              <p>
                Visit my{" "}
                <a href="https://in.linkedin.com/in/mohammedsami01" target="_blank" className="text-orange-400 hover:text-orange-300 cursor-pointer transition-colors">LinkedIn</a>{" "}
                for more details.
              </p>
            </div>
          </div>

          {/* Skills Icons Grid */}
          <div className="max-w-5xl mx-auto">
            {/* First Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 md:gap-12 mb-16">
              {/* JavaScript */}
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-12 h-12 md:w-16 md:h-16">
                    <path fill="#FFD600" d="M6,42V6h36v36H6z"/>
                    <path fill="#000001" d="M29.538 32.947c.692 1.124 1.444 2.201 3.037 2.201 1.338 0 2.04-.665 2.04-1.585 0-1.101-.726-1.492-2.198-2.133l-.807-.344c-2.329-.988-3.878-2.226-3.878-4.841 0-2.41 1.845-4.244 4.728-4.244 2.053 0 3.528.711 4.592 2.573l-2.514 1.607c-.553-.988-1.151-1.377-2.078-1.377-.946 0-1.545.597-1.545 1.377 0 .964.6 1.354 1.985 1.951l.807.344C36.452 29.645 38 30.839 38 33.523 38 36.415 35.716 38 32.65 38c-2.999 0-4.702-1.505-5.65-3.368L29.538 32.947zM17.952 33.029c.506.906 1.275 1.603 2.381 1.603 1.058 0 1.667-.418 1.667-2.043V22h3.333v11.101c0 3.367-1.953 4.899-4.805 4.899-2.577 0-4.437-1.746-5.195-3.368L17.952 33.029z"/>
                  </svg>
                </div>
                <span className="text-white/80 text-sm">JavaScript</span>
              </div>

             {/* React */}
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-12 h-12 md:w-16 md:h-16">
                    <g fill="#61DAFB">
                      <circle cx="64" cy="64" r="11.4" />
                      <path d="M107.3 45.2c-2.2-.8-4.5-1.6-6.9-2.3.6-2.4 1.1-4.8 1.5-7.1 2.1-13.2-.2-22.5-6.6-26.1-1.9-1.1-4-1.6-6.4-1.6-7 0-15.9 5.2-24.9 13.9-9-8.7-17.9-13.9-24.9-13.9-2.4 0-4.5.5-6.4 1.6-6.4 3.7-8.7 13-6.6 26.1.4 2.3.9 4.7 1.5 7.1-2.4.7-4.7 1.4-6.9 2.3C8.2 50 1.4 56.6 1.4 64s6.9 14 19.3 18.8c2.2.8 4.5 1.6 6.9 2.3-.6 2.4-1.1 4.8-1.5 7.1-2.1 13.2.2 22.5 6.6 26.1 1.9 1.1 4 1.6 6.4 1.6 7.1 0 16-5.2 24.9-13.9 9 8.7 17.9 13.9 24.9 13.9 2.4 0 4.5-.5 6.4-1.6 6.4-3.7 8.7-13 6.6-26.1-.4-2.3-.9-4.7-1.5-7.1 2.4-.7 4.7-1.4 6.9-2.3 12.5-4.8 19.3-11.4 19.3-18.8s-6.8-14-19.3-18.8zM92.5 14.7c4.1 2.4 5.5 9.8 3.8 20.3-.3 2.1-.8 4.3-1.4 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3 1.3 0 2.5.3 3.5.9zM81.3 74c-1.8 3.2-3.9 6.4-6.1 9.6-3.7.3-7.4.4-11.2.4-3.9 0-7.6-.1-11.2-.4-2.2-3.2-4.2-6.4-6-9.6-1.9-3.3-3.7-6.7-5.3-10 1.6-3.3 3.4-6.7 5.3-10 1.8-3.2 3.9-6.4 6.1-9.6 3.7-.3 7.4-.4 11.2-.4 3.9 0 7.6.1 11.2.4 2.2 3.2 4.2 6.4 6 9.6 1.9 3.3 3.7 6.7 5.3 10-1.7 3.3-3.4 6.6-5.3 10zm8.3-3.3c1.5 3.5 2.7 6.9 3.8 10.3-3.4.8-7 1.4-10.8 1.9 1.2-1.9 2.5-3.9 3.6-6 1.2-2.1 2.3-4.2 3.4-6.2zM64 97.8c-2.4-2.6-4.7-5.4-6.9-8.3 2.3.1 4.6.2 6.9.2 2.3 0 4.6-.1 6.9-.2-2.2 2.9-4.5 5.7-6.9 8.3zm-18.6-15c-3.8-.5-7.4-1.1-10.8-1.9 1.1-3.3 2.3-6.8 3.8-10.3 1.1 2 2.2 4.1 3.4 6.1 1.2 2.2 2.4 4.1 3.6 6.1zm-7-25.5c-1.5-3.5-2.7-6.9-3.8-10.3 3.4-.8 7-1.4 10.8-1.9-1.2 1.9-2.5 3.9-3.6 6-1.2 2.1-2.3 4.2-3.4 6.2zM64 30.2c2.4 2.6 4.7 5.4 6.9 8.3-2.3-.1-4.6-.2-6.9-.2-2.3 0-4.6.1-6.9.2 2.2-2.9 4.5-5.7 6.9-8.3zm22.2 21l-3.6-6c3.8.5 7.4 1.1 10.8 1.9-1.1 3.3-2.3 6.8-3.8 10.3-1.1-2.1-2.2-4.2-3.4-6.2zM31.7 35c-1.7-10.5-.3-17.9 3.8-20.3 1-.6 2.2-.9 3.5-.9 6 0 13.5 4.9 21 12.3-3.5 3.8-7 8.2-10.4 13-5.8.5-11.3 1.4-16.5 2.5-.6-2.3-1-4.5-1.4-6.6zM7 64c0-4.7 5.7-9.7 15.7-13.4 2-.8 4.2-1.5 6.4-2.1 1.6 5 3.6 10.3 6 15.6-2.4 5.3-4.5 10.5-6 15.5C15.3 75.6 7 69.6 7 64zm28.5 49.3c-4.1-2.4-5.5-9.8-3.8-20.3.3-2.1.8-4.3 1.4-6.6 5.2 1.2 10.7 2 16.5 2.5 3.4 4.8 6.9 9.1 10.4 13-7.4 7.3-14.9 12.3-21 12.3-1.3 0-2.5-.3-3.5-.9zM96.3 93c1.7 10.5.3 17.9-3.8 20.3-1 .6-2.2.9-3.5.9-6 0-13.5-4.9-21-12.3 3.5-3.8 7-8.2 10.4-13 5.8-.5 11.3-1.4 16.5-2.5.6 2.3 1 4.5 1.4 6.6zm9-15.6c-2 .8-4.2 1.5-6.4 2.1-1.6-5-3.6-10.3-6-15.6 2.4-5.3 4.5-10.5 6-15.5 13.8 4 22.1 10 22.1 15.6 0 4.7-5.8 9.7-15.7 13.4z" />
                    </g>
                  </svg>
                </div>
                <span className="text-white/80 text-sm">React</span>
              </div>


              {/* Vue */}
              <div className="flex flex-col items-center group">
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-12 h-12 md:w-16 md:h-16">
              <path d="M0 8.934l49.854.158 14.167 24.47 14.432-24.47L128 8.935l-63.834 110.14zm126.98.637l-24.36.02-38.476 66.053L25.691 9.592.942 9.572l63.211 107.89zm-25.149-.008l-22.745.168-15.053 24.647L49.216 9.73l-22.794-.168 37.731 64.476zm-75.834-.17l23.002.009m-23.002-.01l23.002.01" fill="none"/>
              <path d="M25.997 9.393l23.002.009L64.035 34.36 79.018 9.404 102 9.398 64.15 75.053z" fill="#35495e"/>
              <path d="M.91 9.569l25.067-.172 38.15 65.659L101.98 9.401l25.11.026-62.966 108.06z" fill="#41b883"/>
              </svg>
              </div>
              <span className="text-white/80 text-sm">Vue</span>
              </div>


              {/* Node */}
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-12 h-12 md:w-16 md:h-16">
                    <path fill="#83CD29" d="M112.771 30.334L68.674 4.729c-2.781-1.584-6.402-1.584-9.205 0L14.901 30.334C12.031 31.985 10 35.088 10 38.407v51.142c0 3.319 2.084 6.423 4.954 8.083l11.775 6.688c5.628 2.772 7.617 2.772 10.178 2.772 8.333 0 13.093-5.039 13.093-13.828v-50.49c0-.713-.371-1.774-1.071-1.774h-5.623C42.594 41 41 42.061 41 42.773v50.49c0 3.896-3.524 7.773-10.11 4.48L18.723 90.73c-.424-.23-.723-.693-.723-1.181V38.407c0-.482.555-.966.982-1.213l44.424-25.561c.415-.235 1.025-.235 1.439 0l43.882 25.555c.42.253.272.722.272 1.219v51.142c0 .488.183.963-.232 1.198l-44.086 25.576c-.378.227-.847.227-1.261 0l-11.307-6.749c-.341-.198-.746-.269-1.073-.086-3.146 1.783-3.726 2.02-6.677 3.043-.726.253-1.797.692.41 1.929l14.798 8.754a9.294 9.294 0 004.647 1.246c1.642 0 3.25-.426 4.667-1.246l43.885-25.582c2.87-1.672 4.23-4.764 4.23-8.083V38.407c0-3.319-1.36-6.414-4.229-8.073zM77.91 81.445c-11.726 0-14.309-3.235-15.17-9.066-.1-.628-.633-1.379-1.272-1.379h-5.731c-.709 0-1.279.86-1.279 1.566 0 7.466 4.059 16.512 23.453 16.512 14.039 0 22.088-5.455 22.088-15.109 0-9.572-6.467-12.084-20.082-13.886-13.762-1.819-15.16-2.738-15.16-5.962 0-2.658 1.184-6.203 11.374-6.203 9.105 0 12.461 1.954 13.842 8.091.118.577.645.991 1.24.991h5.754c.354 0 .692-.143.94-.396.24-.272.367-.613.335-.979-.891-10.568-7.912-15.493-22.112-15.493-12.631 0-20.166 5.334-20.166 14.275 0 9.698 7.497 12.378 19.622 13.577 14.505 1.422 15.633 3.542 15.633 6.395 0 4.955-3.978 7.066-13.309 7.066z"/>
                  </svg>
                </div>
                <span className="text-white/80 text-sm">Node.js</span>
                    </div>
 
 
                  {/* Next.js */}
              <div className="flex flex-col items-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-12 h-12 md:w-16 md:h-16">
                    <path fill="#ffffff" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z"/>
                  </svg>
                </div>
                <span className="text-white/80 text-sm">Next.js</span>
              </div>






              
            {/* Tailwind */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-12 h-12 md:w-16 md:h-16">
                  <path d="M64.004 25.602c-17.067 0-27.73 8.53-32 25.597 6.398-8.531 13.867-11.73 22.398-9.597 4.871 1.214 8.352 4.746 12.207 8.66C72.883 56.629 80.145 64 96.004 64c17.066 0 27.73-8.531 32-25.602-6.399 8.536-13.867 11.735-22.399 9.602-4.87-1.215-8.347-4.746-12.207-8.66-6.27-6.367-13.53-13.738-29.394-13.738zM32.004 64c-17.066 0-27.73 8.531-32 25.602C6.402 81.066 13.87 77.867 22.402 80c4.871 1.215 8.352 4.746 12.207 8.66 6.274 6.367 13.536 13.738 29.395 13.738 17.066 0 27.73-8.53 32-25.597-6.399 8.531-13.867 11.73-22.399 9.597-4.87-1.214-8.347-4.746-12.207-8.66C55.128 71.371 47.868 64 32.004 64zm0 0" fill="#38bdf8"/>
                </svg>
              </div>
              <span className="text-white/80 text-sm">Tailwind</span>
            </div>


              
        {/* GitHub */}
        <div className="flex flex-col items-center group">
          <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg
              viewBox="0 0 248 256"
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 md:w-16 md:h-16"
            >
              <path
                fill="currentColor"
                d="M120.42 0C53.9 0 0 53.9 0 120.42c0 53.3 33.63 98.4 80.27 114.3 5.87 1.07 8.02-2.54 8.02-5.66v-22.11c-32.67 7.1-39.55-15.77-39.55-15.77-5.35-13.6-13.06-17.2-13.06-17.2-10.67-7.3.8-7.15.8-7.15 11.8.83 18.04 12.1 18.04 12.1 10.5 17.98 27.57 12.78 34.29 9.77 1.07-7.6 4.12-12.78 7.5-15.7-26.08-2.98-53.48-13.05-53.48-58.08 0-12.84 4.6-23.3 12.1-31.5-1.23-2.96-5.26-14.9 1.15-31.1 0 0 9.88-3.16 32.3 12.05a112.26 112.26 0 0 1 58.74 0c22.42-15.2 32.3-12.05 32.3-12.05 6.4 16.2 2.38 28.14 1.15 31.1 7.5 8.2 12.1 18.65 12.1 31.5 0 45.2-27.57 55.08-53.77 58 4.23 3.63 8.02 10.8 8.02 21.84v32.4c0 3.12 2.1 6.76 8.02 5.65 46.63-15.93 80.2-61.02 80.2-114.3C240.84 53.9 186.94 0 120.42 0z"
              />
            </svg>
          </div>
          <span className="text-white/80 text-sm">GitHub</span>
        </div>



            </div>

            {/* Second Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 md:gap-12">
           {/* CSS3 */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-12 h-12 md:w-16 md:h-16">
                  <path fill="#1572B6" d="M18.814 114.123L8.76 1.352h110.48l-10.064 112.754-45.243 12.543-45.119-12.526z"/>
                  <path fill="#33A9DC" d="M64.001 117.062l36.559-10.136 8.601-96.354h-45.16v106.49z"/>
                  <path fill="#fff" d="M64.001 51.429h18.302l1.264-14.163H64.001V23.435h34.682l-.332 3.711-3.4 38.114h-30.95V51.429z"/>
                  <path fill="#EBEBEB" d="M64.083 87.349l-.061.018-15.403-4.159-.985-11.031H33.752l1.937 21.717 28.331 7.863.063-.018v-14.39z"/>
                  <path fill="#fff" d="M81.127 64.675l-1.666 18.522-15.426 4.164v14.39l28.354-7.858.208-2.337 2.406-26.881H81.127z"/>
                  <path fill="#EBEBEB" d="M64.048 23.435v13.831H30.64l-.277-3.108-.63-7.012-.331-3.711h34.646zm-.047 27.996v13.831H48.792l-.277-3.108-.631-7.012-.33-3.711h16.447z"/>
                </svg>
              </div>
              <span className="text-white/80 text-sm">CSS3</span>
            </div>


           {/* Socket.io */}
<div className="flex flex-col items-center group">
  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-12 h-12 md:w-16 md:h-16" fill="white">
      <g fill="currentColor" fillRule="evenodd">
        <path d="M63.951.001C28.696.001.001 28.696.001 63.951s28.695 63.95 63.95 63.95 63.95-28.695 63.95-63.95S99.206.001 63.95.001zm0 10.679c29.484 0 53.272 23.787 53.272 53.271 0 29.485-23.788 53.272-53.272 53.272-29.484 0-53.272-23.787-53.272-53.272 0-29.484 23.788-53.271 53.272-53.271z"/>
        <path d="M48.39 60.716c14.004-11.44 27.702-23.278 42.011-34.384-7.505 11.533-15.224 22.913-22.729 34.445-6.437.03-12.875.03-19.282-.061zM60.228 67.092c6.468 0 12.905 0 19.342.092-14.095 11.38-27.732 23.309-42.071 34.384 7.505-11.533 15.224-22.943 22.729-34.476z"/>
      </g>
    </svg>
  </div>
  <span className="text-white/80 text-sm">Socket.io</span>
</div>


            {/* MongoDB */}
<div className="flex flex-col items-center group">
  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fillRule="evenodd" clipRule="evenodd" fill="#439934" d="M88.038 42.812c1.605 4.643 2.761 9.383 3.141 14.296.472 6.095.256 12.147-1.029 18.142-.035.165-.109.32-.164.48-.403.001-.814-.049-1.208.012-3.329.523-6.655 1.065-9.981 1.604-3.438.557-6.881 1.092-10.313 1.687-1.216.21-2.721-.041-3.212 1.641-.014.046-.154.054-.235.08l.166-10.051-.169-24.252 1.602-.275c2.62-.429 5.24-.864 7.862-1.281 3.129-.497 6.261-.98 9.392-1.465 1.381-.215 2.764-.412 4.148-.618z"/><path fillRule="evenodd" clipRule="evenodd" fill="#45A538" d="M61.729 110.054c-1.69-1.453-3.439-2.842-5.059-4.37-8.717-8.222-15.093-17.899-18.233-29.566-.865-3.211-1.442-6.474-1.627-9.792-.13-2.322-.318-4.665-.154-6.975.437-6.144 1.325-12.229 3.127-18.147l.099-.138c.175.233.427.439.516.702 1.759 5.18 3.505 10.364 5.242 15.551 5.458 16.3 10.909 32.604 16.376 48.9.107.318.384.579.583.866l-.87 2.969z"/><path fillRule="evenodd" clipRule="evenodd" fill="#46A037" d="M88.038 42.812c-1.384.206-2.768.403-4.149.616-3.131.485-6.263.968-9.392 1.465-2.622.417-5.242.852-7.862 1.281l-1.602.275-.012-1.045c-.053-.859-.144-1.717-.154-2.576-.069-5.478-.112-10.956-.18-16.434-.042-3.429-.105-6.857-.175-10.285-.043-2.13-.089-4.261-.185-6.388-.052-1.143-.236-2.28-.311-3.423-.042-.657.016-1.319.029-1.979.817 1.583 1.616 3.178 2.456 4.749 1.327 2.484 3.441 4.314 5.344 6.311 7.523 7.892 12.864 17.068 16.193 27.433z"/><path fillRule="evenodd" clipRule="evenodd" fill="#409433" d="M65.036 80.753c.081-.026.222-.034.235-.08.491-1.682 1.996-1.431 3.212-1.641 3.432-.594 6.875-1.13 10.313-1.687 3.326-.539 6.652-1.081 9.981-1.604.394-.062.805-.011 1.208-.012-.622 2.22-1.112 4.488-1.901 6.647-.896 2.449-1.98 4.839-3.131 7.182a49.142 49.142 0 01-6.353 9.763c-1.919 2.308-4.058 4.441-6.202 6.548-1.185 1.165-2.582 2.114-3.882 3.161l-.337-.23-1.214-1.038-1.256-2.753a41.402 41.402 0 01-1.394-9.838l.023-.561.171-2.426c.057-.828.133-1.655.168-2.485.129-2.982.241-5.964.359-8.946z"/><path fillRule="evenodd" clipRule="evenodd" fill="#4FAA41" d="M65.036 80.753c-.118 2.982-.23 5.964-.357 8.947-.035.83-.111 1.657-.168 2.485l-.765.289c-1.699-5.002-3.399-9.951-5.062-14.913-2.75-8.209-5.467-16.431-8.213-24.642a4498.887 4498.887 0 00-6.7-19.867c-.105-.31-.407-.552-.617-.826l4.896-9.002c.168.292.39.565.496.879a6167.476 6167.476 0 016.768 20.118c2.916 8.73 5.814 17.467 8.728 26.198.116.349.308.671.491 1.062l.67-.78-.167 10.052z"/><path fillRule="evenodd" clipRule="evenodd" fill="#4AA73C" d="M43.155 32.227c.21.274.511.516.617.826a4498.887 4498.887 0 016.7 19.867c2.746 8.211 5.463 16.433 8.213 24.642 1.662 4.961 3.362 9.911 5.062 14.913l.765-.289-.171 2.426-.155.559c-.266 2.656-.49 5.318-.814 7.968-.163 1.328-.509 2.632-.772 3.947-.198-.287-.476-.548-.583-.866-5.467-16.297-10.918-32.6-16.376-48.9a3888.972 3888.972 0 00-5.242-15.551c-.089-.263-.34-.469-.516-.702l3.272-8.84z"/><path fillRule="evenodd" clipRule="evenodd" fill="#57AE47" d="M65.202 70.702l-.67.78c-.183-.391-.375-.714-.491-1.062-2.913-8.731-5.812-17.468-8.728-26.198a6167.476 6167.476 0 00-6.768-20.118c-.105-.314-.327-.588-.496-.879l6.055-7.965c.191.255.463.482.562.769 1.681 4.921 3.347 9.848 5.003 14.778 1.547 4.604 3.071 9.215 4.636 13.813.105.308.47.526.714.786l.012 1.045c.058 8.082.115 16.167.171 24.251z"/><path fillRule="evenodd" clipRule="evenodd" fill="#60B24F" d="M65.021 45.404c-.244-.26-.609-.478-.714-.786-1.565-4.598-3.089-9.209-4.636-13.813-1.656-4.93-3.322-9.856-5.003-14.778-.099-.287-.371-.514-.562-.769 1.969-1.928 3.877-3.925 5.925-5.764 1.821-1.634 3.285-3.386 3.352-5.968.003-.107.059-.214.145-.514l.519 1.306c-.013.661-.072 1.322-.029 1.979.075 1.143.259 2.28.311 3.423.096 2.127.142 4.258.185 6.388.069 3.428.132 6.856.175 10.285.067 5.478.111 10.956.18 16.434.008.861.098 1.718.152 2.577z"/><path fillRule="evenodd" clipRule="evenodd" fill="#A9AA88" d="M62.598 107.085c.263-1.315.609-2.62.772-3.947.325-2.649.548-5.312.814-7.968l.066-.01.066.011a41.402 41.402 0 001.394 9.838c-.176.232-.425.439-.518.701-.727 2.05-1.412 4.116-2.143 6.166-.1.28-.378.498-.574.744l-.747-2.566.87-2.969z"/><path fillRule="evenodd" clipRule="evenodd" fill="#B6B598" d="M62.476 112.621c.196-.246.475-.464.574-.744.731-2.05 1.417-4.115 2.143-6.166.093-.262.341-.469.518-.701l1.255 2.754c-.248.352-.59.669-.728 1.061l-2.404 7.059c-.099.283-.437.483-.663.722l-.695-3.985z"/><path fillRule="evenodd" clipRule="evenodd" fill="#C2C1A7" d="M63.171 116.605c.227-.238.564-.439.663-.722l2.404-7.059c.137-.391.48-.709.728-1.061l1.215 1.037c-.587.58-.913 1.25-.717 2.097l-.369 1.208c-.168.207-.411.387-.494.624-.839 2.403-1.64 4.819-2.485 7.222-.107.305-.404.544-.614.812-.109-1.387-.22-2.771-.331-4.158z"/><path fillRule="evenodd" clipRule="evenodd" fill="#CECDB7" d="M63.503 120.763c.209-.269.506-.508.614-.812.845-2.402 1.646-4.818 2.485-7.222.083-.236.325-.417.494-.624l-.509 5.545c-.136.157-.333.294-.398.477-.575 1.614-1.117 3.24-1.694 4.854-.119.333-.347.627-.525.938-.158-.207-.441-.407-.454-.623-.051-.841-.016-1.688-.013-2.533z"/><path fillRule="evenodd" clipRule="evenodd" fill="#DBDAC7" d="M63.969 123.919c.178-.312.406-.606.525-.938.578-1.613 1.119-3.239 1.694-4.854.065-.183.263-.319.398-.477l.012 3.64-1.218 3.124-1.411-.495z"/>
   <path fillRule="evenodd" clipRule="evenodd" fill="#EBE9DC" d="M65.38 124.415l1.218-3.124.251 3.696-1.469-.572z"/><path fillRule="evenodd" clipRule="evenodd" fill="#CECDB7" d="M67.464 110.898c-.196-.847.129-1.518.717-2.097l.337.23-1.054 1.867z"/><path fillRule="evenodd" clipRule="evenodd" fill="#4FAA41" d="M64.316 95.172l-.066-.011-.066.01.155-.559-.023.56z"/></svg>
  </div>
  <span className="text-white/80 text-sm">MongoDB</span>
</div>


              {/* typescript */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="#fff" d="M22.67 47h99.67v73.67H22.67z"/>
              <path data-name="original" fill="#007acc" d="M1.5 63.91v62.5h125v-125H1.5zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 00-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 00.54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 01-9.52-.1 23 23 0 01-12.72-6.63c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 011.15-.73L82 101l3.59-2.08.75 1.11a16.78 16.78 0 004.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 00.69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 01-3.43-6.25 25 25 0 01-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 019.49.26zm-29.34 5.24v5.12H56.66v46.23H45.15V69.26H28.88v-5a49.19 49.19 0 01.12-5.17C29.08 59 39 59 51 59h21.83z"/></svg>
              </div>
              <span className="text-white/80 text-sm">Typescript</span>
            </div>


              {/* Express.js */}
<div className="flex flex-col items-center group">
  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-12 h-12 md:w-16 md:h-16" fill="white">
      <path d="M126.67 98.44c-4.56 1.16-7.38.05-9.91-3.75-5.68-8.51-11.95-16.63-18-24.9-.78-1.07-1.59-2.12-2.6-3.45C89 76 81.85 85.2 75.14 94.77c-2.4 3.42-4.92 4.91-9.4 3.7l26.92-36.13L67.6 29.71c4.31-.84 7.29-.41 9.93 3.45 5.83 8.52 12.26 16.63 18.67 25.21 6.45-8.55 12.8-16.67 18.8-25.11 2.41-3.42 5-4.72 9.33-3.46-3.28 4.35-6.49 8.63-9.72 12.88-4.36 5.73-8.64 11.53-13.16 17.14-1.61 2-1.35 3.3.09 5.19C109.9 76 118.16 87.1 126.67 98.44zM1.33 61.74c.72-3.61 1.2-7.29 2.2-10.83 6-21.43 30.6-30.34 47.5-17.06C60.93 41.64 63.39 52.62 62.9 65H7.1c-.84 22.21 15.15 35.62 35.53 28.78 7.15-2.4 11.36-8 13.47-15 1.07-3.51 2.84-4.06 6.14-3.06-1.69 8.76-5.52 16.08-13.52 20.66-12 6.86-29.13 4.64-38.14-4.89C5.26 85.89 3 78.92 2 71.39c-.15-1.2-.46-2.38-.7-3.57q.03-3.04.03-6.08zm5.87-1.49h50.43c-.33-16.06-10.33-27.47-24-27.57-15-.12-25.78 11.02-26.43 27.57z"/>
    </svg>
  </div>
  <span className="text-white/80 text-sm">Express.js</span>
</div>


{/* postman */}<div className="flex flex-col items-center group">
  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300  p-2">
    {/* Postman SVG */}
    <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <path fill="#f37036" d="M113.117 26.066C92.168-1.062 53.191-6.07 26.062 14.883c-27.125 20.953-32.128 59.93-11.175 87.055 20.957 27.124 59.937 32.124 87.058 11.167 27.114-20.953 32.118-59.918 11.172-87.039Zm0 0"/>
    <path fill="#fff" d="M91.078 24.164a10.038 10.038 0 0 0-5.781 2.426 10.028 10.028 0 0 0-1.54 13.465 10.028 10.028 0 0 0 13.276 2.715h.002v.001l.156.155a10.63 10.63 0 0 0 1.965-1.45A10.341 10.341 0 0 0 99 27.107v-.002l-8.844 8.789-.156-.155 8.844-8.793a10.038 10.038 0 0 0-7.766-2.78zM79.434 38.551c-4.24-.007-11.163 4.799-28.067 21.703l.084.086c-.092-.032-.185-.035-.185-.035l-6.364 6.308a1.035 1.035 0 0 0 .93 1.762l10.914-2.328a.307.307 0 0 0 .092-.17l.242.25-3.72 3.69h-.18l-22.086 22.26 7.086 6.824a1.254 1.254 0 0 0 1.476.149 1.327 1.327 0 0 0 .645-1.356l-1.035-4.5a.534.534 0 0 1 0-.62 117.285 117.285 0 0 0 26.738-17.583l-4.535-4.537.086-.014-2.69-2.689.172-.174.182.186-.094.091 7.137 7.293v-.003c13.68-12.954 23.39-23.367 20.865-30.375a3.83 3.83 0 0 0-1.107-2.208v.004a3.778 3.778 0 0 0-.483-.306c-.083-.088-.156-.178-.244-.264l-.066.066a3.778 3.778 0 0 0-.582-.29l.289-.292c-1.796-1.6-3.28-2.924-5.5-2.93zM30.94 92.21l-5.171 5.172v.004a1.03 1.03 0 0 0-.457 1.125 1.035 1.035 0 0 0 .921.789l12.672.875-7.965-7.965z"/>
    <path fill="#f37036" d="M91.95 23.31a11.047 11.047 0 0 0-7.759 3.17 10.988 10.988 0 0 0-2.39 11.641c-4.741-2.03-11.155 1.51-31.106 21.457a.932.932 0 0 0-.037.094 1.242 1.242 0 0 0-.119.062l-6.309 6.364a1.97 1.97 0 0 0-.363 2.324 2.012 2.012 0 0 0 1.707.984l.313-.203 8.424-1.797-4.03 4.067a.873.873 0 0 0-.054.166l-19.75 19.799a.798.798 0 0 0-.192.238l-5.086 5.09a1.967 1.967 0 0 0-.414 2.043 1.995 1.995 0 0 0 1.656 1.265l12.618.88a1.01 1.01 0 0 0 .52-.415.886.886 0 0 0 0-1.035l-.026-.025a2.243 2.243 0 0 0 .705-.58 2.237 2.237 0 0 0 .406-1.876l-.984-4.187a126.725 126.725 0 0 0 26.334-16.861 1.091 1.091 0 0 0 .248.103c.254-.019.492-.128.672-.308 13.55-12.83 21.515-21.622 21.515-28.602a8.03 8.03 0 0 0-.431-2.85 10.957 10.957 0 0 0 3.845.83l-.015.004a11.219 11.219 0 0 0 5.183-1.45.775.775 0 0 0 .004.001.835.835 0 0 0 .617-.055 9.398 9.398 0 0 0 2.07-1.652 10.873 10.873 0 0 0 3.258-7.758 10.873 10.873 0 0 0-3.257-7.758.93.93 0 0 0-.118-.091 11.045 11.045 0 0 0-7.656-3.078zm-.087 1.772a9.27 9.27 0 0 1 5.586 1.914l-8.068 8.117a.84.84 0 0 0-.076.098.83.83 0 0 0-.239.55.832.832 0 0 0 .313.65h.002l6.1 6.1a9.044 9.044 0 0 1-10.028-1.913c-2.586-2.6-3.336-6.504-1.953-9.891 1.383-3.39 4.68-5.605 8.363-5.625zm7.12 3.432a8.87 8.87 0 0 1 2.033 5.674 9.15 9.15 0 0 1-2.688 6.464 9.989 9.989 0 0 1-1.098.895L92.307 36.7l-.963-.963.265-.265 7.373-6.96zm-.366 4.193a.777.777 0 0 0-.55.031.731.731 0 0 0-.36.426.73.73 0 0 0 .05.559 2.226 2.226 0 0 1-.257 2.328.64.64 0 0 0-.195.488c.004.184.07.36.195.492a.58.58 0 0 0 .414 0 .68.68 0 0 0 .672-.207 3.573 3.573 0 0 0 .465-3.777v.004a.777.777 0 0 0-.434-.344zM79.34 39.43a5.584 5.584 0 0 1 3.31 1.226 4.756 4.756 0 0 0-2.681 1.34L57.162 64.701l-4.476-4.476c11.828-11.772 19.06-17.921 23.556-19.936a5.584 5.584 0 0 1 3.098-.86zm3.965 2.96a2.895 2.895 0 0 1 2.043.844 2.786 2.786 0 0 1 .879 2.121 2.869 2.869 0 0 1-.985 2.07l-24.25 21.106-2.617-2.617 22.887-22.68a2.895 2.895 0 0 1 2.043-.843zm2.994 6.698c-1.69 6.702-10.647 15.783-19.987 24.607l-3.777-3.773L86.3 49.088zM51.367 61.547l.274.27 3.513 3.513-9.63 2.06 5.843-5.843zm5.793 5.84.004.004 1.168 1.195a1.086 1.086 0 0 0 .018.084l.078.012.248.254.82.84-5.385.66 3.05-3.05zm3.867 4.076 3.578 3.576A126.992 126.992 0 0 1 38.75 91.695a1.44 1.44 0 0 0-.777 1.653l1.035 4.5a.31.31 0 0 1 0 .363.31.31 0 0 1-.414 0l-6.102-6.152L51.3 72.975l9.728-1.512zm-29.933 21.94.869.814 4.492 4.492-10.016-.648 4.655-4.659z"/>
</svg>
  </div>
  <span className="text-white/80 text-sm">Postman</span>
</div>





           {/* Figma */}
<div className="flex flex-col items-center group">
  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-12 h-12 md:w-16 md:h-16">
      <path fill="#0acf83" d="M45.5 129c11.9 0 21.5-9.6 21.5-21.5V86H45.5C33.6 86 24 95.6 24 107.5S33.6 129 45.5 129zm0 0"/>
      <path fill="#a259ff" d="M24 64.5C24 52.6 33.6 43 45.5 43H67v43H45.5C33.6 86 24 76.4 24 64.5zm0 0"/>
      <path fill="#f24e1e" d="M24 21.5C24 9.6 33.6 0 45.5 0H67v43H45.5C33.6 43 24 33.4 24 21.5zm0 0"/>
      <path fill="#ff7262" d="M67 0h21.5C100.4 0 110 9.6 110 21.5S100.4 43 88.5 43H67zm0 0"/>
      <path fill="#1abcfe" d="M110 64.5c0 11.9-9.6 21.5-21.5 21.5S67 76.4 67 64.5 76.6 43 88.5 43 110 52.6 110 64.5zm0 0"/>
    </svg>
  </div>
  <span className="text-white/80 text-sm">Figma</span>
</div>


            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-10 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      <section className="relative py-20">
  <div className="container mx-auto px-4 sm:px-6 md:px-12 h-full flex flex-col justify-center">
    {/* Header */} {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 text-purple-400 mb-4">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-sm uppercase tracking-wider">My Journey</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
            Experience & Education
          </h2><br/>
          <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
            My professional journey and academic background that shaped my skills.
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 border border-gray-700 rounded-full bg-gray-800 shadow-md">
            <button
              className={`px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
                activeTab === "exp"
                  ? "bg-purple-600 text-white shadow-inner"
                  : "text-white/70 hover:text-white"
              }`}
              onClick={() => setActiveTab("exp")}
            >
              EXPERIENCE
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
                activeTab === "edu"
                  ? "bg-blue-600 text-white shadow-inner"
                  : "text-white/70 hover:text-white"
              }`}
              onClick={() => setActiveTab("edu")}
            >
              EDUCATION
            </button>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="max-w-4xl mx-auto w-full relative">
          {/* Vertical Line */}
          <div className="absolute left-0 sm:left-1/2 transform sm:-translate-x-1/2 h-full w-px bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-purple-500/50 pointer-events-none" />

          {/* Work Experience */}
          {activeTab === "exp" && (
            <div className="space-y-10 transition-all duration-500 animate-fade-in">
              {/* Experience Item */}
              <div className="relative flex flex-col sm:flex-row items-start">
                <div className="absolute left-0 sm:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full border-4 border-gray-900 z-10"></div>
                <div className="sm:w-1/2 sm:pr-12 sm:text-right ml-6 sm:ml-0">
                  <div className="bg-gray-900/50 border border-gray-800 hover:border-purple-500/30 p-6 rounded-lg transition-all duration-300">
                    <span className="text-purple-400 text-sm font-medium">Jan 27,2025 - May 05,2025</span>
                    <h3 className="text-xl font-bold mt-1 mb-2">Full Stack Developer</h3>
                    <p className="text-white/70">PalindromeLabs</p>
                    <p className="text-white/60 text-sm mt-2">
                    Developed a full-stack Hostel & Mess Management module using React,Express,Node.js and MongoDB.
                    Digitized room allocation, mess subscriptions, payments, and complaints with role-based access. </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Education */}
          {activeTab === "edu" && (
            <div className="space-y-10 transition-all duration-500 animate-fade-in">
              {/* Education Item 1 */}
              <div className="relative flex flex-col sm:flex-row items-start">
                <div className="absolute left-0 sm:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-900 z-10"></div>
                <div className="sm:w-1/2 sm:pr-12 sm:text-right ml-6 sm:ml-0">
                  <div className="bg-gray-900/50 border border-gray-800 hover:border-blue-500/30 p-6 rounded-lg transition-all duration-300">
                    <span className="text-blue-400 text-sm font-medium">2022 - 2025</span>
                    <h3 className="text-xl font-bold mt-1 mb-2">Bachelors of Computer Application </h3>
                    <p className="text-white/70">Kle Technological University</p>
                    <p className="text-white/60 text-sm mt-2">
                    Studied core computer science concepts including databases, software engineering, and full-stack development with practical application through academic projects.
                    </p>
                  </div>
                </div>
              </div>

              {/* Education Item 2 */}
              <div className="relative flex flex-col sm:flex-row items-start">
                <div className="absolute left-0 sm:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-900 z-10"></div>
                <div className="hidden sm:block sm:w-1/2"></div>
                <div className="sm:w-1/2 sm:pl-12 ml-6 sm:ml-0">
                  <div className="bg-gray-900/50 border border-gray-800 hover:border-blue-500/30 p-6 rounded-lg transition-all duration-300">
                    <span className="text-blue-400 text-sm font-medium">2020 - 2022</span>
                    <h3 className="text-xl font-bold mt-1 mb-2">Pre-University Course</h3>
                    <p className="text-white/70">Sanmarg Pu College</p>
                    <p className="text-white/60 text-sm mt-2">
                    Studied core commerce subjects including accountancy, business studies, and economics, building a strong analytical and management foundation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Education Item 3 */}
              <div className="relative flex flex-col sm:flex-row items-start">
                <div className="absolute left-0 sm:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-900 z-10"></div>
                <div className="sm:w-1/2 sm:pr-12 sm:text-right ml-6 sm:ml-0">
                  <div className="bg-gray-900/50 border border-gray-800 hover:border-blue-500/30 p-6 rounded-lg transition-all duration-300">
                    <span className="text-blue-400 text-sm font-medium">2010 - 2020</span>
                    <h3 className="text-xl font-bold mt-1 mb-2">Primary & Secondary Education</h3>
                    <p className="text-white/70">Loyola Convent School</p>
                    <p className="text-white/60 text-sm mt-2">
                    Built a strong academic foundation and developed skills in critical thinking, teamwork, and communication.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-10 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>
    </section>


    <section
  ref={contactRef}
  className="relative min-h-screen py-24 bg-gradient-to-b from-gray-950 to-gray-900 text-white"
>
  <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 items-center">
    {/* Left - Text Content */}
    <div className="space-y-8">
      <h2 className="text-4xl md:text-5xl font-bold leading-tight">
        Let's Connect
      </h2>
      <p className="text-lg text-white/70 leading-relaxed">
        Have a project in mind or just want to say hello? I'd love to hear from you.
        Whether it's a collaboration, idea, or feedback — let's make it happen.
      </p>

      <div className="space-y-4">
      <a
        href="https://mail.google.com/mail/?view=cm&to=itzsamii6980@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl font-bold hover:text-purple-400 transition duration-300 group inline-block"
      >
        itzsamii6980@gmail.com
        <div className="h-0.5 bg-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </a>

        {/* <div className="flex space-x-4 mt-4 text-white/60">
          <a
            href="https://www.instagram.com"
            target="_blank"
            className="hover:text-pink-400 transition"
          >
            Instagram
          </a>
          <a
            href="https://in.linkedin.com/in/mohammedsami01"
            target="_blank"
            className="hover:text-blue-400 transition"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com"
            target="_blank"
            className="hover:text-gray-300 transition"
          >
            GitHub
          </a>
        </div> */}
      </div>
    </div>

    {/* Right - Contact Box / CTA */}
    <div className="bg-gray-800/40 p-8 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur">
      <h3 className="text-2xl font-semibold mb-6 text-white">
        Drop a Message
      </h3>
      <form
  action="https://formspree.io/f/xqalpyly"  // <-- Replace this
  method="POST"
  className="space-y-4"
>
  <input
    type="text"
    name="name"
    placeholder="Your Name"
    required
    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
  <input
    type="email"
    name="email"
    placeholder="Your Email"
    required
    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
  <textarea
    name="message"
    placeholder="Your Message"
    rows={4}
    required
    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
  ></textarea>
  <button
    type="submit"
    className="w-full bg-purple-600 hover:bg-purple-700 transition font-medium py-3 px-6 rounded-lg text-white"
  >
    Send Message
  </button>
</form>

    </div>
  </div>

  {/* Soft Background Circles */}
  <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
  <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
</section>


      {/* Easter Egg Modal */}
      {showEasterEgg && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowEasterEgg(false)}
        >
          <div className="bg-gray-900 p-8 rounded-lg border border-purple-500 max-w-md mx-4">
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-2xl font-bold mb-4">🎉 Easter Egg Found!</h3>
              <p className="text-white/70 mb-4">
                Congratulations! You discovered a hidden feature. You're clearly someone who pays attention to detail!
              </p>
              <Button onClick={() => setShowEasterEgg(false)} className="bg-purple-600 hover:bg-purple-700">
                Awesome!
              </Button>
            </div>
          </div>
          
        </div>
      )}
      </div>
    </>
  );
}
