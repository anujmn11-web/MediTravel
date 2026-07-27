import { useEffect, useMemo, useState } from 'react';
import { FaCheckCircle, FaClipboardList, FaPlus, FaSpinner, FaTrashAlt, FaUserCircle } from 'react-icons/fa';
import SectionHeader from '../components/SectionHeader';
import { createCondition } from '../utils/patientStorage';

const emptyConditionForm = {
  name: '',
  details: '',
};

function formatDate(value) {
  if (!value) return 'Recently added';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
}

function MedicalHistory({ currentUser, onUserUpdate }) {
  const [conditionForm, setConditionForm] = useState(emptyConditionForm);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const medicalConditions = useMemo(() => currentUser?.medicalConditions || [], [currentUser]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(''), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const updateConditionField = (event) => {
    const { name, value } = event.target;
    setConditionForm((currentForm) => ({ ...currentForm, [name]: value }));
    setError('');
  };

  const updateMedicalHistory = (nextConditions, message) => {
    const updatedUser = {
      ...currentUser,
      medicalConditions: nextConditions,
      updatedAt: new Date().toISOString(),
    };

    onUserUpdate(updatedUser);
    setToast(message);
  };

  const addCondition = (event) => {
    event.preventDefault();

    if (!conditionForm.name.trim()) {
      setError('Enter the medical condition name.');
      return;
    }

    setIsSaving(true);
    window.setTimeout(() => {
      const nextCondition = createCondition(conditionForm.name, conditionForm.details);
      updateMedicalHistory([nextCondition, ...medicalConditions], `${nextCondition.name} added to medical history.`);
      setConditionForm(emptyConditionForm);
      setIsSaving(false);
    }, 450);
  };

  const removeCondition = (conditionId) => {
    const nextConditions = medicalConditions.filter((condition) => condition.id !== conditionId);
    updateMedicalHistory(nextConditions, 'Condition removed from medical history.');
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Medical History" title="Keep your health profile current." description="Add new medical conditions whenever your health record changes so doctors can review better context." />

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-2xl text-teal-700">
                <FaUserCircle />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{currentUser.fullName}</h2>
                <p className="mt-1 text-sm text-slate-600">{currentUser.email}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 text-sm">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">City</p>
                <p className="mt-1 text-slate-600">{currentUser.city}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Allergies</p>
                <p className="mt-1 text-slate-600">{currentUser.allergies || 'Not added'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Current medications</p>
                <p className="mt-1 text-slate-600">{currentUser.medications || 'Not added'}</p>
              </div>
            </div>
          </aside>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3 text-teal-700">
              <FaClipboardList />
              <h2 className="text-xl font-semibold text-slate-900">Medical conditions</h2>
            </div>

            <form onSubmit={addCondition} className="mt-6 rounded-3xl border border-teal-100 bg-teal-50 p-5">
              <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr_auto] md:items-start">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Condition
                  <input name="name" value={conditionForm.name} onChange={updateConditionField} className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-teal-100 ${error ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500'}`} placeholder="Hypertension" />
                  {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Details
                  <textarea name="details" rows="3" value={conditionForm.details} onChange={updateConditionField} className="resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100" placeholder="Duration, severity, current treatment" />
                </label>
                <button disabled={isSaving} className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-400 md:mt-8">
                  {isSaving ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                  Add
                </button>
              </div>
            </form>

            {medicalConditions.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">No medical conditions are saved yet.</div>
            ) : (
              <div className="mt-6 grid gap-4">
                {medicalConditions.map((condition) => (
                  <article key={condition.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{condition.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">Added {formatDate(condition.addedAt)}</p>
                        {condition.details && <p className="mt-3 text-sm leading-7 text-slate-600">{condition.details}</p>}
                      </div>
                      <button type="button" onClick={() => removeCondition(condition.id)} className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:border-rose-300">
                        <FaTrashAlt />
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {toast && (
        <div className="fixed right-4 top-24 z-[80] flex max-w-sm items-start gap-3 rounded-2xl border border-teal-100 bg-white p-4 text-sm text-teal-800 shadow-xl" role="status">
          <FaCheckCircle className="mt-0.5 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </main>
  );
}

export default MedicalHistory;
