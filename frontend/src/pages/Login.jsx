import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSpinner, FaUserShield } from 'react-icons/fa';
import SectionHeader from '../components/SectionHeader';
import { createCondition, findPatient } from '../utils/patientStorage';

const emptyLoginForm = {
  email: '',
  password: '',
};

const emptySignupForm = {
  fullName: '',
  email: '',
  password: '',
  city: '',
  allergies: '',
  medications: '',
};

const emptyConditionForm = {
  name: '',
  details: '',
};

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signup');
  const [loginForm, setLoginForm] = useState(emptyLoginForm);
  const [signupForm, setSignupForm] = useState(emptySignupForm);
  const [conditionForm, setConditionForm] = useState(emptyConditionForm);
  const [signupConditions, setSignupConditions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const conditionCountLabel = useMemo(() => {
    if (signupConditions.length === 0) return 'No conditions added yet';
    if (signupConditions.length === 1) return '1 condition added';
    return `${signupConditions.length} conditions added`;
  }, [signupConditions.length]);

  const updateLoginField = (event) => {
    const { name, value } = event.target;
    setLoginForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors({});
  };

  const updateSignupField = (event) => {
    const { name, value } = event.target;
    setSignupForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => {
      if (!currentErrors[name]) return currentErrors;
      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const updateConditionField = (event) => {
    const { name, value } = event.target;
    setConditionForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => {
      if (!currentErrors.conditions) return currentErrors;
      const nextErrors = { ...currentErrors };
      delete nextErrors.conditions;
      return nextErrors;
    });
  };

  const addSignupCondition = () => {
    const conditionName = conditionForm.name.trim();
    if (!conditionName) {
      setErrors((currentErrors) => ({ ...currentErrors, conditions: 'Add at least one condition or write No known conditions.' }));
      return;
    }

    setSignupConditions((currentConditions) => [...currentConditions, createCondition(conditionName, conditionForm.details)]);
    setConditionForm(emptyConditionForm);
  };

  const removeSignupCondition = (conditionId) => {
    setSignupConditions((currentConditions) => currentConditions.filter((condition) => condition.id !== conditionId));
  };

  const validateSignup = () => {
    const nextErrors = {};

    if (!signupForm.fullName.trim()) nextErrors.fullName = 'Enter your full name.';
    if (!signupForm.email.includes('@')) nextErrors.email = 'Enter a valid email address.';
    if (signupForm.password.length < 6) nextErrors.password = 'Use at least 6 characters.';
    if (!signupForm.city.trim()) nextErrors.city = 'Enter your city.';
    if (signupConditions.length === 0) nextErrors.conditions = 'Add at least one condition or write No known conditions.';
    if (findPatient(signupForm.email)) nextErrors.email = 'An account with this email already exists.';

    return nextErrors;
  };

  const handleSignup = (event) => {
    event.preventDefault();

    const nextErrors = validateSignup();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      const patient = {
        id: `patient-${Date.now()}`,
        fullName: signupForm.fullName.trim(),
        email: signupForm.email.trim().toLowerCase(),
        password: signupForm.password,
        city: signupForm.city.trim(),
        allergies: signupForm.allergies.trim(),
        medications: signupForm.medications.trim(),
        medicalConditions: signupConditions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onLogin(patient);
      setIsSubmitting(false);
      navigate('/medical-history');
    }, 550);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const patient = findPatient(loginForm.email);

    if (!patient || patient.password !== loginForm.password) {
      setErrors({ login: 'Email or password does not match a saved patient account.' });
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      onLogin(patient);
      setIsSubmitting(false);
      navigate('/medical-history');
    }, 450);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="Patient Account" title="Create your profile with medical history." description="Save your conditions during signup, then keep your health record updated as your needs change." />

        <section className="mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid border-b border-slate-200 bg-slate-50 p-2 sm:grid-cols-2">
            {['signup', 'login'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMode(item);
                  setErrors({});
                }}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${mode === item ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' : 'text-slate-600 hover:bg-white'}`}
              >
                {item === 'signup' ? 'Sign Up' : 'Login'}
              </button>
            ))}
          </div>

          {mode === 'signup' ? (
            <form onSubmit={handleSignup} className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.85fr]">
              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Full name
                    <input name="fullName" value={signupForm.fullName} onChange={updateSignupField} className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-teal-100 ${errors.fullName ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500'}`} placeholder="Patient name" />
                    {errors.fullName && <span className="text-xs font-medium text-rose-600">{errors.fullName}</span>}
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    City
                    <input name="city" value={signupForm.city} onChange={updateSignupField} className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-teal-100 ${errors.city ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500'}`} placeholder="Mumbai" />
                    {errors.city && <span className="text-xs font-medium text-rose-600">{errors.city}</span>}
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Email
                    <input name="email" type="email" value={signupForm.email} onChange={updateSignupField} className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-teal-100 ${errors.email ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500'}`} placeholder="you@example.com" />
                    {errors.email && <span className="text-xs font-medium text-rose-600">{errors.email}</span>}
                  </label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Password
                    <input name="password" type="password" value={signupForm.password} onChange={updateSignupField} className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-teal-100 ${errors.password ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500'}`} placeholder="Minimum 6 characters" />
                    {errors.password && <span className="text-xs font-medium text-rose-600">{errors.password}</span>}
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Allergies
                  <textarea name="allergies" rows="3" value={signupForm.allergies} onChange={updateSignupField} className="resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100" placeholder="Penicillin, dust, peanuts" />
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Current medications
                  <textarea name="medications" rows="3" value={signupForm.medications} onChange={updateSignupField} className="resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100" placeholder="Medicine name, dosage, frequency" />
                </label>
              </div>

              <div className="rounded-3xl border border-teal-100 bg-teal-50 p-5">
                <div className="flex items-center gap-3 text-teal-700">
                  <FaUserShield />
                  <h2 className="text-lg font-semibold text-slate-900">Medical conditions</h2>
                </div>
                <p className="mt-2 text-sm text-slate-600">{conditionCountLabel}</p>

                <div className="mt-5 grid gap-3">
                  <input name="name" value={conditionForm.name} onChange={updateConditionField} className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-teal-100 ${errors.conditions ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500'}`} placeholder="Asthma, diabetes, migraine" />
                  <textarea name="details" rows="3" value={conditionForm.details} onChange={updateConditionField} className="resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100" placeholder="Diagnosis year, severity, doctor advice" />
                  {errors.conditions && <span className="text-xs font-medium text-rose-600">{errors.conditions}</span>}
                  <button type="button" onClick={addSignupCondition} className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-200 bg-white px-5 py-3 text-sm font-semibold text-teal-700 transition hover:border-teal-400">
                    <FaPlus />
                    Add condition
                  </button>
                </div>

                {signupConditions.length > 0 && (
                  <div className="mt-5 space-y-3">
                    {signupConditions.map((condition) => (
                      <div key={condition.id} className="rounded-2xl border border-teal-100 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{condition.name}</p>
                            {condition.details && <p className="mt-1 text-sm text-slate-600">{condition.details}</p>}
                          </div>
                          <button type="button" onClick={() => removeSignupCondition(condition.id)} className="text-xs font-semibold text-rose-600">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-400">
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaUserShield />}
                  {isSubmitting ? 'Creating profile' : 'Create patient profile'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="mx-auto grid max-w-lg gap-5 p-6 sm:p-8">
              {errors.login && <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-700">{errors.login}</div>}
              <input name="email" value={loginForm.email} onChange={updateLoginField} type="email" placeholder="Email" className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100" required />
              <input name="password" value={loginForm.password} onChange={updateLoginField} type="password" placeholder="Password" className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100" required />
              <button disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:bg-teal-400">
                {isSubmitting && <FaSpinner className="animate-spin" />}
                {isSubmitting ? 'Opening profile' : 'Login'}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

export default Login;
