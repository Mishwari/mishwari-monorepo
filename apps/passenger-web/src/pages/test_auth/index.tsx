import { useState, useEffect, useRef } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

type Step = 'INPUT_PHONE' | 'INPUT_OTP' | 'SUCCESS';

export default function TestAuthPage() {
  const [phoneNumber, setPhoneNumber] = useState('+967');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<Step>('INPUT_PHONE');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [idToken, setIdToken] = useState('');
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);
  const recaptchaWidgetId = useRef<number | null>(null);

  useEffect(() => {
    const setupRecaptcha = async () => {
      if (typeof window === 'undefined') return;
      const { getFirebaseAuth } = await import('@/lib/firebase');
      const auth = getFirebaseAuth();
      if (!auth) {
        setError('Firebase not initialized. Check environment variables.');
        return;
      }
      if (!recaptchaVerifier.current && document.getElementById('recaptcha-container')) {
        try {
          recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'normal',
          });
        } catch (e) {
          console.error('Recaptcha setup error:', e);
        }
      }
    };
    setupRecaptcha();
    
    return () => {
      if (recaptchaVerifier.current) {
        try {
          recaptchaVerifier.current.clear();
          recaptchaVerifier.current = null;
        } catch (e) {}
      }
    };
  }, []);

  const handleSendSMS = async () => {
    setLoading(true);
    setError('');
    try {
      const { getFirebaseAuth } = await import('@/lib/firebase');
      const auth = getFirebaseAuth();
      if (!auth) {
        setError('Firebase not initialized. Check environment variables.');
        setLoading(false);
        return;
      }
      if (!recaptchaVerifier.current) {
        recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'normal',
        });
      }
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier.current);
      setConfirmationResult(result);
      setStep('INPUT_OTP');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmationResult) return;
    setLoading(true);
    setError('');
    try {
      const result = await confirmationResult.confirm(otp);
      const token = await result.user.getIdToken();
      setIdToken(token);
      setStep('SUCCESS');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(idToken);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Phone Auth Test Lab</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {step === 'INPUT_PHONE' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+967XXXXXXXXX"
              />
            </div>
            <div id="recaptcha-container" className="flex justify-center my-4"></div>
            <button
              onClick={handleSendSMS}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send SMS'}
            </button>
          </div>
        )}

        {step === 'INPUT_OTP' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              ✓ Authentication Successful
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Firebase ID Token</label>
              <div className="relative">
                <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto break-all whitespace-pre-wrap">
                  {idToken}
                </pre>
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Copy
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                setStep('INPUT_PHONE');
                setPhoneNumber('+967');
                setOtp('');
                setIdToken('');
                setError('');
                if (recaptchaVerifier.current) {
                  try {
                    recaptchaVerifier.current.clear();
                    recaptchaVerifier.current = null;
                  } catch (e) {}
                }
                window.location.reload();
              }}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
            >
              Test Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
