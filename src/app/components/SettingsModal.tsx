import { useState, useEffect } from "react";
import { X, Mail, MessageSquare, Globe, Sun, Moon, Send } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeSection, setActiveSection] = useState<"contact" | "language" | "theme">("contact");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    // Load settings from localStorage
    const savedTheme = localStorage.getItem("smartbet_theme") as "dark" | "light" | null;
    const savedLanguage = localStorage.getItem("smartbet_language");

    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const applyTheme = (newTheme: "dark" | "light") => {
    if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("smartbet_theme", newTheme);
    applyTheme(newTheme);
  };

  const saveLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("smartbet_language", newLanguage);
  };

  if (!isOpen) return null;

  const sections = [
    { id: "contact" as const, label: "Contact Support", icon: MessageSquare },
    { id: "language" as const, label: "Language", icon: Globe },
    { id: "theme" as const, label: "Theme", icon: theme === "dark" ? Moon : Sun },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-[#121212] w-full max-w-2xl rounded-2xl border border-[#2A2A2A] shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sections */}
        <div className="flex border-b border-[#2A2A2A]">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeSection === section.id
                    ? "bg-[#FFD700] text-[#121212]"
                    : "text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Section Content */}
        <div className="p-6">
          {activeSection === "contact" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Contact Support</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-[#1A1A1A] rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-2">Get in Touch</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Need help? Our support team is here to assist you 24/7.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Mail className="w-4 h-4" />
                      <span>Email: support@smartbet.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MessageSquare className="w-4 h-4" />
                      <span>Live Chat: Available 24/7</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Send us a Message</h4>
                  
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-400">Subject</label>
                    <select className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FFD700]">
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Account Issues</option>
                      <option>Payment Problems</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm text-gray-400">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Describe your issue or question..."
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] resize-none"
                    />
                  </div>

                  <button className="w-full bg-[#FFD700] text-[#121212] py-3 rounded-lg font-bold hover:bg-[#FFC700] transition-colors flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "language" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Language Settings</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-[#1A1A1A] rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-4">Select Language</h4>
                  
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-400">Preferred Language</label>
                    <select
                      value={language}
                      onChange={(e) => saveLanguage(e.target.value)}
                      className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FFD700]"
                    >
                      <option>English</option>
                      <option>አማርኛ (Amharic)</option>
                      <option>العربية (Arabic)</option>
                      <option>Français (French)</option>
                      <option>Español (Spanish)</option>
                      <option>Deutsch (German)</option>
                    </select>
                  </div>

                  <div className="mt-4 p-3 bg-[#2A2A2A] rounded-lg">
                    <p className="text-sm text-gray-300">
                      <strong>Note:</strong> Language change will take effect after refreshing the page.
                    </p>
                  </div>
                </div>
              </div>

              <button onClick={() => saveLanguage(language)} className="w-full bg-[#FFD700] text-[#121212] py-3 rounded-lg font-bold hover:bg-[#FFC700] transition-colors">
                Save Language
              </button>
            </div>
          )}

          {activeSection === "theme" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Theme Settings</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-[#1A1A1A] rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-4">Choose Theme</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {theme === "dark" ? (
                        <Moon className="w-6 h-6 text-[#FFD700]" />
                      ) : (
                        <Sun className="w-6 h-6 text-[#FFD700]" />
                      )}
                      <div>
                        <div className="text-white font-medium">
                          {theme === "dark" ? "Dark Theme" : "Light Theme"}
                        </div>
                        <div className="text-sm text-gray-400">
                          {theme === "dark" ? "Easy on the eyes in low light" : "Bright and clean interface"}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={toggleTheme}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        theme === "dark" ? "bg-[#FFD700]" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          theme === "dark" ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-[#2A2A2A] rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-2">Theme Preview</h4>
                  <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-[#121212]" : "bg-gray-100"}`}>
                    <div className={`text-sm ${theme === "dark" ? "text-white" : "text-black"}`}>
                      This is how text will look in {theme} theme.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Apply and Save Buttons */}
        <div className="flex gap-3 p-6 border-t border-[#2A2A2A]">
          <button
            onClick={() => {
              // Apply all current settings
              applyTheme(theme);
              saveLanguage(language);
              // Could add more apply logic here
            }}
            className="flex-1 bg-[#1A1A1A] text-white py-3 rounded-lg font-bold hover:bg-[#2A2A2A] transition-colors border border-[#2A2A2A]"
          >
            Apply Changes
          </button>
          <button
            onClick={() => {
              // Save all settings to localStorage
              localStorage.setItem("smartbet_theme", theme);
              localStorage.setItem("smartbet_language", language);
              // Could show a success message
            }}
            className="flex-1 bg-[#FFD700] text-[#121212] py-3 rounded-lg font-bold hover:bg-[#FFC700] transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}