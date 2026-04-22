import { User, Wallet, History, Settings, Award, LogOut, ChevronRight, CreditCard, Shield, X, Edit2, User as UserIcon, Phone, Mail, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/UserContext";
import { useToast } from "../../components/ToastContainer";
import { Badge } from "../components/ui/badge";

export default function Profile() {
  const { state: authState, login, logout, register } = useAuth();
  const user = authState.user;
  const isAuthenticated = authState.isAuthenticated;
  const toast = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshingUser, setRefreshingUser] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [accountHistory, setAccountHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Fetch fresh user data when profile tab opens
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) return;
      
      setRefreshingUser(true);
      try {
        const tokens = localStorage.getItem('authTokens');
        if (!tokens) {
          throw new Error('No authentication token found');
        }
        const parsedTokens = JSON.parse(tokens);

        // TODO: Implement get current user API when available
        console.log('📨 Would fetch current user data');
      } catch (error: any) {
        toast.showError(error.message || 'Failed to load profile data');
      } finally {
        setRefreshingUser(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  const stats = [
    { label: "Total Wagered", value: "$12,847.50", icon: Wallet, color: "text-primary" },
    { label: "Total Won", value: "$8,542.30", icon: Award, color: "text-success" },
    { label: "Bets Placed", value: "1,247", icon: History, color: "text-info" },
    { label: "Win Rate", value: "58.3%", icon: Award, color: "text-purple-500" },
  ];

  const menuItems = [
    { icon: User, label: "Personal Information", description: "Manage your account details" },
    { icon: Wallet, label: "Wallet & Transactions", description: "View balance and history" },
    { icon: CreditCard, label: "Payment Methods", description: "Add or remove payment options" },
    { icon: Award, label: "VIP Status", description: "Track your rewards and level" },
    { icon: Shield, label: "Security", description: "Password and 2FA settings" },
    { icon: Settings, label: "Preferences", description: "Customize your experience" },
  ];

  const handleEditProfile = () => {
    setEditUsername(user?.username || "");
    setIsEditModalOpen(true);
  };

  const handleUpdateProfile = async () => {
    if (!editUsername.trim()) {
      toast.showError("Username is required");
      return;
    }

    if (editUsername.length < 5) {
      toast.showError("Username must be at least 5 characters");
      return;
    }

    setIsUpdating(true);
    
    try {
      // Get current token from localStorage
      const tokens = localStorage.getItem('authTokens');
      if (!tokens) {
        throw new Error('No authentication token found');
      }
      const parsedTokens = JSON.parse(tokens);

      // TODO: Implement update profile API when available
      console.log('📨 Would update profile for:', user?.phone_number);
      
      // Simulate successful response for now
      setIsEditModalOpen(false);
      toast.showSuccess("Profile updated successfully!");
      
    } catch (error: any) {
      toast.showError(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefreshProfile = async () => {
    setRefreshingUser(true);
    try {
      const tokens = localStorage.getItem('authTokens');
      if (!tokens) {
        throw new Error('No authentication token found');
      }
      const parsedTokens = JSON.parse(tokens);

      // TODO: Implement get current user API when available
      console.log('📨 Would refresh user data');
    } catch (error: any) {
      toast.showError(error.message || 'Failed to refresh profile data');
    } finally {
      setRefreshingUser(false);
    }
  };

  const getUserInitials = () => {
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return "P1";
  };

  const getMemberSince = () => {
    if (user?.created_at) {
      const date = new Date(user.created_at);
      return `Member since ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    }
    return "Member since March 2024";
  };

  // Handle account history
  const handleAccountHistory = async () => {
    setHistoryLoading(true);
    try {
      // TODO: Call actual account history API
      console.log('Fetching account history for user:', user?.username);
      
      // Mock data for demonstration
      const mockHistory = [
        {
          id: 1,
          type: 'deposit',
          amount: 500,
          balance_before: 1000,
          balance_after: 1500,
          description: 'Cash deposit via bank transfer',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 2,
          type: 'withdraw',
          amount: 200,
          balance_before: 1500,
          balance_after: 1300,
          description: 'ATM withdrawal',
          created_at: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: 3,
          type: 'bet',
          amount: 100,
          balance_before: 1300,
          balance_after: 1200,
          description: 'Sports bet - Man United vs Liverpool',
          created_at: new Date(Date.now() - 259200000).toISOString()
        },
        {
          id: 4,
          type: 'win',
          amount: 300,
          balance_before: 1200,
          balance_after: 1500,
          description: 'Casino win - Mega Fortune Wheel',
          created_at: new Date(Date.now() - 345600000).toISOString()
        },
        {
          id: 5,
          type: 'bonus',
          amount: 50,
          balance_before: 1500,
          balance_after: 1550,
          description: 'Welcome bonus for new member',
          created_at: new Date(Date.now() - 432000000).toISOString()
        },
        {
          id: 6,
          type: 'deposit',
          amount: 1000,
          balance_before: 1550,
          balance_after: 2550,
          description: 'Card deposit ending in 4242',
          created_at: new Date(Date.now() - 518400000).toISOString()
        },
        {
          id: 7,
          type: 'bet',
          amount: 50,
          balance_before: 2550,
          balance_after: 2500,
          description: 'Sports bet - Chelsea vs Arsenal',
          created_at: new Date(Date.now() - 604800000).toISOString()
        },
        {
          id: 8,
          type: 'win',
          amount: 150,
          balance_before: 2500,
          balance_after: 2650,
          description: 'Sports bet win - Chelsea vs Arsenal',
          created_at: new Date(Date.now() - 691200000).toISOString()
        }
      ];
      
      setAccountHistory(mockHistory);
      setShowFullHistory(true);
    } catch (error: any) {
      console.error('Account history error:', error);
      toast.showError(error.message || 'Failed to fetch account history');
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="mb-8 bg-gradient-to-r from-primary/20 to-orange-500/20 border border-primary/30 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-4xl font-bold text-primary-foreground">
            {getUserInitials()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-1">{user?.username || "Guest"}</h1>
            <p className="text-muted-foreground mb-3">{getMemberSince()}</p>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                <Award className="w-4 h-4" />
                VIP Gold
              </div>
              <div className="bg-muted/50 text-muted-foreground px-4 py-1.5 rounded-full text-sm">
                Level 12
              </div>
            </div>
          </div>
          <button 
            onClick={handleEditProfile}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm text-gray-400">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Personal Information Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Personal Information</h2>
          <button 
            onClick={handleRefreshProfile}
            disabled={refreshingUser}
            className="text-[#FFD700] hover:text-[#FFC700] disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {refreshingUser ? (
              <>
                <div className="w-4 h-4 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4" />
                <span>Refresh</span>
              </>
            )}
          </button>
        </div>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-[#FFD700]" />
                <div>
                  <div className="text-sm text-gray-400 mb-1">Username</div>
                  <div className="text-white font-medium">{user?.username || "N/A"}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#FFD700]" />
                <div>
                  <div className="text-sm text-gray-400 mb-1">Phone Number</div>
                  <div className="text-white font-medium">{user?.phone_number || "N/A"}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#FFD700]" />
                <div>
                  <div className="text-sm text-gray-400 mb-1">Email</div>
                  <div className="text-white font-medium">Not provided</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#FFD700]" />
                <div>
                  <div className="text-sm text-gray-400 mb-1">Member Since</div>
                  <div className="text-white font-medium">{getMemberSince()}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Account Status</div>
                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium inline-block">
                  Active
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400 mb-1">Account Type</div>
                <div className="bg-[#FFD700]/20 text-[#FFD700] px-3 py-1 rounded-full text-sm font-medium inline-block">
                  VIP Gold
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Menu */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Account Settings</h2>
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="card-modern w-full p-4 flex items-center gap-4 transition-all group cursor-pointer hover-lift"
              >
                <div className="card-modern w-12 h-12 flex items-center justify-center group-hover:bg-[#FFD700] transition-colors">
                  <Icon className="w-6 h-6 text-[#FFD700] group-hover:text-[#121212]" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white font-semibold mb-1">{item.label}</div>
                  <div className="text-sm text-gray-400">{item.description}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#FFD700]" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <button 
            onClick={handleAccountHistory}
            disabled={historyLoading}
            className="text-[#FFD700] hover:text-[#FFC700] disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {historyLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <History className="w-4 h-4" />
                <span>View Full History</span>
              </>
            )}
          </button>
        </div>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
          {[
            { type: "win", game: "Mega Fortune Wheel", amount: "+$124.50", time: "2 hours ago", positive: true },
            { type: "bet", game: "Man United vs Liverpool", amount: "-$50.00", time: "5 hours ago", positive: false },
            { type: "win", game: "Blackjack Royal Pairs", amount: "+$89.00", time: "1 day ago", positive: true },
            { type: "deposit", game: "Card ending in 4242", amount: "+$200.00", time: "2 days ago", positive: true },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border-b border-[#2A2A2A] last:border-b-0 hover:bg-[#2A2A2A] transition-colors"
            >
              <div className="flex-1">
                <div className="text-white font-semibold mb-1">{activity.game}</div>
                <div className="text-sm text-gray-400">{activity.time}</div>
              </div>
              <div className={`text-lg font-bold ${activity.positive ? 'text-green-500' : 'text-gray-400'}`}>
                {activity.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <button className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 rounded-xl p-4 font-semibold flex items-center justify-center gap-2 transition-all">
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setIsEditModalOpen(false)}>
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="modal-modern w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                  maxLength={30}
                />
                <p className="mt-1 text-xs text-gray-400">
                  Username must be at least 5 characters long
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={user?.phone_number || ""}
                  disabled
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-4 py-3 text-gray-400 placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Phone number cannot be changed
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={isUpdating || !editUsername.trim() || editUsername.length < 5}
                className="flex-1 bg-[#FFD700] hover:bg-[#FFC700] text-[#121212] px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Account History Modal */}
      {showFullHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowFullHistory(false)}>
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="modal-modern w-full max-w-6xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5" />
                Account History
              </h2>
              <button 
                onClick={() => setShowFullHistory(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info Header */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.username}</h3>
                  <p className="text-sm text-gray-600">{user?.phone_number}</p>
                  <p className="text-sm font-medium text-purple-700">Current Balance: {user?.balance} ETB</p>
                </div>
              </div>
            </div>

            {/* History Table */}
            {historyLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400">Loading account history...</p>
              </div>
            ) : accountHistory.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No account history found
                </h3>
                <p className="text-gray-400">
                  You haven't had any account activities yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium text-gray-700">Date & Time</th>
                      <th className="text-left p-3 font-medium text-gray-700">Type</th>
                      <th className="text-left p-3 font-medium text-gray-700">Description</th>
                      <th className="text-left p-3 font-medium text-gray-700">Amount</th>
                      <th className="text-left p-3 font-medium text-gray-700">Balance Before</th>
                      <th className="text-left p-3 font-medium text-gray-700">Balance After</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountHistory.map((activity) => (
                      <tr key={activity.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(activity.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge
                            variant={
                              activity.type === 'deposit' ? 'default' :
                              activity.type === 'withdraw' ? 'destructive' :
                              activity.type === 'bet' ? 'secondary' :
                              activity.type === 'win' ? 'default' :
                              activity.type === 'bonus' ? 'default' :
                              'secondary'
                            }
                            className="capitalize"
                          >
                            {activity.type}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm">{activity.description}</td>
                        <td className="p-3">
                          <span className={`font-medium ${
                            activity.type === 'deposit' || activity.type === 'win' || activity.type === 'bonus' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {activity.type === 'deposit' || activity.type === 'win' || activity.type === 'bonus' ? '+' : '-'}{activity.amount} ETB
                          </span>
                        </td>
                        <td className="p-3 text-sm">{activity.balance_before} ETB</td>
                        <td className="p-3 text-sm font-medium">{activity.balance_after} ETB</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
