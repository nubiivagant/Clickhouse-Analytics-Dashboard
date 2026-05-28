import React, { useState } from 'react';

const defaultFormState = {
  gender: 'female',
  race_ethnicity: 'group A',
  parental_level_of_education: "bachelor's degree",
  lunch: 'standard',
  test_preparation_course: 'none',
  math_score: 0,
  reading_score: 0,
  writing_score: 0,
};

const AddStudentModal = ({ isOpen, onClose, onSubmit, submitting }) => {
  const [form, setForm] = useState(defaultFormState);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNumberChange = (field, value) => {
    const parsed = parseInt(value, 10);
    handleChange(field, Number.isNaN(parsed) ? '' : parsed);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  const close = () => {
    setForm(defaultFormState);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 dark:text-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Add Student</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Insert a new student record and refresh analytics instantly.</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Gender</span>
              <select
                value={form.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Ethnicity</span>
              <select
                value={form.race_ethnicity}
                onChange={(e) => handleChange('race_ethnicity', e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="group A">Group A</option>
                <option value="group B">Group B</option>
                <option value="group C">Group C</option>
                <option value="group D">Group D</option>
                <option value="group E">Group E</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Parent Education</span>
              <select
                value={form.parental_level_of_education}
                onChange={(e) => handleChange('parental_level_of_education', e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="high school">High School</option>
                <option value="some high school">Some High School</option>
                <option value="some college">Some College</option>
                <option value="associate's">Associate's</option>
                <option value="bachelor's degree">Bachelor's Degree</option>
                <option value="master's degree">Master's Degree</option>
                <option value="graduate">Graduate</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Lunch</span>
              <select
                value={form.lunch}
                onChange={(e) => handleChange('lunch', e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="standard">Standard</option>
                <option value="free/reduced">Free/Reduced</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Test Preparation</span>
              <select
                value={form.test_preparation_course}
                onChange={(e) => handleChange('test_preparation_course', e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="none">None</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Math Score</span>
              <input
                type="number"
                min="0"
                max="100"
                value={form.math_score}
                onChange={(e) => handleNumberChange('math_score', e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Reading Score</span>
              <input
                type="number"
                min="0"
                max="100"
                value={form.reading_score}
                onChange={(e) => handleNumberChange('reading_score', e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Writing Score</span>
              <input
                type="number"
                min="0"
                max="100"
                value={form.writing_score}
                onChange={(e) => handleNumberChange('writing_score', e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={close}
              className="rounded-full border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Adding...' : '+ Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
