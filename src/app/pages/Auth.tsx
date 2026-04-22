import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/UserContext";
import { authAPI } from "../../services/auth.service";
import { Eye, EyeOff, User, Lock, Phone, Gift, X } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: boolean;
    phone_number?: boolean;
    password?: boolean;
    referral_code?: boolean;
  }>({});
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirm_password: "",
    phone_number: "",
    referral_code: "",
  });

  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "too_short" | "invalid">("idle");
  const [phoneStatus, setPhoneStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");

  const { login, register, isLoading, error, clearError, user, isAuthenticated } = useAuth();

  // Check username and phone availability when typing in Register mode
  useEffect(() => {
    console.log('🔍 useEffect triggered - isLogin:', isLogin, 'username:', formData.username.trim(), 'phone:', formData.phone_number.trim());
    
    if (isLogin || (formData.username.trim().length === 0 && formData.phone_number.trim().length === 0)) {
      console.log('🔍 useEffect returning early - isLogin:', isLogin, 'both fields empty:', formData.username.trim().length === 0 && formData.phone_number.trim().length === 0);
      setUsernameStatus("idle");
      setPhoneStatus("idle");
      return;
    }
    
    console.log('🔍 useEffect continuing with availability check');
    
    // Set individual statuses based on validation
    let currentUsernameStatus: "idle" | "checking" | "available" | "taken" | "too_short" | "invalid" = "idle";
    let currentPhoneStatus: "idle" | "checking" | "available" | "taken" | "invalid" = "idle";
    
    if (formData.username.trim().length > 0) {
      if (formData.username.trim().length < 3) {
        currentUsernameStatus = "too_short";
      } else if (!formData.username.match(/^[a-zA-Z0-9_]{3,30}$/)) {
        currentUsernameStatus = "invalid";
      }
    }
    
    if (formData.phone_number.trim().length > 0) {
      const phoneRegex = /^\+2519\d{8}$|^09\d{8}$/;
      if (!phoneRegex.test(formData.phone_number.trim())) {
        currentPhoneStatus = "invalid";
      }
    }
    
    // Debounced API call for combined check
    const timer = setTimeout(async () => {
      const hasValidUsername = formData.username.trim().length >= 3 && formData.username.match(/^[a-zA-Z0-9_]{3,30}$/);
      const hasValidPhone = /^\+2519\d{8}$|^09\d{8}$/.test(formData.phone_number.trim());
      
      if (hasValidUsername || hasValidPhone) {
        // Set checking status
        if (hasValidUsername) setUsernameStatus("checking");
        if (hasValidPhone) setPhoneStatus("checking");
        
        try {
          console.log('🔍 Frontend - Checking availability:', { 
            username: formData.username.trim(), 
            phone_number: formData.phone_number.trim() 
          });
          
          console.log('🔍 Frontend - Before API call - Username:', formData.username.trim(), 'hasValidUsername:', hasValidUsername);
          console.log('🔍 Frontend - Before API call - Phone:', formData.phone_number.trim(), 'hasValidPhone:', hasValidPhone);
          
          const response = await authAPI.checkAvailability(
            hasValidUsername ? formData.username.trim() : undefined,
            hasValidPhone ? formData.phone_number.trim() : undefined
          );
          
          console.log('🔍 Frontend - Availability check response:', response);
          console.log('🔍 Frontend - Response data:', JSON.stringify(response.data, null, 2));
          console.log('🔍 Frontend - Response success:', response.success);
          console.log('🔍 Frontend - Response data exists:', !!response.data);
          console.log('🔍 Frontend - Response data.username:', response.data?.username);
          
          if (response.success && response.data) {
            // Update username status if checked
            if (response.data.username && hasValidUsername) {
              const isAvailable = response.data.username.available;
              console.log('🔍 Frontend - Username availability result:', { 
                username: formData.username.trim(), 
                available: isAvailable,
                responseUsername: response.data.username
              });
              console.log('🔍 Frontend - About to setUsernameStatus to:', isAvailable ? "available" : "taken");
              setUsernameStatus(isAvailable ? "available" : "taken");
              console.log('🔍 Frontend - setUsernameStatus called for username');
            }
            
            // Update phone status if checked
            if (response.data.phone_number && hasValidPhone) {
              const isAvailable = response.data.phone_number.available;
              console.log('🔍 Frontend - Phone availability result:', { 
                phone_number: formData.phone_number.trim(), 
                available: isAvailable 
              });
              setPhoneStatus(isAvailable ? "available" : "taken");
            }
          } else {
            console.log('🔍 Frontend - Availability check failed:', response);
            console.log('🔍 Frontend - Response success:', response.success);
            console.log('🔍 Frontend - Response data exists:', !!response.data);
            if (hasValidUsername) setUsernameStatus(currentUsernameStatus);
            if (hasValidPhone) setPhoneStatus(currentPhoneStatus);
          }
        } catch (error) {
          console.error('❌ Frontend - Availability check error:', error);
          console.log('🔍 Frontend - Falling back to current status for username:', currentUsernameStatus);
          if (hasValidUsername) setUsernameStatus(currentUsernameStatus);
          if (hasValidPhone) setPhoneStatus(currentPhoneStatus);
        }
      } else {
        // Set validation statuses if not valid
        if (formData.username.trim().length > 0) {
          setUsernameStatus(currentUsernameStatus);
        }
        if (formData.phone_number.trim().length > 0) {
          setPhoneStatus(currentPhoneStatus);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username, formData.phone_number, isLogin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    // Clear field errors
    setFieldErrors({});

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
      } else {
        await register(formData);
      }
    } catch (error) {
      // Error is already handled by the auth context
      // But we can also handle field highlighting here
      const errorMessage = (error as any)?.message || '';
      
      // Highlight fields based on error message
      if (errorMessage.includes('already taken') || errorMessage.includes('Username is already taken')) {
        setFieldErrors({ username: true });
        // Blink the username field
        setTimeout(() => setFieldErrors({}), 3000);
      } else if (errorMessage.includes('already registered') || errorMessage.includes('Phone number is already registered')) {
        setFieldErrors({ phone_number: true });
        // Blink the phone field
        setTimeout(() => setFieldErrors({}), 3000);
      } else if (errorMessage.includes('password') || errorMessage.includes('too short')) {
        setFieldErrors({ password: true });
        // Blink the password field
        setTimeout(() => setFieldErrors({}), 3000);
      } else if (errorMessage.includes('referral')) {
        setFieldErrors({ referral_code: true });
        // Blink the referral field
        setTimeout(() => setFieldErrors({}), 3000);
      }
    }
  };

  // If already authenticated, show user info
  if (isAuthenticated && user) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back!</h2>
            <p className="text-muted-foreground">{user.username}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Balance:</span>
              <span className="text-primary font-bold">${(user.non_withdrawable + user.withdrawable + user.bonus_balance).toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "Login" : "Register"}
          </h2>
          <p className="text-gray-400">
            {isLogin ? "Welcome back to Smart Betting" : "Create your account"}
          </p>
        </div>

        {error && (
          <div className={`mb-4 border rounded-lg p-3 ${
            error.includes('already taken') || error.includes('already registered') 
              ? 'bg-red-500/20 border-red-500/30' 
              : error.includes('must be') || error.includes('Invalid') || error.includes('too short')
              ? 'bg-yellow-500/20 border-yellow-500/30'
              : 'bg-red-500/20 border-red-500/30'
          }`}>
            <div className="flex items-start gap-2">
              {error.includes('already taken') || error.includes('already registered') ? (
                <User className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              ) : error.includes('must be') || error.includes('Invalid') || error.includes('too short') ? (
                <Lock className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              )}
              <p className={`text-sm ${
                error.includes('already taken') || error.includes('already registered')
                  ? 'text-red-400'
                  : error.includes('must be') || error.includes('Invalid') || error.includes('too short')
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className={`w-full bg-muted border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder-muted-foreground/50 focus:outline-none transition-all duration-300 ${
                  fieldErrors.username 
                    ? 'border-destructive animate-pulse bg-destructive/10' 
                    : !isLogin && (usernameStatus === 'taken' || usernameStatus === 'too_short' || usernameStatus === 'invalid')
                    ? 'border-destructive'
                    : !isLogin && usernameStatus === 'available'
                    ? 'border-success'
                    : 'border-border focus:border-primary focus:ring-1 focus:ring-primary/50'
                }`}
                placeholder="Enter username"
              />
            </div>
            {!isLogin && usernameStatus === "checking" && <p className="text-yellow-500 text-xs mt-1">Checking availability...</p>}
            {!isLogin && usernameStatus === "available" && <p className="text-green-500 text-xs mt-1">Username is available!</p>}
            {!isLogin && usernameStatus === "taken" && <p className="text-red-500 text-xs mt-1">Username is already taken.</p>}
            {!isLogin && usernameStatus === "too_short" && <p className="text-red-500 text-xs mt-1">Username must be at least 3 characters.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full bg-muted border border-border rounded-lg pl-10 pr-12 py-3 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-muted border border-border rounded-lg pl-10 pr-12 py-3 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                    className={`w-full bg-muted border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder-muted-foreground/50 focus:outline-none transition-all duration-300 ${
                      fieldErrors.phone_number 
                        ? 'border-destructive animate-pulse bg-destructive/10' 
                        : phoneStatus === 'taken' || phoneStatus === 'invalid'
                        ? 'border-destructive'
                        : phoneStatus === 'available'
                        ? 'border-success'
                        : 'border-border focus:border-primary focus:ring-1 focus:ring-primary/50'
                    }`}
                    placeholder="Phone number"
                  />
                </div>
                {phoneStatus === "checking" && <p className="text-yellow-500 text-xs mt-1">Checking phone number...</p>}
                {phoneStatus === "available" && <p className="text-green-500 text-xs mt-1">Phone number is available!</p>}
                {phoneStatus === "taken" && <p className="text-red-500 text-xs mt-1">Phone number is already registered.</p>}
                {phoneStatus === "invalid" && <p className="text-red-500 text-xs mt-1">Please enter a valid phone number (min 10 digits).</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Referral Code (Optional)
                </label>
                <div className="relative">
                  <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="referral_code"
                    value={formData.referral_code}
                    onChange={handleInputChange}
                    className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                    placeholder="Enter referral code"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-primary-foreground font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              isLogin ? "Login" : "Register"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                clearError();
                setFormData({
                  username: "",
                  password: "",
                  confirm_password: "",
                  phone_number: "",
                  referral_code: "",
                });
              }}
              className="ml-2 text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
