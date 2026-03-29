import { useState } from "react";
import { Eye, EyeOff, User, Lock, Phone, Mail } from "lucide-react";
import { useToast } from "../../components/ToastContainer";

interface SimpleAuthProps {
  onSuccess?: (user: any) => void;
  onClose?: () => void;
}

export default function SimpleAuth({ onSuccess, onClose }: SimpleAuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        // TODO: Implement login API when available
        console.log('📨 Would login user:', formData.username);
        
        // Simulate successful login for now
        setTimeout(() => {
          setIsLoading(false);
          toast.showSuccess('Login successful!');
          onSuccess?.({ username: formData.username, phone_number: formData.phone_number });
          onClose?.();
        }, 1000);
        
      } else {
        // TODO: Implement registration API when available
        console.log('📨 Would register user:', formData.username);
        
        // Simulate successful registration for now
        setTimeout(() => {
          setIsLoading(false);
          toast.showSuccess('Registration successful!');
          onSuccess?.({ username: formData.username, phone_number: formData.phone_number });
          onClose?.();
        }, 1000);
      }
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message);
      toast.showError(error.message);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-[#FFD700]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-400">
              {isLogin ? "Login to your account" : "Register for a new account"}
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
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
                  placeholder="Enter username"
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
                  placeholder="Enter password"
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

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                      placeholder="Last name"
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
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                      placeholder="Email address"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FFD700] hover:bg-[#FFC700] disabled:bg-gray-600 text-[#121212] font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                isLogin ? "Login" : "Register"
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={switchMode}
                className="ml-2 text-[#FFD700] hover:text-[#FFC700] font-semibold transition-colors"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </div>

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
