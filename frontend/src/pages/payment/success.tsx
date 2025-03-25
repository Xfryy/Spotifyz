import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { CheckCircle2 } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { setProStatus, checkProStatus } = useAuthStore();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;

  useEffect(() => {
    const updateStatus = async () => {
      try {
        // Initial delay for webhook
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        let isSuccessful = false;
        while (!isSuccessful && retryCount < maxRetries) {
          const result = await checkProStatus();
          console.log('Pro status check result:', result, 'Attempt:', retryCount + 1);
          
          if (result) {
            isSuccessful = true;
            setProStatus(true);
            // Force clear and update localStorage
            localStorage.setItem('userProStatus', 'true');
            // Small delay before redirect
            setTimeout(() => navigate('/'), 1500);
            break;
          }

          // Wait 2 seconds before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
          setRetryCount(prev => prev + 1);
        }

        if (!isSuccessful) {
          console.error('Failed to verify pro status after maximum retries');
        }
      } catch (error) {
        console.error('Error updating pro status:', error);
      }
    };

    updateStatus();
  }, [navigate, setProStatus, checkProStatus, retryCount]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-zinc-400">Thank you for upgrading to Spotifyz Pro</p>
      <p className="text-zinc-500 text-sm mt-4">Redirecting to home page...</p>
    </div>
  );
};

export default PaymentSuccess;
