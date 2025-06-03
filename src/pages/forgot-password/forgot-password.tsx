import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  const [userEmail, updateEmail] = useState('');
  const [submitError, updateError] = useState<Error | null>(null);

  const redirect = useNavigate();

  const onFormSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    updateError(null);

    forgotPasswordApi({ email: userEmail })
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        redirect('/reset-password', { replace: true });
      })
      .catch((err) => updateError(err));
  };

  return (
    <ForgotPasswordUI
      errorText={submitError?.message}
      email={userEmail}
      setEmail={updateEmail}
      handleSubmit={onFormSubmit}
    />
  );
};
