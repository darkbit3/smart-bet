import { useState } from "react";
import { Eye, EyeOff, User, Lock, Phone, Gift, CheckCircle } from "lucide-react";
import { useToast } from "../../components/ToastContainer";

interface PlayerRegisterProps {
  onSuccess?: (user: any) => void;
  onClose?: () => void;
}

export default function PlayerRegister({ onSuccess, onClose }: PlayerRegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referralInfo, setReferralInfo] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });
  
  const toast = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleReferralCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.trim();
    setReferralCode(code);
    setError("");

    if (code) {
      try {
        // Check referral code validity (without using it yet)
        const response = await fetch(`http://localhost:3000/api/player/referral-check?code=${code}`);
        const data = await response.json();
        
        if (data.success) {
          setReferralInfo({
            valid: true,
            bonus_amount: data.data.bonus_amount,
            message: data.data.message
          });
        } else {
          setReferralInfo({
            valid: false,
            message: data.message
          });
        }
      } catch (error) {
        console.error('Referral check error:', error);
        setReferralInfo(null);
      }
    } else {
      setReferralInfo(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Client-side validation
    if (!formData.username || !formData.phone_number || !formData.password) {
      const errorMsg = 'Please fill in all required fields';
      setError(errorMsg);
      toast.showError(errorMsg);
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirm_password) {
      const errorMsg = 'Passwords do not match';
      setError(errorMsg);
      toast.showError(errorMsg);
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      const errorMsg = 'Password must be at least 6 characters long';
      setError(errorMsg);
      toast.showError(errorMsg);
      setIsLoading(false);
      return;
    }

    console.log('Submitting registration:', {
      username: formData.username,
      phone_number: formData.phone_number,
      hasPassword: !!formData.password,
      referral_code: referralCode.trim() || undefined
    });

    try {
      // TODO: Implement registration API when available
      console.log('📨 Would register player:', formData.username);
      
      // Simulate successful registration for now
      setTimeout(() => {
        setIsLoading(false);
        toast.showSuccess('Registration successful! Please check your phone for verification.');
        onSuccess?.({ username: formData.username, phone_number: formData.phone_number });
        onClose?.();
      }, 2000);
    } catch (error: any) {
      setIsLoading(false);
      toast.showError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-[#FFD700]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Create Player Account
            </h2>
            <p className="text-gray-400">
              Join the betting platform with referral bonuses
            </p>
          </div>

          {/* Referral Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Referral Code (Optional)
            </label>
            <div className="relative">
              <Gift className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={referralCode}
                onChange={handleReferralCodeChange}
                placeholder="Enter referral code"
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
              />
            </div>
            
            {referralInfo && (
              <div className={`mt-2 p-3 rounded-lg text-sm ${
                referralInfo.valid 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                  : 'bg-red-500/20 border border-red-500/30 text-red-400'
              }`}>
                {referralInfo.valid ? (
                  <>
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    <span>{referralInfo.message}</span>
                  </>
                ) : (
                  <span>{referralInfo.message}</span>
                )}
              </div>
            )}
          </div>

          {/* Registration Form */}
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
                  className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                  placeholder="Choose username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                  placeholder="Create password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FFD700] hover:bg-[#FFC700] disabled:bg-gray-600 text-[#121212] font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Close Button */}
          {onClose && (
            <div className="mt-4 text-center">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
