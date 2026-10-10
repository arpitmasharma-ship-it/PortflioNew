import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api, getErrorMessage } from '../services/api.js';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { Button } from '../components/common/Button.jsx';
import { Container, PageHeader } from '../components/common/Container.jsx';
import { Seo } from '../components/common/Seo.jsx';
import { SocialRow } from '../components/common/SocialRow.jsx';

export default function Contact() {
  const { profile, social } = usePortfolio();
  const [status, setStatus] = useState({ type: '', message: '' });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(values) {
    setStatus({ type: '', message: '' });
    try {
      const res = await api.post('/contact', values);
      setStatus({ type: 'success', message: res.data.message });
      reset();
    } catch (error) {
      setStatus({ type: 'error', message: getErrorMessage(error, 'Could not send the message.') });
    }
  }

  return (
    <>
      <Seo title="Contact" path="/contact" />
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <PageHeader
            eyebrow="Contact"
            title="Say hello."
            description="If you are hiring, collaborating, or just want to talk about building things, I read every message."
          />
          {profile?.email ? (
            <a className="mt-6 inline-block text-sage-dark underline" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          ) : null}
          <div className="mt-6">
            <SocialRow links={social} />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
          <label className="block text-sm font-medium" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2.5"
            {...register('name', { required: 'Please add your name', minLength: 2 })}
          />
          {errors.name ? <p className="mt-1 text-sm text-danger">{errors.name.message}</p> : null}

          <label className="mt-4 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2.5"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email ? <p className="mt-1 text-sm text-danger">{errors.email.message}</p> : null}

          <label className="mt-4 block text-sm font-medium" htmlFor="inquiryType">
            What is this about?
          </label>
          <select
            id="inquiryType"
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2.5"
            {...register('inquiryType')}
          >
            <option value="general">General</option>
            <option value="internship">Internship inquiry</option>
            <option value="collaboration">Collaboration</option>
            <option value="other">Other</option>
          </select>

          <label className="mt-4 block text-sm font-medium" htmlFor="subject">
            Subject
          </label>
          <input
            id="subject"
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2.5"
            {...register('subject', { required: 'Add a subject', minLength: 3 })}
          />
          {errors.subject ? <p className="mt-1 text-sm text-danger">{errors.subject.message}</p> : null}

          <label className="mt-4 block text-sm font-medium" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            rows={6}
            className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2.5"
            {...register('message', {
              required: 'Write a short message',
              minLength: { value: 20, message: 'A little more detail helps (20+ characters)' },
            })}
          />
          {errors.message ? <p className="mt-1 text-sm text-danger">{errors.message.message}</p> : null}

          {status.message ? (
            <p className={`mt-4 text-sm ${status.type === 'success' ? 'text-sage-dark' : 'text-danger'}`}>
              {status.message}
            </p>
          ) : null}

          <Button className="mt-6" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : 'Send message'}
          </Button>
        </form>
      </Container>
    </>
  );
}
