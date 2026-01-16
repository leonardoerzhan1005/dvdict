import React, { useEffect, useState } from 'react';
import { useRouter } from '../hooks/useRouter';
import { useTranslation } from '../src/hooks/useTranslation';

export const AboutPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { navigate } = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 space-y-24 md:space-y-40 pb-40 overflow-hidden animate-fade-up">
      
      {/* HERO SECTION: ADAPTIVE DICTIONARY PREVIEW */}
      <section className="relative pt-8 md:pt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="space-y-8 md:space-y-10 order-2 lg:order-1 text-center lg:text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                {t('about.badge') as string}
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#1a2b56] serif-modern tracking-tighter leading-[0.9]">
              {t('about.hero.title') as string}
            </h2>
            <p className="text-base md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t('about.hero.description') as string}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={() => navigate('home')}
              className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all active:scale-95"
            >
              {t('about.hero.startSearching') as string}
            </button>
            <button 
              onClick={() => navigate('catalog')}
              className="bg-white border border-slate-200 text-slate-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
              {t('about.hero.viewCatalog') as string}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-slate-100">
            {[
              { label: t('about.stats.wordsIndexed') as string, value: '14k+' },
              { label: t('about.stats.visualCards') as string, value: '2.5k' },
              { label: t('about.stats.expertNodes') as string, value: '500+' },
              { label: t('about.stats.syncRate') as string, value: '99.9%' }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-2xl md:text-3xl font-black text-[#1a2b56] tracking-tighter">{stat.value}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* INTERACTIVE PHONE/IMAGE MOCKUP */}
        <div className="relative order-1 lg:order-2">
          <div className="relative z-10 mx-auto w-full max-w-[500px] lg:max-w-none transform lg:rotate-2 hover:rotate-0 transition-transform duration-1000">
            <div className="bg-white rounded-[3.5rem] p-4 shadow-3xl border border-slate-100">
               <div className="relative rounded-[3rem] overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" 
                    alt="Analytics Dashboard" 
                    className="w-full h-[350px] md:h-[550px] object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a2b56]/80 to-transparent flex items-end p-10">
                     <div className="text-white space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                          {t('about.wordOfTheDay') as string}
                        </span>
                        <h4 className="text-4xl font-black serif-modern">
                          {t('about.exampleWord') as string}
                        </h4>
                        <p className="text-sm text-white/60 font-medium">
                          {t('about.exampleTranslations') as string}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
            
            {/* FLOATING TAGS */}
            <div className="absolute -top-6 -right-6 bg-emerald-500 text-white p-6 rounded-3xl shadow-2xl animate-bounce">
               <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7"/></svg>
            </div>
            <div className="absolute -bottom-10 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 hidden md:block">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">AI</div>
                  <div className="text-left">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       {t('about.verification') as string}
                     </p>
                     <p className="text-sm font-black text-[#1a2b56]">
                       {t('about.accuracy') as string}
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: ADAPTIVE GRID - WORDS & PICTURES */}
      <section className="space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">
            {t('about.visualTaxonomy.badge') as string}
          </span>
          <h3 className="text-4xl md:text-6xl font-black text-[#1a2b56] serif-modern tracking-tighter">
            {t('about.visualTaxonomy.title') as string}
          </h3>
          <p className="text-slate-500 font-medium">
            {t('about.visualTaxonomy.description') as string}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { word: t('about.examples.digitalization') as string, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', cat: t('about.categories.tech') as string },
            { word: t('about.examples.sovereignty') as string, image: 'https://images.unsplash.com/photo-1541873676946-840999016540?auto=format&fit=crop&q=80&w=600', cat: t('about.categories.politics') as string },
            { word: t('about.examples.investment') as string, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600', cat: t('about.categories.finance') as string },
            { word: t('about.examples.urbanization') as string, image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=600', cat: t('about.categories.urban') as string }
          ].map((item, i) => (
            <div key={i} className="group cursor-pointer" onClick={() => navigate('catalog')}>
              <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                 <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 relative">
                    <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.word} />
                    <div className="absolute top-4 left-4">
                       <span className="bg-white/90 backdrop-blur-md text-[#1a2b56] px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase">{item.cat}</span>
                    </div>
                 </div>
                 <div className="px-4 pb-4 flex justify-between items-center">
                    <div>
                      <h5 className="text-2xl font-black text-[#1a2b56] serif-modern">{item.word}</h5>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {t('about.trilingualNode') as string}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7"/></svg>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: CLINICAL PRECISION (Bento Style) */}
      <section className="bg-white rounded-[4rem] p-8 md:p-20 border border-slate-100 shadow-sm overflow-hidden relative">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-7 space-y-12">
               <div className="space-y-4">
                  <h3 className="text-5xl font-black text-[#1a2b56] serif-modern tracking-tighter leading-none">
                    {t('about.standardization.title') as string}
                  </h3>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-xl">
                    {t('about.standardization.description') as string}
                  </p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { title: t('about.features.legalCodes') as string, desc: t('about.features.legalCodesDesc') as string },
                    { title: t('about.features.technicalSync') as string, desc: t('about.features.technicalSyncDesc') as string },
                    { title: t('about.features.apiAccess') as string, desc: t('about.features.apiAccessDesc') as string },
                    { title: t('about.features.auditTrail') as string, desc: t('about.features.auditTrailDesc') as string }
                  ].map((feat, i) => (
                    <div key={i} className="flex gap-6 group">
                       <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7"/></svg>
                       </div>
                       <div className="space-y-1">
                          <h6 className="font-black text-[#1a2b56] text-[11px] uppercase tracking-widest">{feat.title}</h6>
                          <p className="text-sm text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="lg:col-span-5 relative">
               <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800" 
                    className="rounded-[2.5rem] shadow-2xl relative z-10" 
                    alt="Lab Tech" 
                  />
                  <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
               </div>
            </div>
         </div>
      </section>

      {/* FINAL ACTION: INSTITUTIONAL ENTRANCE */}
      <section className="text-center space-y-12">
         <div className="max-w-4xl mx-auto space-y-6 px-4">
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">
              {t('about.cta.badge') as string}
            </span>
            <h3 className="text-5xl md:text-7xl font-black text-[#1a2b56] serif-modern tracking-tighter leading-tight">
              {t('about.cta.title') as string}
            </h3>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              {t('about.cta.description') as string}
            </p>
         </div>
         
         <div className="flex flex-col sm:flex-row justify-center gap-6 px-4">
            <button 
              onClick={() => navigate('catalog')}
              className="bg-slate-900 text-white px-12 py-7 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
            >
              {t('about.cta.accessRepository') as string}
            </button>
            <button 
              onClick={() => navigate('contact')}
              className="bg-white border border-slate-200 text-[#1a2b56] px-12 py-7 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all"
            >
              {t('about.cta.institutionalContact') as string}
            </button>
         </div>
         
         <div className="pt-20">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em]">
              {t('about.footer') as string}
            </p>
         </div>
      </section>

    </div>
  );
};

