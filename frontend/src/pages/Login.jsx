import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSpinner, FaUserShield } from 'react-icons/fa';
import SectionHeader from '../components/SectionHeader';
import { createCondition, findPatient } from '../utils/patientStorage';
import { getCitiesForState, INDIA_STATES } from '../data/content';

const emptyLoginForm = {
  email: '',
  password: '',
};

const emptySignupForm = {
  fullName: '',
  email: '',
  password: '',
  state: '',
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
    if (!signupForm.state) nextErrors.state = 'Select your state.';
    if (!signupForm.city) nextErrors.city = 'Select your city.';
    if (signupConditions.length === 0) nextErrors.conditions = 'Add at least one condition or write No known conditions.';
    if (findPatient(signupForm.email)) nextErrors.email = 'An account with this email already exists.';

    return nextErrors;
  };

  const signupCityOptions = useMemo(
    () => (signupForm.state ? getCitiesForState(signupForm.state) : []),
    [signupForm.state],
  );

  const handleStateSelect = (e) => {
    const { value } = e.target;
    setSignupForm((f) => ({ ...f, state: value, city: '' }));
    setErrors((err) => {
      const next = { ...err };
      delete next.state;
      delete next.city;
      return next;
    });
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
        state: signupForm.state,
        city: signupForm.city,
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
    <main style={{ backgroundColor: 'var(--color-bg)' }} className="min-h-screen px-4 py-20 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="Patient Account" title="Create your profile with medical history." description="Save your conditions during signup, then keep your health record updated as your needs change." />

        <section style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }} className="mt-10 overflow-hidden rounded-[2rem] border shadow-sm">
          <div style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }} className="grid border-b p-2 sm:grid-cols-2">
            {['signup', 'login'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMode(item);
                  setErrors({});
                }}
                style={{
                  backgroundColor: mode === item ? 'var(--color-accent)' : 'transparent',
                  color: mode === item ? 'white' : 'var(--color-text-secondary)',
                }}
                className="rounded-full px-5 py-3 text-sm font-semibold transition hover:opacity-80"
              >
                {item === 'signup' ? 'Sign Up' : 'Login'}
              </button>
            ))}
          </div>

          {mode === 'signup' ? (
            <form onSubmit={handleSignup} className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.85fr]">
              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label style={{ color: 'var(--color-text)' }} className="grid gap-2 text-sm font-medium">
                    Full name
                    <input name="fullName" value={signupForm.fullName} onChange={updateSignupField} style={{
                      borderColor: errors.fullName ? 'var(--color-danger)' : 'var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text)',
                    }} className="rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4" placeholder="Patient name" />
                    {errors.fullName && <span style={{ color: 'var(--color-danger)' }} className="text-xs font-medium">{errors.fullName}</span>}
                  </label>
                  <label style={{ color: 'var(--color-text)' }} className="grid gap-2 text-sm font-medium">
                    State / UT
                    <select
                      name="state"
                      value={signupForm.state}
                      onChange={handleStateSelect}
                      style={{
                        borderColor: errors.state ? 'var(--color-danger)' : 'var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text)',
                      }}
                      className="rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4"
                    >
                      <option value="">Select state</option>
                      {INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <span style={{ color: 'var(--color-danger)' }} className="text-xs font-medium">{errors.state}</span>}
                  </label>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label style={{ color: 'var(--color-text)' }} className="grid gap-2 text-sm font-medium">
                    City
                    <select
                      name="city"
                      value={signupForm.city}
                      onChange={updateSignupField}
                      disabled={!signupForm.state}
                      style={{
                        borderColor: errors.city ? 'var(--color-danger)' : 'var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-text)',
                      }}
                      className="rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 disabled:opacity-50"
                    >
                      <option value="">Select city</option>
                      {signupCityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.city && <span style={{ color: 'var(--color-danger)' }} className="text-xs font-medium">{errors.city}</span>}
                  </label>

                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label style={{ color: 'var(--color-text)' }} className="grid gap-2 text-sm font-medium">
                    Email
                    <input name="email" type="email" value={signupForm.email} onChange={updateSignupField} style={{
                      borderColor: errors.email ? 'var(--color-danger)' : 'var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text)',
                    }} className="rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4" placeholder="you@example.com" />
                    {errors.email && <span style={{ color: 'var(--color-danger)' }} className="text-xs font-medium">{errors.email}</span>}
                  </label>
                  <label style={{ color: 'var(--color-text)' }} className="grid gap-2 text-sm font-medium">
                    Password
                    <input name="password" type="password" value={signupForm.password} onChange={updateSignupField} style={{
                      borderColor: errors.password ? 'var(--color-danger)' : 'var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text)',
                    }} className="rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4" placeholder="Minimum 6 characters" />
                    {errors.password && <span style={{ color: 'var(--color-danger)' }} className="text-xs font-medium">{errors.password}</span>}
                  </label>
                </div>

                <label style={{ color: 'var(--color-text)' }} className="grid gap-2 text-sm font-medium">
                  Allergies
                  <textarea name="allergies" rows="3" value={signupForm.allergies} onChange={updateSignupField} style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text)',
                  }} className="resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4" placeholder="Penicillin, dust, peanuts" />
                </label>

                <label style={{ color: 'var(--color-text)' }} className="grid gap-2 text-sm font-medium">
                  Current medications
                  <textarea name="medications" rows="3" value={signupForm.medications} onChange={updateSignupField} style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text)',
                  }} className="resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4" placeholder="Medicine name, dosage, frequency" />
                </label>
              </div>

              <div style={{ borderColor: 'var(--color-accent-light)', backgroundColor: 'var(--color-accent-light)' }} className="rounded-3xl border p-5">
                <div style={{ color: 'var(--color-accent)' }} className="flex items-center gap-3">
                  <FaUserShield />
                  <h2 style={{ color: 'var(--color-text)' }} className="text-lg font-semibold">Medical conditions</h2>
                </div>
                <p style={{ color: 'var(--color-text-secondary)' }} className="mt-2 text-sm">{conditionCountLabel}</p>

                <div className="mt-5 grid gap-3">
                  <input name="name" value={conditionForm.name} onChange={updateConditionField} style={{
                    borderColor: errors.conditions ? 'var(--color-danger)' : 'var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text)',
                  }} className="rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4" placeholder="Asthma, diabetes, migraine" />
                  <textarea name="details" rows="3" value={conditionForm.details} onChange={updateConditionField} style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text)',
                  }} className="resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4" placeholder="Diagnosis year, severity, doctor advice" />
                  {errors.conditions && <span style={{ color: 'var(--color-danger)' }} className="text-xs font-medium">{errors.conditions}</span>}
                  <button type="button" onClick={addSignupCondition} style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-accent)' }} className="inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition hover:opacity-80">
                    <FaPlus />
                    Add condition
                  </button>
                </div>

                {signupConditions.length > 0 && (
                  <div className="mt-5 space-y-3">
                    {signupConditions.map((condition) => (
                      <div key={condition.id} style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }} className="rounded-2xl border p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p style={{ color: 'var(--color-text)' }} className="font-semibold">{condition.name}</p>
                            {condition.details && <p style={{ color: 'var(--color-text-secondary)' }} className="mt-1 text-sm">{condition.details}</p>}
                          </div>
                          <button type="button" onClick={() => removeSignupCondition(condition.id)} style={{ color: 'var(--color-danger)' }} className="text-xs font-semibold">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} style={{ 
                  backgroundColor: 'var(--color-accent)',
                  boxShadow: '0 4px 15px rgba(13, 148, 136, 0.3)',
                  transition: 'all 0.3s ease'
                }} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold text-white shadow-lg transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed">
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaUserShield />}
                  {isSubmitting ? 'Creating profile...' : 'Create patient profile'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="mx-auto grid max-w-lg gap-5 p-6 sm:p-8">
              {errors.login && <div style={{ borderColor: 'var(--color-danger-light)', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }} className="rounded-2xl border p-4 text-sm font-medium">{errors.login}</div>}
              <input name="email" value={loginForm.email} onChange={updateLoginField} type="email" placeholder="Email" style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
              }} className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4" required />
              <input name="password" value={loginForm.password} onChange={updateLoginField} type="password" placeholder="Password" style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
              }} className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4" required />
              <button disabled={isSubmitting} style={{ 
                backgroundColor: 'var(--color-accent)',
                boxShadow: '0 4px 15px rgba(13, 148, 136, 0.3)',
                transition: 'all 0.3s ease'
              }} className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold text-white transform hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed">
                {isSubmitting && <FaSpinner className="animate-spin" />}
                {isSubmitting ? 'Opening profile...' : 'Login'}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

export default Login;
