import { FC, useEffect, useState, SyntheticEvent, ChangeEvent } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserData, updateUser } from '../../slices/user-slice';
import { ProfileUI } from '@ui-pages';

export const Profile: FC = () => {
  const currentUser = useSelector(selectUserData);
  const dispatch = useDispatch();

  const [formState, setFormState] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      name: currentUser?.name || '',
      email: currentUser?.email || ''
    }));
  }, [currentUser]);

  const hasChanges =
    formState.name !== currentUser?.name ||
    formState.email !== currentUser?.email ||
    Boolean(formState.password);

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    dispatch(updateUser(formState));
  };

  const onCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    setFormState({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      password: ''
    });
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <ProfileUI
      formValue={formState}
      isFormChanged={hasChanges}
      handleCancel={onCancel}
      handleSubmit={onSubmit}
      handleInputChange={onInputChange}
    />
  );
};
