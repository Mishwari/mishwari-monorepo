import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, DevicePhoneMobileIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { PhoneInput } from './PhoneInput';
import { OtpInput } from './OtpInput';
import { countries } from '../data';

interface ChangeMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMobile: string;
  requirePassword?: boolean;
  onSubmit: (data: { newMobile: string; otpCode: string; password?: string }) => Promise<void>;
  onRequestOtp: (mobile: string) => Promise<void>;
}

export const ChangeMobileModal: React.FC<ChangeMobileModalProps> = ({
  isOpen,
  onClose,
  currentMobile,
  requirePassword = false,
  onSubmit,
  onRequestOtp,
}) => {
  const [newMobile, setNewMobile] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMobile) return;

    setLoading(true);
    try {
      await onRequestOtp(newMobile);
      setShowOtp(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeMobile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMobile || !otpCode) return;
    if (requirePassword && !password) return;

    setLoading(true);
    try {
      await onSubmit({
        newMobile,
        otpCode,
        ...(requirePassword && { password })
      });
      setNewMobile('');
      setOtpCode('');
      setPassword('');
      setShowOtp(false);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setShowOtp(false);
    setOtpCode('');
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative shadow-2xl z-10">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
          <XMarkIcon className="w-5 h-5 text-slate-500" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#e6f2f7] rounded-full flex items-center justify-center mx-auto mb-3 text-[#005687]">
            <DevicePhoneMobileIcon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#042f40]">
            {showOtp ? 'تأكيد رمز التحقق' : 'تغيير رقم الجوال'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {showOtp ? 'أدخل رمز التحقق المرسل إلى الرقم الجديد' : 'أدخل رقم الجوال الجديد'}
          </p>
        </div>

        {!showOtp ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الرقم الحالي</label>
              <div className="text-lg font-bold text-gray-400" dir="ltr">+{currentMobile}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الرقم الجديد</label>
              <PhoneInput
                value={newMobile}
                onChange={setNewMobile}
                countries={countries}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#005687] hover:bg-[#004a73] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-50">
              {loading ? 'جاري الإرسال...' : 'طلب رمز التحقق'}
            </button>
          </form>
        ) : (
          <>
            <div className="flex justify-center items-center gap-2 mb-6">
              <h1 className="text-lg font-bold text-[#005687]" dir="ltr">+{newMobile}</h1>
              <button onClick={handleEdit} type="button">
                <PencilSquareIcon className="h-5 w-5 text-[#005687]" />
              </button>
            </div>

            <form onSubmit={handleChangeMobile} className="space-y-6">
              <div className="flex justify-center">
                <OtpInput
                  value={otpCode}
                  onChange={setOtpCode}
                  length={4}
                />
              </div>

              {requirePassword && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005687]"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#005687] hover:bg-[#004a73] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-50">
                {loading ? 'جاري التأكيد...' : 'تأكيد التغيير'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};
