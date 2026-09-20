import type { NoteFormValues } from '../../types/note';
import css from './NoteForm.module.css';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useId } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createNote } from '@/lib/api';

interface NoteFormProps {
  onClose: () => void;
}
const FormSchema = Yup.object().shape({
  title: Yup.string().min(3).max(50).required('Title is required'),
  content: Yup.string().max(500),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required'),
});

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

export default function NoteForm({ onClose }: NoteFormProps) {
  const fieldId = useId();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
    onError() {
      toast.error('Failed to create note');
    },
  });

  const handleSubmit = (values: NoteFormValues) => {
    mutate(values);
  };

  return (
    <Formik initialValues={initialValues} validationSchema={FormSchema} onSubmit={handleSubmit}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field type="text" name="title" className={css.input} id={`${fieldId}-title`} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field as="select" id={`${fieldId}-tag`} name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={isPending}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
