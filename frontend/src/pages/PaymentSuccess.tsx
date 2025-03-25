import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { setProStatus } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(true);
  
  useEffect(() => {
    setIsUpdating(true);
    setTimeout(() => {
      setProStatus(true);
      setIsUpdating(false);
      navigate('/');
    }, 3000);
  }, [setProStatus, navigate]);
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  return (
    <div className="h-screen flex items-center justify-center bg-zinc-900 text-white">
      <div className="text-center p-8 bg-zinc-800 rounded-lg max-w-md w-full mx-4 border border-zinc-700">
        {isUpdating ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-green-500 border-green-500/30"></div>
            <p className="text-zinc-300">Activating your Pro status...</p>
          </div>
        ) : (
          <>
            <div className="inline-flex bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-full mb-6">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Upgrade Successful!</h1>
            <p className="text-zinc-300 mb-6">Your account has been upgraded to Pro. Enjoy all premium features including the AI Music Assistant!</p>
            
            <Button 
              onClick={handleGoHome}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              Go to Homepage
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
