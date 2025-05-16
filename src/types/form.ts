type FormProps<T, TReturn> = {
  onCancel?: () => void;
  onSaved?: (savedData: TReturn) => void;
  initialData?: T | null;
}

type EditFormProps<T, TReturn> = {
  onCancel?: () => void;
  onSaved?: (savedData: TReturn) => void;
  id: T;
}

export { type FormProps, type EditFormProps };
