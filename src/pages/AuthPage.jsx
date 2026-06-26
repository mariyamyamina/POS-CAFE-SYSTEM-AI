import React from 'react';
import {
  FaBriefcase,
  FaChartBar,
  FaCoffee,
  FaEnvelope,
  FaEyeSlash,
  FaLock,
  FaReceipt,
  FaStore,
  FaUser,
} from 'react-icons/fa';

const features = [
  {
    icon: FaReceipt,
    title: 'Fast & Easy Billing',
    description: 'Create bills in seconds',
  },
  {
    icon: FaStore,
    title: 'Inventory Management',
    description: 'Track stock in real time',
  },
  {
    icon: FaChartBar,
    title: 'Detailed Reports',
    description: 'Insights to grow your business',
  },
];

const Field = ({ label, icon: Icon, placeholder, type = 'text', withEye = false, compact = false }) => (
  <label className="block">
    <span className={`${compact ? 'mb-1.5' : 'mb-2'} block text-[12px] font-semibold text-slate-950`}>
      {label}
    </span>
    <span className={`${compact ? 'h-[36px]' : 'h-[38px]'} flex items-center rounded-md border border-slate-200 bg-white px-3 shadow-[0_1px_0_rgba(15,23,42,0.02)] transition focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100`}>
      <Icon className="mr-4 text-[13px] text-slate-400" />
      <input
        type={type}
        placeholder={placeholder}
        className="min-w-0 flex-1 border-0 bg-transparent text-[14px] font-medium text-slate-800 outline-none placeholder:text-[#38468a]/90"
      />
      {withEye && <FaEyeSlash className="ml-3 text-[14px] text-slate-400" />}
    </span>
  </label>
);

const BrandPanel = () => (
  <aside className="relative hidden min-h-screen overflow-hidden bg-[#090033] text-white lg:block lg:w-1/2">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1300&q=90')",
      }}
    />
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,0,45,0.98)_0%,rgba(19,0,90,0.84)_43%,rgba(19,0,90,0.22)_100%)]" />
    <div className="relative z-10 flex min-h-screen max-w-[430px] flex-col justify-center px-14 py-10">
      <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 text-3xl shadow-2xl shadow-violet-950/40">
        <FaCoffee />
      </div>

      <h1 className="text-[34px] font-extrabold leading-none tracking-normal">POS Cafe</h1>
      <p className="mt-4 text-[17px] font-medium text-indigo-100/80">Point of Sale System</p>
      <div className="mt-6 h-1 w-[68px] rounded-full bg-violet-500" />

      <div className="mt-7">
        <h2 className="text-[16px] font-extrabold">Smart Billing. Happy Business.</h2>
        <p className="mt-4 max-w-[250px] text-[13px] leading-5 text-indigo-100/75">
          All-in-one POS solution to streamline your cafe operations.
        </p>
      </div>

      <div className="mt-9 space-y-6">
        {features.map(({ icon: Icon, title, description }) => (
          <div className="flex items-center gap-4" key={title}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/18 text-[16px] text-white">
              <Icon />
            </div>
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

const DotPattern = () => (
  <div className="absolute right-7 top-6 grid grid-cols-4 gap-2">
    {Array.from({ length: 16 }).map((_, index) => (
      <span key={index} className="h-1.5 w-1.5 rounded-full bg-violet-200/70" />
    ))}
  </div>
);

const AuthPage = ({ mode, onShowLogin, onShowRegister, onLogin }) => {
  const isRegister = mode === 'register';

  return (
    <main className="flex min-h-screen bg-white">
      <BrandPanel />

      <section className="relative flex min-h-screen flex-1 items-center justify-center px-6 py-6">
        <DotPattern />

        <div className="w-full max-w-[416px]">
          <div className={`${isRegister ? 'mb-3' : 'mb-5'} flex justify-center`}>
            <div className={`${isRegister ? 'h-14 w-14 text-2xl' : 'h-16 w-16 text-3xl'} flex items-center justify-center rounded-full bg-violet-600 text-white shadow-xl shadow-violet-100`}>
              <FaCoffee />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-[24px] font-extrabold leading-tight text-slate-950">
              {isRegister ? 'Create Your Account' : 'Welcome Back!'}
            </h2>
            <p className={`${isRegister ? 'mt-1' : 'mt-2'} text-[13px] font-semibold text-[#273175]`}>
              {isRegister
                ? 'Join POS Cafe and start managing your business smarter.'
                : 'Sign in to continue to POS Cafe'}
            </p>
          </div>

          <form className={`${isRegister ? 'mt-5 space-y-2.5' : 'mt-7 space-y-4'}`} onSubmit={(event) => event.preventDefault()}>
            {isRegister && (
              <Field compact label="Full Name" icon={FaUser} placeholder="Enter your full name" />
            )}
            <Field compact={isRegister} label="Username" icon={FaUser} placeholder="Enter your username" />
            {isRegister && (
              <Field compact label="Email Address" icon={FaEnvelope} placeholder="Enter your email address" />
            )}
            <Field
              compact={isRegister}
              label="Password"
              icon={FaLock}
              placeholder={isRegister ? 'Create a password' : 'Enter your password'}
              type="password"
              withEye
            />
            {isRegister && (
              <Field
                compact
                label="Confirm Password"
                icon={FaLock}
                placeholder="Confirm your password"
                type="password"
                withEye
              />
            )}

            {isRegister ? (
              <label className="flex items-center gap-2 pt-1 text-[12px] font-medium text-slate-500">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-3.5 w-3.5 accent-violet-600"
                />
                <span>
                  I agree to the{' '}
                  <button type="button" className="font-semibold text-violet-600">
                    Terms and Conditions
                  </button>{' '}
                  and{' '}
                  <button type="button" className="font-semibold text-violet-600">
                    Privacy Policy
                  </button>
                </span>
              </label>
            ) : (
              <div className="flex items-center justify-between pt-1 text-[13px]">
                <label className="flex items-center gap-2 font-medium text-slate-500">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 accent-violet-600"
                  />
                  Remember me
                </label>
                <button type="button" className="font-semibold text-violet-600">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={isRegister ? onShowLogin : onLogin}
              className={`${isRegister ? 'h-10' : 'h-10'} flex w-full items-center justify-center gap-3 rounded-[9px] bg-violet-600 text-[14px] font-extrabold text-white shadow-lg shadow-violet-100 transition hover:bg-violet-700`}
            >
              {isRegister ? <FaBriefcase /> : <FaLock />}
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className={`${isRegister ? 'my-3.5' : 'my-5'} flex items-center gap-4`}>
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-[13px] text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {isRegister ? (
            <p className="text-center text-[14px] text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onShowLogin}
                className="font-extrabold text-violet-600"
              >
                Sign In
              </button>
            </p>
          ) : (
            <button
              type="button"
              onClick={onShowRegister}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-[9px] border-2 border-violet-600 bg-white text-[14px] font-extrabold text-violet-600 transition hover:bg-violet-50"
            >
              <FaBriefcase />
              Register
            </button>
          )}

          <p className={`${isRegister ? 'mt-3' : 'mt-4'} text-center text-[12px] font-medium text-slate-400`}>
            © 2024 POS Cafe. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
