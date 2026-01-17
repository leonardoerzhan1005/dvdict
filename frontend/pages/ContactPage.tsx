import React, { useState } from 'react';
import { useTranslation } from '../src/hooks/useTranslation';

export const ContactPage: React.FC = () => {
  const [isSent, setIsSent] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 space-y-24 md:space-y-40 pb-40 animate-fade-up">
      
      {/* HEADER SECTION */}
      <section className="relative pt-16 text-center lg:text-left grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
              {t('contact.badge') as string}
            </span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-[#1a2b56] serif-modern tracking-tighter leading-none">
            {t('contact.hero.title') as string}
          </h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
            {t('contact.hero.description') as string}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                {t('contact.technicalSupport') as string}
              </p>
              <p className="text-lg font-black text-[#1a2b56]">support@dvdictionary.io</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                {t('contact.generalInquiry') as string}
              </p>
              <p className="text-lg font-black text-[#1a2b56]">hello@dvdictionary.io</p>
            </div>
          </div>
        </div>

        {/* VISUAL IMAGE CARD */}
        <div className="relative group">
          <div className="bg-white rounded-[4rem] p-4 shadow-3xl border border-slate-100 overflow-hidden transform group-hover:rotate-1 transition-transform duration-700">
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
              className="rounded-[3.5rem] w-full h-[400px] object-cover" 
              alt="dvdictionary Headquarters" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2b56]/60 to-transparent rounded-[3.5rem]"></div>
            <div className="absolute bottom-12 left-12 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-300">
                {t('contact.globalHub') as string}
              </p>
              <h4 className="text-3xl font-black serif-modern">
                {t('contact.headquarters') as string}
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-4">
            <h3 className="text-4xl font-black text-[#1a2b56] serif-modern tracking-tighter">
              {t('contact.offices.title') as string}
            </h3>
            <p className="text-slate-500 font-medium">
              {t('contact.offices.description') as string}
            </p>
          </div>

          <div className="space-y-10">
            {[
              { 
                city: t('contact.offices.astana.city') as string, 
                lang: 'KZ', 
                addr: t('contact.offices.astana.address') as string, 
                tel: t('contact.offices.astana.phone') as string 
              },
              { 
                city: t('contact.offices.almaty.city') as string, 
                lang: 'KZ', 
                addr: t('contact.offices.almaty.address') as string, 
                tel: t('contact.offices.almaty.phone') as string 
              },
              { 
                city: t('contact.offices.london.city') as string, 
                lang: 'UK', 
                addr: t('contact.offices.london.address') as string, 
                tel: t('contact.offices.london.phone') as string 
              }
            ].map((office, i) => (
              <div key={i} className="flex gap-8 group cursor-pointer">
                <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <span className="text-xs font-black">{office.lang}</span>
                </div>
                <div>
                  <h5 className="text-xl font-black text-[#1a2b56]">
                    {office.city} {t('contact.offices.node') as string}
                  </h5>
                  <p className="text-slate-400 text-sm font-medium">{office.addr}</p>
                  <p className="text-blue-600 text-xs font-black mt-1 uppercase tracking-widest">{office.tel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white rounded-[4rem] p-10 md:p-16 border border-slate-100 shadow-2xl relative overflow-hidden">
            {isSent ? (
              <div className="text-center py-20 space-y-6 animate-fade-up">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-4xl font-black text-[#1a2b56] serif-modern">
                  {t('contact.form.sent.title') as string}
                </h3>
                <p className="text-slate-500 font-medium">
                  {t('contact.form.sent.description') as string}
                </p>
                <button 
                  onClick={() => setIsSent(false)} 
                  className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline"
                >
                  {t('contact.form.sent.sendAnother') as string}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                      {t('contact.form.fullIdentity') as string}
                    </label>
                    <input 
                      required 
                      type="text" 
                      placeholder={t('contact.form.fullIdentityPlaceholder') as string}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all font-bold" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                      {t('contact.form.email') as string}
                    </label>
                    <input 
                      required 
                      type="email" 
                      placeholder={t('contact.form.emailPlaceholder') as string}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all font-bold" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                    {t('contact.form.category') as string}
                  </label>
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all font-bold appearance-none">
                    <option>{t('contact.form.categories.apiAccess') as string}</option>
                    <option>{t('contact.form.categories.expertApplication') as string}</option>
                    <option>{t('contact.form.categories.errorReport') as string}</option>
                    <option>{t('contact.form.categories.collaboration') as string}</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                    {t('contact.form.message') as string}
                  </label>
                  <textarea 
                    required 
                    rows={5} 
                    placeholder={t('contact.form.messagePlaceholder') as string}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-8 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all font-bold resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-slate-900 text-white font-black py-7 rounded-[2rem] text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all active:scale-95"
                >
                  {t('contact.form.submit') as string}
                </button>
              </form>
            )}
            
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 -z-10"></div>
          </div>
        </div>
      </section>

      {/* MAP / LOCATION STRIP */}
      <section className="bg-[#0f172a] rounded-[5rem] p-12 md:p-24 text-center space-y-12 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h3 className="text-4xl font-black text-white serif-modern tracking-tighter leading-tight">
            {t('contact.visit.title') as string}
          </h3>
          <p className="text-white/40 text-lg">
            {t('contact.visit.description') as string}
          </p>
          <div className="flex justify-center">
            <div className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white font-black text-[10px] uppercase tracking-widest">
              {t('contact.visit.hours') as string}
            </div>
          </div>
        </div>
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-full h-[300px] bg-blue-600/20 blur-[100px] rounded-full"></div>
      </section>

    </div>
  );
};

