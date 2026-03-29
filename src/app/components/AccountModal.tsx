import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "../../components/ToastContainer";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string | null;
}

export function AccountModal({ isOpen, onClose, username }: AccountModalProps) {
  const toast = useToast();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Account Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            Account settings coming soon...
          </div>
          <div className="text-sm text-gray-500">
            User: {username || 'Guest'}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#FFD700] hover:bg-[#FFC700] text-[#121212] px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
