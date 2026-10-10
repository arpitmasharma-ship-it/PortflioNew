import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api, getErrorMessage } from '../../services/api.js';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { Button } from '../../components/common/Button.jsx';
import { UploadField } from '../../components/admin/UploadField.jsx';

export default function AdminProfile() {
  const { refresh } = usePortfolio();
  const { register, handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = useForm();
  const [status, setStatus] = useState({ type: '', text: '' });
  const resumeUrl = watch('resumeUrl');
  const profileImage = watch('profileImage');

  useEffect(() => {
    api.get('/profile').then((res) => {
      const p = res.data.data || {};
      reset({
        fullName: p.fullName || '',
        professionalTitle: p.professionalTitle || '',
        location: p.location || '',
        email: p.email || '',
        headline: p.headline || '',
        shortIntro: p.shortIntro || '',
        about: p.about || '',
        interests: p.interests || '',
        approach: p.approach || '',
        careerGoals: p.careerGoals || '',
        profileImage: p.profileImage || '',
        resumeUrl: p.resumeUrl || '',
        isAvailable: p.availability?.isAvailable ?? true,
        availabilityLabel: p.availability?.label || '',
        siteTitle: p.seo?.siteTitle || '',
        seoDescription: p.seo?.description || '',
      });
    });
  }, [reset]);

  async function onSubmit(values) {
    setStatus({ type: '', text: '' });
    try {
      await api.patch('/admin/profile', {
        fullName: values.fullName,
        professionalTitle: values.professionalTitle,
        location: values.location,
        email: values.email,
        headline: values.headline,
        shortIntro: values.shortIntro,
        about: values.about,
        interests: values.interests,
        approach: values.approach,
        careerGoals: values.careerGoals,
        profileImage: values.profileImage,
        resumeUrl: values.resumeUrl,
        availability: { isAvailable: Boolean(values.isAvailable), label: values.availabilityLabel },
        seo: { siteTitle: values.siteTitle, description: values.seoDescription },
      });
      await refresh();
      setStatus({ type: 'success', text: 'Profile changes saved successfully.' });
    } catch (error) {
      setStatus({ type: 'error', text: getErrorMessage(error, 'Failed to update profile.') });
    }
  }

  const renderField = (id, label, options = {}) => (
    <div className="mt-4">
      <label className="block text-sm font-medium text-ink" htmlFor={id}>
        {label}
      </label>
      {options.area ? (
        <textarea
          id={id}
          rows={options.rows || 4}
          placeholder={options.placeholder || ''}
          className="mt-1 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm transition focus:border-sage focus:outline-none"
          {...register(id)}
        />
      ) : (
        <input
          id={id}
          type={options.type || 'text'}
          placeholder={options.placeholder || ''}
          className="mt-1 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm transition focus:border-sage focus:outline-none"
          {...register(id)}
        />
      )}
    </div>
  );

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Profile & Story</h1>
          <p className="mt-1 text-sm text-muted">
            The single source of truth for your headline, narrative, and public metadata.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
        {/* Section 1: Core Identity */}
        <section className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
          <h2 className="font-display text-xl text-ink">Basic Information</h2>
          <p className="mt-1 text-xs text-muted">Primary name, professional title, and location shown in hero sections.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {renderField('fullName', 'Full Name', { placeholder: 'e.g. Arpit' })}
            {renderField('professionalTitle', 'Professional Title', { placeholder: 'e.g. Software Engineer' })}
            {renderField('location', 'Location', { placeholder: 'e.g. India' })}
            {renderField('email', 'Contact Email', { type: 'email', placeholder: 'hello@example.com' })}
          </div>
          <div className="mt-2">
            {renderField('headline', 'Hero Headline', {
              placeholder: 'Building useful things for the web.',
            })}
          </div>
        </section>

        {/* Section 2: Narrative & Deep Dive */}
        <section className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
          <h2 className="font-display text-xl text-ink">About & Narrative</h2>
          <p className="mt-1 text-xs text-muted">The long-form story displayed on your dedicated About page.</p>
          {renderField('shortIntro', 'Short Intro (Hero summary)', { area: true, rows: 3 })}
          {renderField('about', 'The Path So Far (Full About)', { area: true, rows: 6 })}
          {renderField('interests', 'What I Care About', { area: true, rows: 4 })}
          {renderField('approach', 'How I Learn and Build', { area: true, rows: 4 })}
          {renderField('careerGoals', 'Where I Am Headed', { area: true, rows: 3 })}
        </section>

        {/* Section 3: Media & Resume */}
        <section className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
          <h2 className="font-display text-xl text-ink">Media & Resume</h2>
          <p className="mt-1 text-xs text-muted">Upload directly or paste existing Cloudinary / hosted links.</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <UploadField
                label="Profile Avatar"
                value={profileImage}
                onUploaded={(url) => setValue('profileImage', url)}
              />
              <input type="hidden" {...register('profileImage')} />
              {renderField('profileImage', 'Or Image URL', { placeholder: 'https://...' })}
            </div>
            <div>
              <UploadField
                label="Resume Document (PDF)"
                value={resumeUrl}
                onUploaded={(url) => setValue('resumeUrl', url)}
              />
              <input type="hidden" {...register('resumeUrl')} />
              {renderField('resumeUrl', 'Or Resume URL', { placeholder: 'https://...' })}
            </div>
          </div>
        </section>

        {/* Section 4: Availability & SEO */}
        <section className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
          <h2 className="font-display text-xl text-ink">Availability & Search Metadata</h2>
          <p className="mt-1 text-xs text-muted">Status pill in hero and OpenGraph meta tags for link sharing.</p>
          
          <div className="mt-4 flex items-center gap-3">
            <input
              id="isAvailable"
              type="checkbox"
              className="h-4 w-4 rounded border-line text-sage focus:ring-sage"
              {...register('isAvailable')}
            />
            <label htmlFor="isAvailable" className="text-sm font-medium text-ink">
              Show "Open to work" badge on home page
            </label>
          </div>

          <div className="mt-4">
            {renderField('availabilityLabel', 'Availability Badge Text', {
              placeholder: 'Open to internships and collaborations',
            })}
          </div>

          <div className="mt-6 border-t border-line/60 pt-4">
            {renderField('siteTitle', 'SEO Site Title', { placeholder: 'Arpit — Software Engineer' })}
            {renderField('seoDescription', 'Meta Description', { area: true, rows: 3 })}
          </div>
        </section>

        {status.text ? (
          <div
            className={`rounded-xl border p-4 text-sm ${
              status.type === 'success'
                ? 'border-sage/40 bg-[#e7eee8] text-sage-dark'
                : 'border-danger/30 bg-[#fbf0f0] text-danger'
            }`}
          >
            {status.text}
          </div>
        ) : null}

        <div className="flex items-center gap-4">
          <Button disabled={isSubmitting}>
            {isSubmitting ? 'Saving changes…' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
