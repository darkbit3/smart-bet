import { useEffect, useState } from "react";
import { Lock, Eye, EyeOff, X } from "lucide-react";
import { useToast } from "../../components/ToastContainer";
import { useAuth } from "../../contexts/UserContext";
import { useNavigate } from "react-router";

interface LoginProps {
  isOpen: boolean;
  initialMode?: "login" | "register";
  onClose: () => void;
  onSuccess: (username: string) => void;
}

export default function Login({ isOpen, initialMode = "login", onClose, onSuccess }: LoginProps) {
  const toast = useToast();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [authError, setAuthError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [registerAttempts, setRegisterAttempts] = useState(0);
  const [lockoutExpiry, setLockoutExpiry] = useState<number | null>(null);
  const [isLoginLocked, setIsLoginLocked] = useState(false);
  const [isRegisterLocked, setIsRegisterLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isResetMode, setIsResetMode] = useState(false);
  const [resetStep, setResetStep] = useState<'phone' | 'otp' | 'new' | 'done'>('phone');
  const [resetPhone, setResetPhone] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetError, setResetError] = useState('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (!lockoutExpiry) return;
    const remaining = lockoutExpiry - Date.now();
    if (remaining <= 0) {
      setIsLoginLocked(false);
      setIsRegisterLocked(false);
      setLockoutExpiry(null);
      setAuthError("");
      setLoginAttempts(0);
      setRegisterAttempts(0);
      return;
    }
    const timer = window.setTimeout(() => {
      setIsLoginLocked(false);
      setIsRegisterLocked(false);
      setLockoutExpiry(null);
      setAuthError("");
      setLoginAttempts(0);
      setRegisterAttempts(0);
    }, remaining);
    return () => window.clearTimeout(timer);
  }, [lockoutExpiry]);

  // Register form states
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerReferralCode, setRegisterReferralCode] = useState("");
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [isOver18, setIsOver18] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [registerPhoneError, setRegisterPhoneError] = useState("");

  // Real-time validation states
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "too_short">("idle");
  const [phoneStatus, setPhoneStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");

  const normalizePhoneInput = (value: string) => value.replace(/\D/g, "");

  const isValidLocalPhone = (digits: string) => {
    return digits.length === 9 && (digits.startsWith("9") || digits.startsWith("7"));
  };

  const evaluatePasswordStrength = (password: string) => {
    if (password.length === 0) return { text: "", color: "" };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { text: "Weak", color: "text-red-400" };
    if (score <= 4) return { text: "Medium", color: "text-yellow-400" };
    return { text: "Strong", color: "text-green-400" };
  };

  const toInternationalPhone = (digits: string) => {
    // For 9-digit format, just add +251 prefix
    return "+251" + digits;
  };

  // Check username availability when typing
  useEffect(() => {
    if (mode !== "register" || registerUsername.trim().length === 0) {
      setUsernameStatus("idle");
      return;
    }
    
    if (registerUsername.trim().length < 5) {
      setUsernameStatus("too_short");
      return;
    }
    
    // Real API call for availability check
    const timer = setTimeout(async () => {
      setUsernameStatus("checking");
      try {
        console.log('🔍 Login Modal - Checking username availability:', registerUsername.trim());
        const response = await fetch(`http://localhost:3000/api/availability/username/${encodeURIComponent(registerUsername.trim())}`);
        const data = await response.json();
        console.log('🔍 Login Modal - Username check response:', data);
        
        if (data.success && data.data) {
          const isAvailable = data.data.available;
          console.log('🔍 Login Modal - Username availability result:', { 
            username: registerUsername.trim(), 
            available: isAvailable 
          });
          setUsernameStatus(isAvailable ? "available" : "taken");
        } else {
          console.log('🔍 Login Modal - Username check failed:', data);
          setUsernameStatus("idle");
        }
      } catch (error) {
        console.error('❌ Login Modal - Username check error:', error);
        setUsernameStatus("idle");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [registerUsername, mode]);

  // Check phone number availability when typing
  useEffect(() => {
    if (mode !== "register" || registerPhone.trim().length === 0) {
      setPhoneStatus("idle");
      return;
    }
    
    const digits = normalizePhoneInput(registerPhone);
    
    // Check if it's a valid Ethiopian phone number
    if (!isValidLocalPhone(digits)) {
      setPhoneStatus("invalid");
      return;
    }
    
    // Only check availability if phone number is valid
    if (digits.length === 9) {
      const timer = setTimeout(async () => {
        setPhoneStatus("checking");
        try {
          const internationalPhone = toInternationalPhone(digits);
          console.log('🔍 Login Modal - Checking phone availability:', internationalPhone);
          const response = await fetch(`http://localhost:3000/api/availability/phone/${encodeURIComponent(internationalPhone)}`);
          const data = await response.json();
          console.log('🔍 Login Modal - Phone check response:', data);
          
          if (data.success && data.data) {
            const isAvailable = data.data.available;
            console.log('🔍 Login Modal - Phone availability result:', { 
              phone: internationalPhone, 
              available: isAvailable 
            });
            setPhoneStatus(isAvailable ? "available" : "taken");
          } else {
            console.log('🔍 Login Modal - Phone check failed:', data);
            setPhoneStatus("idle");
          }
        } catch (error) {
          console.error('❌ Login Modal - Phone check error:', error);
          setPhoneStatus("idle");
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setPhoneStatus("idle");
    }
  }, [registerPhone, mode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoginLocked) {
      setAuthError("Too many login attempts. Please wait 5 minutes and try again.");
      return;
    }

    const digits = normalizePhoneInput(phoneNumber);
    if (!isValidLocalPhone(digits)) {
      setPhoneError("Enter a valid 9-digit Ethiopian number starting with 9 or 7.");
      return;
    }
    setPhoneError("");

    if (!password || password.length < 6) {
      const next = loginAttempts + 1;
      setLoginAttempts(next);
      if (next >= 5) {
        const ttl = Date.now() + 5 * 60 * 1000;
        setIsLoginLocked(true);
        setIsRegisterLocked(true);
        setLockoutExpiry(ttl);
        setAuthError("Account temporarily locked due to repeated login attempts. Try again in 5 minutes.");
      } else {
        setAuthError("Password must be at least 6 characters long.");
      }
      return;
    }

    setIsLoading(true);
    setAuthError("");
    try {
      const formatted = toInternationalPhone(digits);
      console.log('Attempting login with:', { phone_number: formatted, hasPassword: !!password });
      
      // Use UserContext login method
      await login(formatted, password);
      
      toast.showSuccess('Login successful! Welcome back!', 3000);
      
      // Reset login attempts
      setLoginAttempts(0);
      setRegisterAttempts(0);
      setIsLoginLocked(false);
      setIsRegisterLocked(false);
      setLockoutExpiry(null);
      setAuthError("");

      onSuccess(formatted); // Pass phone number as username for compatibility
      onClose();
      navigate("/"); // Navigate to home page after successful login
    } catch (error: any) {
      const next = loginAttempts + 1;
      setLoginAttempts(next);
      if (next >= 5) {
        const ttl = Date.now() + 5 * 60 * 1000;
        setIsLoginLocked(true);
        setIsRegisterLocked(true);
        setLockoutExpiry(ttl);
        setAuthError("Account temporarily locked due to repeated failed attempts. Try again in 5 minutes.");
      } else {
        setAuthError(error.message || "Login failed. Please try again.");
      }
      toast.showError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const initiateReset = () => {
    setIsResetMode(true);
    setResetStep('phone');
    setResetPhone('');
    setResetOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
    setResetError('');
  };

  const sendResetOtp = () => {
    const digits = normalizePhoneInput(resetPhone);
    if (!isValidLocalPhone(digits)) {
      setResetError("Enter a valid phone for password reset.");
      return;
    }
    setResetError('');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(code);
    setResetStep('otp');
    console.log(`Reset OTP for ${digits}: ${code}`); // in production this is sent by SMS API
    toast.showInfo(`OTP sent to ${digits}`);
  };

  const verifyResetOtp = () => {
    if (resetOtp !== sentOtp) {
      setResetError('Incorrect OTP, please recheck.');
      return;
    }
    setResetError('');
    setResetStep('new');
  };

  const submitNewPassword = () => {
    if (newPassword.length < 8) {
      setResetError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match.');
      return;
    }
    setResetError('');
    
    // Here you would call an API to update the password
    toast.showSuccess('Password reset successful!');
    setIsResetMode(false);
    setResetStep('done');
    setAuthError('Password reset successful. Please login.');
    setMode('login');
    setPassword('');
    setResetPhone('');
    setResetOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegisterLocked) {
      setAuthError("Too many attempts. Registration temporarily blocked for 5 minutes.");
      return;
    }

    // Validate username
    if (!registerUsername.trim()) {
      toast.showError("Username is required");
      return;
    }

    if (registerUsername.length < 5) {
      toast.showError("Username must be at least 5 characters");
      return;
    }

    if (usernameStatus === "taken") {
      toast.showError("Username is already taken. Please choose another.");
      return;
    }

    if (usernameStatus === "too_short") {
      toast.showError("Username must be at least 5 characters");
      return;
    }

    const digits = normalizePhoneInput(registerPhone);
    if (!isValidLocalPhone(digits)) {
      setRegisterPhoneError("Enter a valid 9-digit Ethiopian phone number starting with 9 or 7.");
      return;
    }
    
    if (phoneStatus === "taken") {
      setRegisterPhoneError("Phone number is already registered. Please use another.");
      return;
    }
    
    setRegisterPhoneError("");

    // Password validation
    if (registerPassword.length < 6) {
      toast.showError("Password must be at least 6 characters");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      const next = registerAttempts + 1;
      setRegisterAttempts(next);
      if (next >= 5) {
        const ttl = Date.now() + 5 * 60 * 1000;
        setIsLoginLocked(true);
        setIsRegisterLocked(true);
        setLockoutExpiry(ttl);
        setAuthError("Account temporarily locked due to repeated failed attempts. Try again in 5 minutes.");
      } else {
        toast.showError("Passwords do not match!");
      }
      return;
    }

    const strength = evaluatePasswordStrength(registerPassword);
    if (strength.text === "Weak") {
      toast.showError("Password is too weak. Please use a stronger password.");
      return;
    }

    if (!agreePolicy) {
      toast.showError("Please agree to Terms & Conditions");
      return;
    }
    if (!isOver18) {
      toast.showError("You must be 18 or older to register");
      return;
    }

    setIsLoading(true);
    setAuthError("");

    try {
      const formatted = toInternationalPhone(digits);
      console.log('Attempting registration with:', {
        username: registerUsername,
        phone_number: formatted,
        hasPassword: !!registerPassword,
        referral_code: registerReferralCode.trim() || undefined
      });
      
      // Use UserContext register method
      await register({
        username: registerUsername,
        phone_number: formatted,
        password: registerPassword,
        confirm_password: registerConfirmPassword,
        referral_code: registerReferralCode.trim() || undefined
      });
      
      console.log('Registration completed successfully');
      toast.showSuccess('Registration successful! Welcome to Smart Bet!', 3000);
      
      // Reset form and state
      setLoginAttempts(0);
      setRegisterAttempts(0);
      setIsLoginLocked(false);
      setIsRegisterLocked(false);
      setLockoutExpiry(null);
      setAuthError("");

      setPhoneNumber(registerPhone);
      setRegisterUsername("");
      setRegisterPhone("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
      setRegisterReferralCode("");
      setIsOver18(false);
      
      onSuccess(registerUsername);
      onClose();
      navigate("/"); // Navigate to home page after successful registration
    } catch (error: any) {
      const next = registerAttempts + 1;
      setRegisterAttempts(next);
      
      // Handle specific error messages
      let errorMessage = "Registration failed. Please try again.";
      if (error.message) {
        if (error.message.includes("Username already exists")) {
          errorMessage = "Username is already taken. Please choose another username.";
        } else if (error.message.includes("Phone number already exists")) {
          errorMessage = "Phone number is already registered. Please use another number.";
        } else if (error.message.includes("weak password")) {
          errorMessage = "Password is too weak. Please choose a stronger password.";
        } else {
          errorMessage = error.message;
        }
      }
      
      if (next >= 5) {
        const ttl = Date.now() + 5 * 60 * 1000;
        setIsLoginLocked(true);
        setIsRegisterLocked(true);
        setLockoutExpiry(ttl);
        setAuthError("Account temporarily locked due to repeated failed attempts. Try again in 5 minutes.");
      } else {
        setAuthError(errorMessage);
      }
      toast.showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-[#121212] w-full max-w-md rounded-2xl border border-[#2A2A2A] shadow-xl overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
          <h2 className="text-xl font-bold text-white">Smart Bet</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 p-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-lg ${mode === "login" ? "bg-[#FFD700] text-[#121212]" : "bg-[#1A1A1A] text-white"}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg ${mode === "register" ? "bg-[#FFD700] text-[#121212]" : "bg-[#1A1A1A] text-white"}`}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {/* Error Message */}
        {authError && (
          <div className="mx-4 mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg relative">
            <p className="text-red-400 text-sm">{authError}</p>
            <button
              onClick={() => {
                setAuthError("");
              }}
              className="absolute top-2 right-2 text-red-400 hover:text-red-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-4">
          {isResetMode ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Reset Password</h3>
              {resetError && <p className="text-red-300 text-sm">{resetError}</p>}
              {resetStep === 'phone' && (
                <>
                  <label className="block text-sm font-medium text-gray-400">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 flex items-center gap-1">
                      🇪🇹
                      <strong>+251</strong>
                    </span>
                    <input
                      type="tel"
                      value={resetPhone}
                      onChange={(e) => setResetPhone(normalizePhoneInput(e.target.value))}
                      placeholder="9XXXXXXXX"
                      maxLength={9}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg pl-24 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={sendResetOtp}
                    className="w-full mt-2 bg-[#FFD700] text-[#121212] px-4 py-2 rounded-lg font-semibold"
                  >
                    Send OTP
                  </button>
                </>
              )}

              {resetStep === 'otp' && (
                <>
                  <label className="block text-sm font-medium text-gray-400">Enter OTP</label>
                  <input
                    type="text"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    maxLength={6}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                    placeholder="6-digit code"
                  />
                  <button
                    type="button"
                    onClick={verifyResetOtp}
                    className="w-full mt-2 bg-[#FFD700] text-[#121212] px-4 py-2 rounded-lg font-semibold"
                  >
                    Verify OTP
                  </button>
                </>
              )}

              {resetStep === 'new' && (
                <>
                  <label className="block text-sm font-medium text-gray-400">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                  />
                  <label className="block text-sm font-medium text-gray-400 mt-3">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={submitNewPassword}
                    className="w-full mt-2 bg-[#FFD700] text-[#121212] px-4 py-2 rounded-lg font-semibold"
                  >
                    Reset Password
                  </button>
                </>
              )}

              <div className="text-center text-xs text-gray-400">
                <button type="button" onClick={() => { setIsResetMode(false); setResetStep('phone'); setResetError(''); }} className="underline">Back to login/register</button>
              </div>
            </div>
          ) : mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 flex items-center gap-1">
                    🇪🇹
                    <strong>+251</strong>
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      const digits = normalizePhoneInput(e.target.value);
                      setPhoneNumber(digits);
                    }}
                    placeholder="9XXXXXXXX"
                    maxLength={9}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg pl-24 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                    autoFocus
                  />
                </div>
                {phoneError && <p className="mt-1 text-xs text-red-400">{phoneError}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    maxLength={15}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg pl-11 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={initiateReset}
                  className="mt-2 text-sm text-[#FFD700] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={!phoneNumber || !password || isLoading}
                className={`w-full py-3 rounded-lg font-semibold text-lg transition-all ${
                  phoneNumber && password && !isLoading
                    ? "bg-[#FFD700] text-[#121212] hover:bg-[#FFC700]"
                    : "bg-[#2A2A2A] text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  placeholder=""
                  required
                  className={`w-full bg-[#1A1A1A] border ${usernameStatus === 'taken' || usernameStatus === 'too_short' ? 'border-red-500' : usernameStatus === 'available' ? 'border-green-500' : 'border-[#2A2A2A]'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors peer`}
                />
                <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#FFD700] peer-valid:top-1 peer-valid:text-xs peer-valid:text-[#FFD700] pointer-events-none">Username</label>
                {usernameStatus === "checking" && <p className="mt-1 text-xs text-yellow-500">Checking availability...</p>}
                {usernameStatus === "available" && <p className="mt-1 text-xs text-green-500">Username is available!</p>}
                {usernameStatus === "taken" && <p className="mt-1 text-xs text-red-500">Username is already taken.</p>}
                {usernameStatus === "too_short" && <p className="mt-1 text-xs text-red-500">Username must be at least 5 characters.</p>}
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 flex items-center gap-1 z-10">
                  🇪🇹
                  <strong>+251</strong>
                </span>
                <input
                  type="tel"
                  value={registerPhone}
                  onChange={(e) => {
                    const digits = normalizePhoneInput(e.target.value);
                    setRegisterPhone(digits);
                  }}
                  placeholder=""
                  maxLength={9}
                  required
                  className={`w-full bg-[#121212] border ${phoneStatus === 'taken' || phoneStatus === 'invalid' || registerPhoneError ? 'border-red-500' : phoneStatus === 'available' ? 'border-green-500' : 'border-[#2A2A2A]'} rounded-lg pl-24 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors peer`}
                />
                <label className="absolute left-24 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#FFD700] peer-valid:top-1 peer-valid:text-xs peer-valid:text-[#FFD700] pointer-events-none">Phone Number</label>
                {registerPhoneError && <p className="mt-1 text-xs text-red-500">{registerPhoneError}</p>}
                {phoneStatus === "checking" && <p className="mt-1 text-xs text-yellow-500">Checking phone number...</p>}
                {phoneStatus === "available" && <p className="mt-1 text-xs text-green-500">Phone number is available!</p>}
                {phoneStatus === "taken" && <p className="mt-1 text-xs text-red-500">Phone number is already registered.</p>}
                {phoneStatus === "invalid" && <p className="mt-1 text-xs text-red-500">Enter a valid Ethiopian phone number.</p>}
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                <input
                  type={showRegPassword ? "text" : "password"}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder=""
                  required
                  maxLength={15}
                  className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg pl-11 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors peer"
                />
                <label className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#FFD700] peer-valid:top-1 peer-valid:text-xs peer-valid:text-[#FFD700] pointer-events-none">Password</label>
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showRegPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {registerPassword.length > 0 && (
                  <p className="mt-1 text-sm">
                    Password strength: <span className={evaluatePasswordStrength(registerPassword).color}>{evaluatePasswordStrength(registerPassword).text}</span>
                  </p>
                )}
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                <input
                  type={showRegConfirmPassword ? "text" : "password"}
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  placeholder=""
                  required
                  maxLength={15}
                  className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg pl-11 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors peer"
                />
                <label className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#FFD700] peer-valid:top-1 peer-valid:text-xs peer-valid:text-[#FFD700] pointer-events-none">Confirm Password</label>
                <button
                  type="button"
                  onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showRegConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={registerReferralCode}
                  onChange={(e) => setRegisterReferralCode(e.target.value)}
                  placeholder=""
                  className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors peer"
                />
                <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#FFD700] peer-valid:top-1 peer-valid:text-xs peer-valid:text-[#FFD700] pointer-events-none">Referral Code (optional)</label>
              </div>

              <div className="flex flex-col gap-2 text-sm text-gray-400">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={agreePolicy} onChange={(e) => setAgreePolicy(e.target.checked)} className="w-4 h-4" />
                  <span>I agree to the Terms & Conditions</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={isOver18} onChange={(e) => setIsOver18(e.target.checked)} className="w-4 h-4" />
                  <span>I am 18 years or older</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors ${
                  isLoading
                    ? "bg-[#2A2A2A] text-gray-500 cursor-not-allowed"
                    : "bg-[#FFD700] text-[#121212] hover:bg-[#FFC700]"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Register"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}