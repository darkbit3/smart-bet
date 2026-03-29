import { Settings, User, Lock, LogOut, ScrollText, Plus, Gift, MessageSquare, History } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/UserContext";
import { useToast } from "../../components/ToastContainer";

export default function AccountSettings() {
  const { state: authState, logout } = useAuth();
  const user = authState.user;
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const menuItems = [
    { icon: User, label: "My Account", id: "profile" },
    { icon: ScrollText, label: "Bet History", id: "history" },
    { icon: Plus, label: "Deposit", id: "deposit" },
    { icon: Gift, label: "Bonuses", id: "bonuses" },
    { icon: MessageSquare, label: "Messages", id: "messages" },
    { icon: History, label: "Account History", id: "accounthistory" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.showError("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.showError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.showError("Password must be at least 8 characters long");
      return;
    }

    setIsUpdating(true);
    try {
      // TODO: Implement password change API
      console.log("📨 Would change password for:", user?.phone_number);
      
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast.showSuccess("Password changed successfully!");
    } catch (error: any) {
      toast.showError(error.message || "Failed to change password");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = () => {
    logout();
    toast.showSuccess("Signed out successfully");
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center text-2xl font-bold text-[#121212]">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <div className="text-xl font-bold text-white">{user?.username || "kaleab2"}</div>
              <div className="text-sm text-gray-400">VIP Level: Gold</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
              <input
                type="text"
                value={user?.username || "kaleab2"}
                disabled
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
              <input
                type="text"
                value={user?.phone_number || "N/A"}
                disabled
                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <User className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showNewPassword ? <User className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
            />
          </div>
          <button
            onClick={handleChangePassword}
            disabled={isUpdating}
            className="bg-[#FFD700] hover:bg-[#FFC700] text-[#121212] px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Change Password
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderComingSoon = (title: string) => (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
      <div className="mb-8">
        <Settings className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400 mb-4">Coming soon...</p>
        <p className="text-sm text-gray-400">
          We're working hard to bring you this feature.
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile": return renderProfile();
      case "history": return renderComingSoon("Bet History");
      case "deposit": return renderComingSoon("Deposit");
      case "bonuses": return renderComingSoon("Bonuses");
      case "messages": return renderComingSoon("Messages");
      case "accounthistory": return renderComingSoon("Account History");
      case "settings": return renderComingSoon("Settings");
      default: return renderProfile();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Account</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Account Navigation */}
        <div className="lg:w-80">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
            {/* User Info Header */}
            <div className="p-3 border-b border-[#2A2A2A]">
              <div className="text-sm text-white font-semibold">{user?.username || "kaleab2"}</div>
              <div className="text-xs text-gray-400">VIP Level: Gold</div>
            </div>
            
            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                      activeTab === item.id
                        ? "bg-[#FFD700] text-[#121212]"
                        : "text-white hover:bg-[#2A2A2A]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
            
            {/* Sign Out */}
            <div className="border-t border-[#2A2A2A] mt-1 pt-1">
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#2A2A2A] transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
