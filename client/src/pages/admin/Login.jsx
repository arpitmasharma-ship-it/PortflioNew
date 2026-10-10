import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Seo } from '../../components/common/Seo.jsx';

export default function Login() {
  const { login, setup, needsSetup, user, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  if (loading) {
    return <p className="p-10 text-muted">Loading…</p>;
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  async function onSubmit(values) {
    setError('');
    try {
      if (needsSetup) await setup(values);
      else await login({ email: values.email, password: values.password });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to continue');
    }
  }

  return (
    <>
      <Seo title="Admin" path="/login" />
      <div className="flex min-h-screen items-center justify-center bg-paper px-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md rounded-2xl border border-line bg-cream/50 p-8"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-sage">Private</p>
          <h1 className="mt-2 font-display text-3xl">
            {needsSetup ? 'Create the first admin' : 'Sign in'}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {needsSetup
              ? 'This works only once. There is no public registration.'
              : 'Restricted to the site owner.'}
          </p>
          {needsSetup ? (
            <>
              <label className="mt-6 block text-sm" htmlFor="name">
                Name
              </label>
              <input id="name" className="mt-1 w-full rounded-xl border border-line px-3 py-2" {...register('name')} />
            </>
          ) : null}
          <label className="mt-4 block text-sm" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 w-full rounded-xl border border-line px-3 py-2"
            {...register('email', { required: true })}
          />
          <label className="mt-4 block text-sm" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="mt-1 w-full rounded-xl border border-line px-3 py-2"
            {...register('password', { required: true, minLength: needsSetup ? 10 : 1 })}
          />
          {needsSetup ? (
            <p className="mt-1 text-xs text-muted">At least 10 characters.</p>
          ) : null}
          {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
          <Button className="mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait…' : needsSetup ? 'Create admin' : 'Sign in'}
          </Button>
        </form>
      </div>
    </>
  );
}
