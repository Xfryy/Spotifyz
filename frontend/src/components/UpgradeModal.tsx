import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CrownIcon, CheckIcon } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

interface UpgradeModalProps {
  setShowUpgradeModal: (show: boolean) => void;
}

const UpgradeModal = ({ setShowUpgradeModal }: UpgradeModalProps) => {
  const handleUpgrade = async () => {
    try {
      const response = await axiosInstance.post("/payment/create-checkout-session");
      window.location.href = response.data.url;
    } catch (error) {
      toast.error("Failed to initiate checkout");
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white">
        <CardHeader className="text-center border-b border-zinc-800 pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full p-3">
              <CrownIcon size={28} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Upgrade to Spotifyz Pro</CardTitle>
          <CardDescription className="text-zinc-400">
            Unlock premium features and enhance your music experience
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckIcon size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">AI Music Assistant</p>
                <p className="text-sm text-zinc-400">Get personalized music recommendations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Download music</p>
                <p className="text-sm text-zinc-400">Download your favorite tracks</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckIcon size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">High-Quality Audio</p>
                <p className="text-sm text-zinc-400">Listen in premium sound quality</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xl font-bold">$9.99<span className="text-sm font-normal text-zinc-400">/month</span></p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button 
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            Activate Pro
          </Button>
          <Button 
            onClick={() => setShowUpgradeModal(false)}
            variant="ghost" 
            className="w-full text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UpgradeModal;
