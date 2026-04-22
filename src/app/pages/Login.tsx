import { useEffect, useState } from "react";
import { Lock, Eye, EyeOff, X } from "lucide-react";
import { useToast } from "../../components/ToastContainer";
import { useAuth } from "../../contexts/UserContext";
import { useNavigate } from "react-router";
import { useFormRateLimiter } from "../../utils/useFormRateLimiter";

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
  const [mode, setMode] = useState<"login" | "register" | "register-otp">(initialMode);
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

  const loginLimiter = useFormRateLimiter({ maxAttempts: 5, lockoutMinutes: 5, cooldownSeconds: 3 });
  const registerLimiter = useFormRateLimiter({ maxAttempts: 5, lockoutMinutes: 5, cooldownSeconds: 3 });

  const isSubmitting = isLoading || loginLimiter.isSubmitting || registerLimiter.isSubmitting;

  const [isResetMode, setIsResetMode] = useState(false);
  const [resetStep, setResetStep] = useState<'phone' | 'otp' | 'new' | 'done' | 'telegram'>('phone');
  const [resetPhone, setResetPhone] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Registration OTP states
  const [registerOtp, setRegisterOtp] = useState('');
  const [registerResendTimer, setRegisterResendTimer] = useState(0);
  const [isRegisterResending, setIsRegisterResending] = useState(false);
  const [registerOtpError, setRegisterOtpError] = useState('');
  const [tempRegisterData, setTempRegisterData] = useState<any>(null);

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
    
    const timer = setTimeout(async () => {
      setUsernameStatus("checking");
      try {
        console.log('🔍 Login Modal - Checking username availability:', registerUsername.trim());
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/availability/username/${encodeURIComponent(registerUsername.trim())}`);
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
    
    if (!isValidLocalPhone(digits)) {
      setPhoneStatus("invalid");
      return;
    }
    
    if (digits.length === 9) {
      const timer = setTimeout(async () => {
        setPhoneStatus("checking");
        try {
          const internationalPhone = toInternationalPhone(digits);
          console.log('🔍 Login Modal - Checking phone availability:', internationalPhone);
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/availability/phone/${encodeURIComponent(internationalPhone)}`);
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

  // Resend timer effect
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Registration resend timer effect
  useEffect(() => {
    if (registerResendTimer > 0) {
      const timer = setTimeout(() => setRegisterResendTimer(registerResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [registerResendTimer]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loginLimiter.isLocked) {
      setAuthError(`Too many wrong attempts. Try again in ${Math.ceil(loginLimiter.lockoutRemainingMs / 1000)} seconds.`);
      return;
    }

    if (loginLimiter.cooldownRemainingMs > 0) {
      setAuthError(`Wait ${Math.ceil(loginLimiter.cooldownRemainingMs / 1000)}s before submitting again.`);
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
      loginLimiter.trySubmit(async () => {});
      return;
    }

    setIsLoading(true);
    setAuthError("");

    try {
      await loginLimiter.trySubmit(async () => {
        const formatted = toInternationalPhone(digits);
        console.log('Attempting login with:', { phone_number: formatted, hasPassword: !!password });
        await login(formatted, password);
      });

      toast.showSuccess('Login successful! Welcome back!', 3000);

      setLoginAttempts(0);
      setRegisterAttempts(0);
      setIsLoginLocked(false);
      setIsRegisterLocked(false);
      setLockoutExpiry(null);
      setAuthError("");

      onSuccess(toInternationalPhone(digits));
      onClose();
      navigate("/");
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

  const sendResetOtp = async () => {
    const digits = normalizePhoneInput(resetPhone);
    if (!isValidLocalPhone(digits)) {
      setResetError("Enter a valid phone for password reset.");
      return;
    }
    
    const formattedPhone = resetPhone.startsWith('+') ? resetPhone : `+251${digits}`;
    
    setResetError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/player-reset-password/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone
        })
      });

      const result = await response.json();

      if (result.success) {
        setResetStep('otp');
        setResendTimer(60); // Start 60 second countdown
        toast.showInfo(`OTP sent to ${formattedPhone}`);
        console.log(`Reset OTP requested for ${formattedPhone}: ${result.data?.resetCode}`);
      } else {
        if (result.data?.requiresTelegramRegistration) {
          setResetError(result.message || 'Phone number not registered with Telegram');
          setResetStep('telegram');
          toast.showError('Please register your phone number with Telegram first');
        } else {
          setResetError(result.message || 'Failed to send OTP');
          toast.showError(result.message || 'Failed to send OTP');
        }
      }
    } catch (error) {
      console.error('Send reset OTP error:', error);
      setResetError('Failed to send OTP');
      toast.showError('Failed to send OTP');
    }
  };

  const verifyResetOtp = async () => {
    if (!resetOtp || resetOtp.length !== 6) {
      setResetError('Please enter a valid 6-digit OTP');
      return;
    }
    
    const digits = normalizePhoneInput(resetPhone);
    const formattedPhone = resetPhone.startsWith('+') ? resetPhone : `+251${digits}`;
    
    setResetError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/player-reset-password/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          resetCode: resetOtp
        })
      });

      const result = await response.json();

      if (result.success) {
        setResetStep('new');
        toast.showSuccess('OTP verified successfully!');
      } else {
        setResetError(result.message || 'Invalid OTP');
        toast.showError(result.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setResetError('Failed to verify OTP');
      toast.showError('Failed to verify OTP');
    }
  };

  const resendOtp = async () => {
    setIsResending(true);
    await sendResetOtp();
    setIsResending(false);
  };

  const submitNewPassword = async () => {
    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setResetError('Passwords do not match.');
      return;
    }
    
    const digits = normalizePhoneInput(resetPhone);
    const formattedPhone = resetPhone.startsWith('+') ? resetPhone : `+251${digits}`;
    
    setResetError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/player-reset-password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          resetCode: resetOtp,
          newPassword: newPassword
        })
      });

      const result = await response.json();

      if (result.success) {
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
      } else {
        setResetError(result.message || 'Failed to reset password');
        toast.showError(result.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setResetError('Failed to reset password');
      toast.showError('Failed to reset password');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerLimiter.isLocked) {
      setAuthError(`Too many attempts. Try again in ${Math.ceil(registerLimiter.lockoutRemainingMs / 1000)} seconds.`);
      return;
    }

    if (registerLimiter.cooldownRemainingMs > 0) {
      setAuthError(`Please wait ${Math.ceil(registerLimiter.cooldownRemainingMs / 1000)}s before submitting again.`);
      return;
    }

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

    if (registerPassword.length < 6) {
      toast.showError("Password must be at least 6 characters");
      registerLimiter.trySubmit(async () => {});
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
      registerLimiter.trySubmit(async () => {});
      return;
    }

    const strength = evaluatePasswordStrength(registerPassword);
    if (strength.text === "Weak") {
      toast.showError("Password is too weak. Please use a stronger password.");
      registerLimiter.trySubmit(async () => {});
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

    const formattedPhone = toInternationalPhone(digits);
    const registrationData = {
      username: registerUsername,
      phone_number: formattedPhone,
      password: registerPassword,
      confirm_password: registerConfirmPassword,
      referral_code: registerReferralCode.trim() || undefined
    };
    
    setIsLoading(true);
    setAuthError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/registration/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      const result = await response.json();

      if (result.success) {
        setTempRegisterData(registrationData);
        setMode('register-otp');
        setRegisterResendTimer(60);
        toast.showInfo(`Registration code sent to ${formattedPhone}`);
      } else {
        if (result.data?.requiresTelegramRegistration) {
          setTempRegisterData(registrationData);
          setMode('register-otp');
          setRegisterResendTimer(60);
          setRegisterOtpError('Phone number not registered with Telegram. Please register with Telegram first.');
          toast.showInfo('Please register your phone number with Telegram first using the button below.');
        } else {
          setAuthError(result.message || 'Failed to send registration code');
          toast.showError(result.message || 'Failed to send registration code');
        }
      }
    } catch (error) {
      console.error('Request registration OTP error:', error);
      setAuthError('Failed to send registration code');
      toast.showError('Failed to send registration code');
    } finally {
      setIsLoading(false);
    }
  };

  const sendRegistrationOtp = async () => {
    if (!tempRegisterData) return;
    
    setIsLoading(true);
    setRegisterOtpError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/registration/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tempRegisterData)
      });

      const result = await response.json();

      if (result.success) {
        setRegisterResendTimer(60);
        toast.showInfo(`Registration code resent to ${tempRegisterData.phone_number}`);
      } else {
        setRegisterOtpError(result.message || 'Failed to resend code');
        toast.showError(result.message || 'Failed to resend code');
      }
    } catch (error) {
      console.error('Resend registration OTP error:', error);
      setRegisterOtpError('Failed to resend code');
      toast.showError('Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyRegistrationOtp = async () => {
    if (!registerOtp || registerOtp.length !== 6) {
      setRegisterOtpError('Please enter a valid 6-digit code');
      return;
    }
    
    if (!tempRegisterData) {
      setRegisterOtpError('Registration data not found');
      return;
    }
    
    setIsLoading(true);
    setRegisterOtpError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/registration/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: tempRegisterData.phone_number,
          registrationCode: registerOtp
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.showSuccess('Registration completed successfully!');
        
        // Reset all registration states
        setRegisterUsername("");
        setRegisterPhone("");
        setRegisterPassword("");
        setRegisterConfirmPassword("");
        setRegisterReferralCode("");
        setAgreePolicy(false);
        setIsOver18(false);
        setRegisterOtp('');
        setTempRegisterData(null);
        setRegisterOtpError('');
        
        // Switch to login mode
        setMode('login');
        setAuthError('Registration successful! Please login.');
        onSuccess(result.data.username);
      } else {
        setRegisterOtpError(result.message || 'Invalid registration code');
        toast.showError(result.message || 'Invalid registration code');
      }
    } catch (error) {
      console.error('Verify registration OTP error:', error);
      setRegisterOtpError('Failed to verify code');
      toast.showError('Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const resendRegistrationOtp = async () => {
    setIsRegisterResending(true);
    await sendRegistrationOtp();
    setIsRegisterResending(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-modern p-4 animate-fade-in" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="modal-content-modern w-full max-w-md overflow-auto max-h-[90vh] hover-lift scrollbar-modern">
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
          <h2 className="text-xl font-bold text-white">Smart Bet</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

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

        {loginLimiter.isLocked && (
          <div className="mx-4 mb-4 p-3 bg-orange-500/20 border border-orange-400 rounded-lg">
            <p className="text-orange-300 text-sm">Login locked: wait {Math.ceil(loginLimiter.lockoutRemainingMs / 1000)} seconds.</p>
          </div>
        )}

        {loginLimiter.cooldownRemainingMs > 0 && (
          <div className="mx-4 mb-4 p-3 bg-yellow-500/20 border border-yellow-400 rounded-lg">
            <p className="text-yellow-300 text-sm">Please wait {Math.ceil(loginLimiter.cooldownRemainingMs / 1000)} seconds before retrying.</p>
          </div>
        )}

        {registerLimiter.isLocked && (
          <div className="mx-4 mb-4 p-3 bg-orange-500/20 border border-orange-400 rounded-lg">
            <p className="text-orange-300 text-sm">Registration locked: wait {Math.ceil(registerLimiter.lockoutRemainingMs / 1000)} seconds.</p>
          </div>
        )}

        {registerLimiter.cooldownRemainingMs > 0 && (
          <div className="mx-4 mb-4 p-3 bg-yellow-500/20 border border-yellow-400 rounded-lg">
            <p className="text-yellow-300 text-sm">Please wait {Math.ceil(registerLimiter.cooldownRemainingMs / 1000)} seconds before retrying.</p>
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
                      className="input-modern w-full pl-24 pr-4 py-3 focus-modern"
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
                    className="input-modern w-full px-4 py-3 focus-modern"
                    placeholder="6-digit code"
                  />
                  <button
                    type="button"
                    onClick={verifyResetOtp}
                    className="w-full mt-2 bg-[#FFD700] text-[#121212] px-4 py-2 rounded-lg font-semibold"
                  >
                    Verify OTP
                  </button>
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={resendTimer > 0 || isResending}
                    className={`w-full mt-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                      resendTimer > 0 || isResending
                        ? "bg-[#2A2A2A] text-gray-500 cursor-not-allowed"
                        : "bg-[#1A1A1A] text-white hover:bg-[#333333]"
                    }`}
                  >
                    {isResending ? "Sending..." : resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                  </button>
                  <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
                    <button
                      type="button"
                      onClick={() => window.open('https://t.me/Smart_bet_ethiopia_bot', '_blank')}
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9.78 18.65l.28-4.23 7.68 6.92 4.25-7.32L9.78 18.65zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.28 0 .5-.22.5-.5s-.22-.5-.5-.5h-6c-.28 0-.5.22-.5.5s.22.5.5.5h6z"/>
                      </svg>
                      Go to Telegram Bot
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-2">
                      Bot: @Smart_bet_ethiopia_bot
                    </p>
                    <p className="text-xs text-gray-400 text-center mt-1">
                      Click the button above, then select "Start" and share your phone number
                    </p>
                  </div>
                </>
              )}

              {resetStep === 'telegram' && (
                <>
                  <div className="text-center space-y-4">
                    <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
                      <h4 className="text-green-400 font-semibold mb-2">Phone Number Not Registered</h4>
                      <p className="text-white text-sm mb-4">
                        Your phone number is not linked to our Telegram bot. Please follow these steps:
                      </p>
                      <ol className="text-white text-sm text-left space-y-2">
                        <li>1. Click the button below to open Telegram</li>
                        <li>2. Start the bot: @Smart_bet_ethiopia_bot</li>
                        <li>3. Click "Share Phone Number" button</li>
                        <li>4. Return here and try again</li>
                      </ol>
                    </div>
                    <button
                      type="button"
                      onClick={() => window.open('https://t.me/Smart_bet_ethiopia_bot', '_blank')}
                      className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9.78 18.65l.28-4.23 7.68 6.92 4.25-7.32L9.78 18.65zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.28 0 .5-.22.5-.5s-.22-.5-.5-.5h-6c-.28 0-.5.22-.5.5s.22.5.5.5h6z"/>
                      </svg>
                      Start Bot and Share Phone Number
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setResetStep('phone');
                        setResetError('');
                      }}
                      className="w-full mt-2 bg-[#FFD700] text-[#121212] px-4 py-2 rounded-lg font-semibold"
                    >
                      Back to Phone Entry
                    </button>
                  </div>
                </>
              )}

              {resetStep === 'new' && (
                <>
                  <label className="block text-sm font-medium text-gray-400">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-modern w-full px-4 py-3 pr-12 focus-modern"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <label className="block text-sm font-medium text-gray-400 mt-3">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="input-modern w-full px-4 py-3 pr-12 focus-modern"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
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
          ) : mode === "register-otp" ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Verify Phone Number</h3>
              <p className="text-gray-400 text-sm">We need to verify your phone number to complete registration</p>
              
              {tempRegisterData && (
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3">
                  <p className="text-white text-sm">Phone: {tempRegisterData.phone_number}</p>
                  <p className="text-white text-sm">Username: {tempRegisterData.username}</p>
                </div>
              )}
              
              {registerOtpError && <p className="text-red-300 text-sm">{registerOtpError}</p>}
              
              <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => window.open('https://t.me/Smart_bet_ethiopia_bot', '_blank')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.78 18.65l.28-4.23 7.68 6.92 4.25-7.32L9.78 18.65zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.28 0 .5-.22.5-.5s-.22-.5-.5-.5h-6c-.28 0-.5.22-.5.5s.22.5.5.5h6z"/>
                  </svg>
                  Go to Telegram Bot
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">
                  Bot: @Smart_bet_ethiopia_bot
                </p>
                <p className="text-xs text-gray-400 text-center mt-1">
                  Click the button above, select "Start" and share your phone number
                </p>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-400">Enter OTP</label>
                <input
                  type="text"
                  value={registerOtp}
                  onChange={(e) => setRegisterOtp(e.target.value)}
                  maxLength={6}
                  className="input-modern w-full px-4 py-3 focus-modern"
                  placeholder="6-digit code from Telegram"
                />
                <button
                  type="button"
                  onClick={verifyRegistrationOtp}
                  className="w-full mt-2 bg-[#FFD700] text-[#121212] px-4 py-2 rounded-lg font-semibold"
                >
                  Verify & Complete Registration
                </button>
                <button
                  type="button"
                  onClick={resendRegistrationOtp}
                  disabled={registerResendTimer > 0 || isRegisterResending || isLoading}
                  className={`w-full mt-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
                    registerResendTimer > 0 || isRegisterResending || isLoading
                      ? "bg-[#2A2A2A] text-gray-500 cursor-not-allowed opacity-60"
                      : "bg-[#1A1A1A] text-white hover:bg-[#333333] active:scale-[0.98]"
                  }`}
                >
                  {(isRegisterResending || isLoading) ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent border-r-transparent animate-spin rounded-full mr-2"></div>
                      Sending...
                    </>
                  ) : registerResendTimer > 0 ? (
                    `Resend in ${registerResendTimer}s`
                  ) : (
                    "Resend Code"
                  )}
                </button>
              </div>
              
              <div className="text-center text-xs text-gray-400">
                <button 
                  type="button" 
                  onClick={() => { 
                    setMode('register'); 
                    setRegisterOtp(''); 
                    setRegisterOtpError(''); 
                    setTempRegisterData(null); 
                  }} 
                  className="underline"
                >
                  Back to registration form
                </button>
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
                    className="input-modern w-full pl-24 pr-4 py-3 focus-modern"
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
                    className="input-modern w-full pl-11 pr-12 py-3 focus-modern"
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
                  onClick={() => {
                    setIsResetMode(true);
                    setResetStep('phone');
                  }}
                  className="mt-2 text-sm text-[#FFD700] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={!phoneNumber || !password || isSubmitting}
                className={`w-full py-3 rounded-lg font-semibold text-lg transition-all ${
                  phoneNumber && password && !isSubmitting
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
                  className={`input-modern w-full px-4 py-3 peer focus-modern ${usernameStatus === 'taken' || usernameStatus === 'too_short' ? 'border-red-500' : usernameStatus === 'available' ? 'border-green-500' : ''}`}
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
                  className={`input-modern w-full pl-24 pr-4 py-3 peer focus-modern ${phoneStatus === 'taken' || phoneStatus === 'invalid' || registerPhoneError ? 'border-red-500' : phoneStatus === 'available' ? 'border-green-500' : ''}`}
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
                  className="input-modern w-full pl-11 pr-12 py-3 peer focus-modern"
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
                  className="input-modern w-full pl-11 pr-12 py-3 peer focus-modern"
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
                  className="input-modern w-full px-4 py-3 peer focus-modern"
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
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors ${
                  isSubmitting
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