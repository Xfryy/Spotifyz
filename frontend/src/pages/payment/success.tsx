import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { CheckCircle2, Loader2 } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { setProStatus, checkProStatus } = useAuthStore();
  const [retryCount, setRetryCount] = useState(0);
  const [status, setStatus] = useState<'checking' | 'success' | 'failed'>('checking');
  const maxRetries = 10; // Increase max retries
  const retryDelay = 3000; // 3 seconds between retries

  useEffect(() => {
    const updateStatus = async () => {
      try {
        // Initial delay for webhook
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        let isSuccessful = false;
        while (!isSuccessful && retryCount < maxRetries) {
          console.log(`Attempting to verify pro status (${retryCount + 1}/${maxRetries})`);
          const result = await checkProStatus();
          
          if (result) {
            isSuccessful = true;
            setProStatus(true);
            setStatus('success');
            localStorage.setItem('userProStatus', 'true');
            setTimeout(() => navigate('/'), 2000);
            break;
          }

          await new Promise(resolve => setTimeout(resolve, retryDelay));
          setRetryCount(prev => prev + 1);
        }

        if (!isSuccessful) {
          console.error('Failed to verify pro status after maximum retries');
          setStatus('failed');
        }
      } catch (error) {
        console.error('Error updating pro status:', error);
        setStatus('failed');
      }
    };

    updateStatus();
  }, [navigate, setProStatus, checkProStatus, retryCount]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 text-white">
      {status === 'checking' && (
        <>
          <Loader2 className="w-16 h-16 text-green-500 mb-4 animate-spin" />
          <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
          <p className="text-zinc-400">Please wait while we confirm your payment...</p>
          <p className="text-zinc-500 text-sm mt-4">Attempt {retryCount + 1} of {maxRetries}</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-zinc-400">Thank you for upgrading to Spotifyz Pro</p>
          <p className="text-zinc-500 text-sm mt-4">Redirecting to home page...</p>
        </>
      )}

      {status === 'failed' && (
        <>
          <div className="text-red-500 mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Payment Processing Delay</h1>
          <p className="text-zinc-400 text-center max-w-md">
            Your payment was successful, but we're having trouble confirming it.
            Please wait a few minutes and refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-green-500 text-black rounded-full"
          >
            Refresh Page
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
