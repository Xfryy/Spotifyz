import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CrownIcon, Calendar, CheckCircle } from "lucide-react";

interface ProDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProDetailsModal = ({ isOpen, onClose }: ProDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm">
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-full p-3">
              <CrownIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold">Pro Subscription</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-zinc-800/50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium">Active Subscription</span>
            </div>
            <div className="space-y-2 text-sm text-zinc-400 ml-8">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Started: March 15, 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Next billing: April 15, 2024</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Current Plan</h3>
            <div className="flex justify-between items-center">
              <div className="text-sm text-zinc-400">Monthly Pro Plan</div>
              <div className="text-lg font-bold">$9.99/mo</div>
            </div>
          </div>

          <div className="text-center text-sm text-zinc-500">
            Manage your subscription in your account settings
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProDetailsModal;
