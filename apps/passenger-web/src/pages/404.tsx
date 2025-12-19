import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Bus, Home, Search, AlertCircle } from 'lucide-react';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>الصفحة غير موجودة | يلا باص</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4" dir="rtl">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center">
                <Bus className="w-16 h-16 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-4xl font-black text-brand mb-4">404</h1>
          <h2 className="text-2xl font-bold text-brand mb-3">الصفحة غير موجودة</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            عذراً، الصفحة التي تبحث عنها غير متوفرة. قد تكون قد تم حذفها أو نقلها.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all shadow-lg active:scale-95"
            >
              <Home className="w-5 h-5" />
              العودة للرئيسية
            </Link>
            
            <Link 
              href="/bus_list"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-primary font-bold rounded-xl border-2 border-primary transition-all active:scale-95"
            >
              <Search className="w-5 h-5" />
              البحث عن رحلات
            </Link>
          </div>

          {/* Help Text */}
          <p className="mt-8 text-sm text-slate-500">
            هل تحتاج مساعدة؟{' '}
            <a href="mailto:support@yallabus.app" className="text-primary hover:underline font-bold">
              تواصل معنا
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
