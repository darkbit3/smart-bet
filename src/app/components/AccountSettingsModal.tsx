import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/UserContext";
import { useToast } from "../../components/ToastContainer";
import UserService from "../../services/user.service";
import { PasswordService } from "../../services/password.service";

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountSettingsModal({
  isOpen,
  onClose,
}: AccountSettingsModalProps) {
  const { state: authState, logout } = useAuth();
  const user = authState.user;
  const toast = useToast();

  const [activeTab, setActiveTab] = useState("profile");
  const [isUpdating, setIsUpdating] = useState(false);

  // Username
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");

  const [usernameValidation, setUsernameValidation] = useState({
    available: null as boolean | null,
    message: "",
    checking: false,
  });

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordValidation, setPasswordValidation] = useState({
    passwordsMatch: false,
    strength: "",
    message: "",
  });

  // Prevent unused variable warnings
  console.debug('AccountSettingsModal state:', { isUpdating, passwordValidation });

  // ===============================
  // ✅ USERNAME VALIDATION (FIXED)
  // ===============================
  useEffect(() => {
    if (!isEditingUsername || !newUsername.trim()) {
      setUsernameValidation({
        available: null,
        message: "",
        checking: false,
      });
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameValidation((prev) => ({ ...prev, checking: true }));

      try {
        const result =
          await UserService.checkUsernameAvailability(newUsername);

        setUsernameValidation({
          available: result.available,
          message: result.message,
          checking: false,
        });
      } catch {
        setUsernameValidation({
          available: false,
          message: "Error checking username",
          checking: false,
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [newUsername, isEditingUsername]);

  // ===============================
  // PASSWORD VALIDATION
  // ===============================
  useEffect(() => {
    if (!newPassword) return;

    const match = newPassword === confirmPassword;

    setPasswordValidation({
      passwordsMatch: match,
      strength:
        newPassword.length < 6
          ? "Weak"
          : newPassword.length < 10
          ? "Medium"
          : "Strong",
      message: match ? "Passwords match" : "Passwords do not match",
    });
  }, [newPassword, confirmPassword]);

  // ===============================
  // CHANGE USERNAME
  // ===============================
  const handleChangeUsername = async () => {
    if (!usernameValidation.available) {
      toast.showError("Username not available");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await UserService.changeUsername(newUsername);

      if (res.success) {
        toast.showSuccess("Username updated!");
        setIsEditingUsername(false);
      } else {
        toast.showError(res.message);
      }
    } catch (err: any) {
      toast.showError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // ===============================
  // CHANGE PASSWORD
  // ===============================
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.showError("Passwords do not match");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await PasswordService.changePassword(
        currentPassword,
        newPassword,
        user?.phone_number || ""
      );

      if (res.success) {
        toast.showSuccess("Password changed");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.showError(res.message);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // ===============================
  // MAIN RENDER
  // ===============================
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="modal-modern w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b border-[#2A2A2A]">
          <h2 className="text-white text-xl font-bold">My Account</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-[#2A2A2A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-[#2A2A2A]">
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "text-[#FFD700] border-b-2 border-[#FFD700] bg-[#1A1A1A]"
                : "text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
            }`}
          >
            Profile Information
          </button>
          <button 
            onClick={() => setActiveTab("password")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "password"
                ? "text-[#FFD700] border-b-2 border-[#FFD700] bg-[#1A1A1A]"
                : "text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
            }`}
          >
            Change Password
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Enter new username"
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                    {usernameValidation.message && (
                      <div className={`mt-2 text-sm px-3 py-2 rounded ${
                        usernameValidation.available === true 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {usernameValidation.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                    <input
                      type="text"
                      value={user?.phone_number || ""}
                      disabled
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleChangeUsername}
                  disabled={isUpdating || !usernameValidation.available}
                  className="mt-4 w-full bg-[#FFD700] hover:bg-[#FFC700] text-[#121212] px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Updating..." : "Save Username"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div className="space-y-4">
              <div className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                    />
                    {passwordValidation.message && (
                      <div className={`mt-2 text-sm px-3 py-2 rounded ${
                        passwordValidation.passwordsMatch 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {passwordValidation.message}
                      </div>
                    )}
                  </div>
                </div>
                <button 
                  onClick={handleChangePassword}
                  disabled={isUpdating}
                  className="mt-4 w-full bg-[#FFD700] hover:bg-[#FFC700] text-[#121212] px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Updating..." : "Change Password"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <div className="p-4 border-t border-[#2A2A2A]">
          <button 
            onClick={logout} 
            className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}