import React, { useState } from 'react';
import { authService } from '../services/api/authService';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../src/hooks/useTranslation';
import { JsonImport } from './components/JsonImport';

const IconUser = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const IconShield = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const IconBell = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const IconCreditCard = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const IconHistory = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
    <path d="M21 3v5h-5"></path>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
    <path d="M3 21v-5h5"></path>
  </svg>
);

const IconEye = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const IconEyeOff = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const IconSmartphone = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
);

const IconLaptop = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="4" width="20" height="12" rx="2" ry="2"></rect>
    <line x1="2" y1="20" x2="22" y2="20"></line>
  </svg>
);

const IconUpload = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

export const AdminSettings: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('importData');
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordChange = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);

    // Валидация
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError(t('admin.settings.password.allFieldsRequired'));
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError(t('admin.settings.password.minLengthRequired'));
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(t('admin.settings.password.passwordsDontMatch'));
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError(t('admin.settings.password.samePassword'));
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err?.message || t('admin.settings.password.error'));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const renderSecuritySettings = () => (
    <div className="flex-1 space-y-8">
      {/* Password Section */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-1">{t('admin.settings.password.title')}</h2>
        <p className="text-zinc-400 text-sm mb-6">{t('admin.settings.password.subtitle')}</p>

        {passwordError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
            {t('admin.settings.password.success')}
          </div>
        )}

        <div className="space-y-6 max-w-lg">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">{t('admin.settings.password.currentPassword')}</label>
            <div className="relative">
              <input 
                type={showPasswords.current ? 'text' : 'password'} 
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder={t('admin.settings.password.currentPasswordPlaceholder')}
                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 px-4 pr-12 text-white focus:outline-none focus:border-orange-500 transition-colors" 
              />
              <button 
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPasswords.current ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">{t('admin.settings.password.newPassword')}</label>
            <div className="relative">
              <input 
                type={showPasswords.new ? 'text' : 'password'} 
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder={t('admin.settings.password.newPasswordPlaceholder')}
                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 px-4 pr-12 text-white focus:outline-none focus:border-orange-500 transition-colors" 
              />
              <button 
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPasswords.new ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
            <p className="text-xs text-zinc-600 mt-1">{t('admin.settings.password.minCharacters')}</p>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">{t('admin.settings.password.confirmPassword')}</label>
            <div className="relative">
              <input 
                type={showPasswords.confirm ? 'text' : 'password'} 
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder={t('admin.settings.password.confirmPasswordPlaceholder')}
                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 px-4 pr-12 text-white focus:outline-none focus:border-orange-500 transition-colors" 
              />
              <button 
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPasswords.confirm ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={handlePasswordChange}
            disabled={isChangingPassword}
            className="px-8 py-3 rounded-full bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 disabled:bg-orange-600/50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-orange-900/20"
          >
            {isChangingPassword ? t('admin.settings.password.changing') : t('admin.settings.password.changePassword')}
          </button>
        </div>
      </div>

      {/* Account Security Info */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-1">{t('admin.settings.accountSecurity.title')}</h2>
        <p className="text-zinc-400 text-sm mb-6">{t('admin.settings.accountSecurity.subtitle')}</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-white/5">
            <div>
              <h4 className="text-white font-medium text-sm mb-1">{t('admin.settings.accountSecurity.emailVerification')}</h4>
              <p className="text-zinc-500 text-xs">
                {user?.is_email_verified ? t('admin.settings.accountSecurity.emailVerified') : t('admin.settings.accountSecurity.pleaseVerify')}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              user?.is_email_verified 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              {user?.is_email_verified ? t('admin.settings.accountSecurity.verified') : t('admin.settings.accountSecurity.pending')}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-white/5">
            <div>
              <h4 className="text-white font-medium text-sm mb-1">{t('admin.settings.accountSecurity.accountRole')}</h4>
              <p className="text-zinc-500 text-xs">{t('admin.settings.accountSecurity.currentRole', { role: user?.role || 'user' })}</p>
            </div>
            <IconShield size={24} className="text-orange-500" />
          </div>
        </div>
      </div>

      {/* Devices Section */}
      <div className="bg-[#121214] border border-white/5 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">{t('admin.settings.activeSessions.title')}</h2>
            <p className="text-zinc-400 text-sm">{t('admin.settings.activeSessions.subtitle')}</p>
          </div>
          <button className="text-orange-500 text-sm font-medium hover:text-orange-400 transition-colors">
            {t('admin.settings.activeSessions.logoutAll')}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-white/5">
            <div className="flex items-center gap-4">
              <IconLaptop size={24} className="text-zinc-400" />
              <div>
                <h4 className="text-white font-medium text-sm">{t('admin.settings.activeSessions.currentDevice')}</h4>
                <p className="text-zinc-500 text-xs">{t('admin.settings.activeSessions.thisBrowser')}</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
              {t('admin.settings.activeSessions.active')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="flex-1 space-y-8">
      <div className="bg-[#121214] border border-white/5 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-1">{t('admin.settings.accountInformation.title')}</h2>
        <p className="text-zinc-400 text-sm mb-6">{t('admin.settings.accountInformation.subtitle')}</p>
        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">{t('admin.settings.accountInformation.email')}</label>
            <input 
              type="email" 
              value={user?.email || ''} 
              disabled
              className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 px-4 text-zinc-500 cursor-not-allowed" 
            />
            <p className="text-xs text-zinc-600 mt-1">{t('admin.settings.accountInformation.emailCannotChange')}</p>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">{t('admin.settings.accountInformation.name')}</label>
            <input 
              type="text" 
              value={user?.name || ''} 
              disabled
              className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 px-4 text-zinc-500 cursor-not-allowed" 
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">{t('admin.settings.title').split(' ').slice(0, -1).join(' ')} <span className="text-zinc-500">{t('admin.settings.title').split(' ').slice(-1)[0]}</span></h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="space-y-1">
            <h3 className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">{t('admin.settings.sections.accountSettings')}</h3>
            {[
              { icon: IconUpload, labelKey: 'Импорт данных', id: 'importData' },
              { icon: IconUser, labelKey: 'admin.settings.sections.accountSettings', id: 'accountSettings' },
              { icon: IconShield, labelKey: 'admin.settings.sections.securitySettings', id: 'securitySettings' },
              { icon: IconBell, labelKey: 'admin.settings.sections.notifications', id: 'notifications' },
              { icon: IconCreditCard, labelKey: 'admin.settings.sections.billingSettings', id: 'billingSettings' },
              { icon: IconHistory, labelKey: 'admin.settings.sections.billingHistory', id: 'billingHistory' },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-orange-500 bg-zinc-900/50'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-orange-500' : 'text-zinc-500'} />
                  {t(item.labelKey)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        {activeSection === 'importData' && (
          <div className="flex-1 space-y-8">
            <JsonImport />
          </div>
        )}
        {activeSection === 'securitySettings' && renderSecuritySettings()}
        {activeSection === 'accountSettings' && renderAccountSettings()}
        {activeSection !== 'importData' && activeSection !== 'securitySettings' && activeSection !== 'accountSettings' && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-zinc-500">{t('admin.settings.comingSoon')}</p>
          </div>
        )}
      </div>
    </div>
  );
};
