import React, { useState } from 'react';
import { icons } from '../constants/icons';
import { authApi, saveSession, clearSession } from '../api';
import { useSettings } from '../context/SettingsContext';
import {
  FaBriefcase,
  FaChartBar,
  FaEnvelope,
  FaEyeSlash,
  FaEye,
  FaLock,
  FaReceipt,
  FaStore,
  FaUser,
} from 'react-icons/fa';
import { FieldError } from '../hooks/useFormValidation';

const features = [
  { icon: FaReceipt, title: 'Fast & Easy Billing', description: 'Create bills in seconds' },
  { icon: FaStore, title: 'Inventory Management', description: 'Track stock in real time' },
  { icon: FaChartBar, title: 'Detailed Reports', description: 'Insights to grow your business' },
];

/* ─── Validation rules ─────────────────────────────────────────────── */
const loginRules = {
  username: (v) => v.trim() ? '' : 'Username is required.',
  password: (v) => v.length >= 6 ? '' : 'Password must be at least 6 characters.',
};
const registerRules = {
  fullName: (v) => v.trim() ? '' : 'Full name is required.',
  username: (v) => v.trim() ? '' : 'Username is required.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.',
  password: (v) => v.length >= 6 ? '' : 'Password must be at least 6 characters.',
  confirm: (v, all) => v === all?.password ? '' : 'Passwords do not match.',
};

/* ─── Error border helper ──────────────────────────────────────────── */
const errBorder = (show) =>
  show
    ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#FECACA]'
    : 'border-[#DDE1EC] bg-white focus:border-[#7C3AED]/60 focus:ring-1 focus:ring-[#C4B5FD]/20';

/* ─── Controlled field input ───────────────────────────────────────── */
const FieldInput = ({ label, icon: Icon, placeholder, type = 'text', compact = false, error, onBlur, onChange, value }) => {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPwd ? 'text' : 'password') : type;
  const hasError = Boolean(error);

  return (
    <div>
      <span className={`${compact ? 'mb-1.5' : 'mb-2'} block text-[12px] font-semibold text-slate-950`}>
        {label}
      </span>
      <span className={`${compact ? 'h-[36px]' : 'h-[38px]'} flex items-center rounded-md border px-3 shadow-sm transition ${errBorder(hasError)}`}>
        <Icon className={`mr-4 text-[13px] ${hasError ? 'text-[#EF4444]' : 'text-slate-400'}`} />
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="min-w-0 flex-1 border-0 bg-transparent text-[14px] font-medium text-slate-800 outline-none placeholder:text-slate-300"
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPwd((p) => !p)} className="ml-3 text-slate-400 hover:text-slate-600">
            {showPwd ? <FaEye className="text-[14px]" /> : <FaEyeSlash className="text-[14px]" />}
          </button>
        )}
      </span>
      <FieldError message={error} />
    </div>
  );
};

/* ─── Brand panel ──────────────────────────────────────────────────── */
const BrandPanel = () => {
  const { settings } = useSettings();

  return (
    <aside className="relative hidden min-h-screen overflow-hidden bg-[#090033] text-white lg:block lg:w-1/2">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/Login.png)" }} />
      <div className="relative z-10 flex min-h-screen max-w-[430px] flex-col justify-center px-14 py-10">
        <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-3xl shadow-2xl shadow-primary-900/40 overflow-hidden">
          {settings.logo ? (
            <img src={settings.logo} alt="Logo" className="h-full w-full object-cover" />
          ) : (
            <icons.logo />
          )}
        </div>
        <h1 className="text-[34px] font-extrabold leading-none">{settings.cafe_name}</h1>
        <p className="mt-4 text-[17px] font-medium text-indigo-100/80">Point of Sale System</p>
        <div className="mt-6 h-1 w-[68px] rounded-full bg-primary-500" />
        <div className="mt-7">
          <h2 className="text-[16px] font-extrabold">Smart Billing. Happy Business.</h2>
          <p className="mt-4 max-w-[250px] text-[13px] leading-5 text-indigo-100/75">All-in-one POS solution to streamline your cafe operations.</p>
        </div>
        <div className="mt-9 space-y-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div className="flex items-center gap-4" key={title}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/18 text-[16px] text-white"><Icon /></div>
              <div>
                <h3 className="text-[13px] font-extrabold">{title}</h3>
                <p className="mt-1 text-[13px] font-semibold text-white">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

const DotPattern = () => (
  <div className="absolute right-7 top-6 grid grid-cols-4 gap-2">
    {Array.from({ length: 16 }).map((_, i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-primary-200/70" />)}
  </div>
);

/* ─── Error Banner ─────────────────────────────────────────────────── */
const ErrorBanner = ({ message }) => (
  <div className="mt-4 flex items-start gap-2 rounded-md border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-[12px] font-medium text-[#B91C1C]">
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#EF4444]" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
    {message}
  </div>
);

/* ─── Auth Page ────────────────────────────────────────────────────── */
const AuthPage = ({ mode, onShowLogin, onShowRegister, onLogin }) => {
  const isRegister = mode === 'register';
  const { settings } = useSettings();

  /* ── Login state ── */
  const [loginFields, setLoginFields] = useState({ username: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginTouched, setLoginTouched] = useState({});
  const [loginSubmitted, setLoginSubmitted] = useState(false);

  /* ── Register state ── */
  const [regFields, setRegFields] = useState({ fullName: '', username: '', email: '', password: '', confirm: '' });
  const [regErrors, setRegErrors] = useState({});
  const [regTouched, setRegTouched] = useState({});
  const [regSubmitted, setRegSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /* ── Login helpers ── */
  const setLogin = (field) => (e) => {
    const val = e.target.value;
    setLoginFields((prev) => ({ ...prev, [field]: val }));
    // clear error as user types once submitted
    if (loginSubmitted || loginTouched[field]) {
      setLoginErrors((prev) => ({ ...prev, [field]: loginRules[field](val) }));
    }
  };
  const blurLogin = (field) => () => {
    setLoginTouched((prev) => ({ ...prev, [field]: true }));
    setLoginErrors((prev) => ({ ...prev, [field]: loginRules[field](loginFields[field]) }));
  };

  /* show error for a login field */
  const loginErr = (field) =>
    (loginSubmitted || loginTouched[field]) ? loginErrors[field] : '';

  const handleLogin = async () => {
    const errs = {};
    Object.entries(loginRules).forEach(([f, fn]) => {
      const e = fn(loginFields[f]);
      errs[f] = e;
    });
    setLoginErrors(errs);
    setLoginTouched({ username: true, password: true });
    setLoginSubmitted(true);
    const hasErrors = Object.values(errs).some(Boolean);
    if (hasErrors) {
      setSubmitError('');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');
      const response = await authApi.login({
        username: loginFields.username,
        password: loginFields.password,
      });
      saveSession(response);
      onLogin?.();
    } catch (error) {
      setSubmitError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Register helpers ── */
  const setReg = (field) => (e) => {
    const val = e.target.value;
    setRegFields((prev) => ({ ...prev, [field]: val }));
    if (regSubmitted || regTouched[field]) {
      setRegErrors((prev) => ({ ...prev, [field]: registerRules[field](val, { ...regFields, [field]: val }) }));
    }
  };
  const blurReg = (field) => () => {
    setRegTouched((prev) => ({ ...prev, [field]: true }));
    setRegErrors((prev) => ({ ...prev, [field]: registerRules[field](regFields[field], regFields) }));
  };

  const regErr = (field) =>
    (regSubmitted || regTouched[field]) ? regErrors[field] : '';

  const handleRegister = async () => {
    const errs = {};
    Object.entries(registerRules).forEach(([f, fn]) => {
      errs[f] = fn(regFields[f], regFields);
    });
    setRegErrors(errs);
    setRegTouched({ fullName: true, username: true, email: true, password: true, confirm: true });
    setRegSubmitted(true);
    const hasErrors = Object.values(errs).some(Boolean);
    if (hasErrors) {
      setSubmitError('');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError('');
      const response = await authApi.register({
        fullName: regFields.fullName,
        username: regFields.username,
        email: regFields.email,
        password: regFields.password,
      });
      saveSession(response);
      onShowLogin?.();
    } catch (error) {
      setSubmitError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showLoginBanner = loginSubmitted && Object.values(loginErrors).some(Boolean);
  const showRegBanner = regSubmitted && Object.values(regErrors).some(Boolean);

  return (
    <main className="flex h-auto bg-white">
      <BrandPanel />
      <section className="relative flex flex-1 justify-center px-6 py-10 overflow-y-auto">
        <DotPattern />
        <div className="w-full max-w-[416px]">
          <div className={`${isRegister ? 'mb-3' : 'mb-5'} flex justify-center`}>
            <div className={`${isRegister ? 'h-14 w-14 text-2xl' : 'h-16 w-16 text-3xl'} flex items-center justify-center rounded-full bg-primary-600 text-white shadow-xl shadow-primary-100`}>
              {settings?.logo ? (
                <img
                  src={settings.logo}
                  alt="Logo"
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <icons.logo />
              )}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-[24px] font-extrabold leading-tight text-slate-950">
              {isRegister ? 'Create Your Account' : 'Welcome Back!'}
            </h2>
            <p className={`${isRegister ? 'mt-1' : 'mt-2'} text-[13px] font-semibold text-text-700`}>
              {isRegister ? `Join ${settings?.cafe_name || "POS Cafe"} and start managing your business smarter.` : `Sign in to continue to ${settings?.cafe_name || "POS Cafe"}`}
            </p>
          </div>

          {/* ── Login form ── */}
          {!isRegister && (
            <>
              {showLoginBanner && <ErrorBanner message="Please fix the errors below before continuing." />}
              {submitError && <ErrorBanner message={submitError} />}
              <form className="mt-7 space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <FieldInput
                  label="Username" icon={FaUser} placeholder="Enter your username"
                  value={loginFields.username} onChange={setLogin('username')} onBlur={blurLogin('username')}
                  error={loginErr('username')}
                />
                <FieldInput
                  label="Password" icon={FaLock} placeholder="Enter your password" type="password"
                  value={loginFields.password} onChange={setLogin('password')} onBlur={blurLogin('password')}
                  error={loginErr('password')}
                />
                <div className="flex items-center justify-between pt-1 text-[13px]">
                  <label className="flex items-center gap-2 font-medium text-slate-500">
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary-600" />
                    Remember me
                  </label>
                  <button type="button" className="font-semibold text-primary-600">Forgot Password?</button>
                </div>
                <button type="submit" disabled={isSubmitting} className="flex h-10 w-full items-center justify-center gap-3 rounded-[9px] bg-primary-600 text-[14px] font-extrabold text-white shadow-lg shadow-primary-100 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70">
                  <FaLock /> {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </>
          )}

          {/* ── Register form ── */}
          {isRegister && (
            <>
              {showRegBanner && <ErrorBanner message="Please fix the errors below before continuing." />}
              {submitError && <ErrorBanner message={submitError} />}
              <form className="mt-5 space-y-2.5" onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                <FieldInput compact label="Full Name" icon={FaUser} placeholder="Enter your full name"
                  value={regFields.fullName} onChange={setReg('fullName')} onBlur={blurReg('fullName')}
                  error={regErr('fullName')} />
                <FieldInput compact label="Username" icon={FaUser} placeholder="Enter your username"
                  value={regFields.username} onChange={setReg('username')} onBlur={blurReg('username')}
                  error={regErr('username')} />
                <FieldInput compact label="Email Address" icon={FaEnvelope} placeholder="Enter your email address"
                  value={regFields.email} onChange={setReg('email')} onBlur={blurReg('email')}
                  error={regErr('email')} />
                <FieldInput compact label="Password" icon={FaLock} placeholder="Create a password" type="password"
                  value={regFields.password} onChange={setReg('password')} onBlur={blurReg('password')}
                  error={regErr('password')} />
                <FieldInput compact label="Confirm Password" icon={FaLock} placeholder="Confirm your password" type="password"
                  value={regFields.confirm} onChange={setReg('confirm')} onBlur={blurReg('confirm')}
                  error={regErr('confirm')} />
                <label className="flex items-center gap-2 pt-1 text-[12px] font-medium text-slate-500">
                  <input type="checkbox" defaultChecked className="h-3.5 w-3.5 accent-primary-600" />
                  <span>
                    I agree to the{' '}
                    <button type="button" className="font-semibold text-primary-600">Terms and Conditions</button>
                    {' '}and{' '}
                    <button type="button" className="font-semibold text-primary-600">Privacy Policy</button>
                  </span>
                </label>
                <button type="submit" disabled={isSubmitting} className="flex h-10 w-full items-center justify-center gap-3 rounded-[9px] bg-primary-600 text-[14px] font-extrabold text-white shadow-lg shadow-primary-100 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-70">
                  <FaBriefcase /> {isSubmitting ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            </>
          )}

          <div className={`${isRegister ? 'my-3.5' : 'my-5'} flex items-center gap-4`}>
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[13px] text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {isRegister ? (
            <p className="text-center text-[14px] text-slate-500">
              Already have an account?{' '}
              <button type="button" onClick={onShowLogin} className="font-extrabold text-primary-600">Sign In</button>
            </p>
          ) : (
            <button type="button" onClick={onShowRegister} className="flex h-11 w-full items-center justify-center gap-3 rounded-[9px] border-2 border-primary-600 bg-white text-[14px] font-extrabold text-primary-600 transition hover:bg-primary-50">
              <FaBriefcase /> Register
            </button>
          )}

          <p className={`${isRegister ? 'mt-3' : 'mt-4'} text-center text-[12px] font-medium text-slate-400`}>
            © 2024 {settings?.cafe_name || "POS Cafe"}. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
