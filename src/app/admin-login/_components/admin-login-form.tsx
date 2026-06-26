'use client';

import { useActionState } from 'react';
import { loginAdmin, type AdminLoginState } from '@/app/admin/_actions/auth-actions';
import styles from '../admin-login.module.css';

const INITIAL_LOGIN_STATE: AdminLoginState = {
  status: 'idle',
  message: '',
};

export function AdminLoginForm({ nextPath }: { nextPath: string }): React.JSX.Element {
  const [state, formAction, isPending] = useActionState(loginAdmin, INITIAL_LOGIN_STATE);

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="next" value={nextPath} />
      <div className={styles.field}>
        <label className={styles.label} htmlFor="admin-username">
          Username
        </label>
        <input
          autoComplete="username"
          className={styles.input}
          id="admin-username"
          name="username"
          required
          type="text"
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="admin-password">
          Password
        </label>
        <input
          autoComplete="current-password"
          className={styles.input}
          id="admin-password"
          minLength={12}
          name="password"
          required
          type="password"
        />
      </div>
      {state.status === 'error' ? (
        <p className={styles.error} role="alert">
          {state.message}
        </p>
      ) : null}
      <button className={styles.button} disabled={isPending} type="submit">
        {isPending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
