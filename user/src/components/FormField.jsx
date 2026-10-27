import { useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * FormField — Reusable form field component.
 * Renders either an <input> or <select> based on the `type` prop.
 */
export default function FormField({
  id, label, type = 'text', name, value,
  onChange, onBlur, error, placeholder, hint, autoComplete, options = [],
}) {
  const inputRef = useRef(null);
  const hasError = Boolean(error);

  useEffect(() => {
    if (hasError && inputRef.current) {
      inputRef.current.classList.remove('animate-shake');
      void inputRef.current.offsetWidth;
      inputRef.current.classList.add('animate-shake');
    }
  }, [error]);

  const baseClass = `input-field w-full px-4 py-3 rounded-xl text-sm ${hasError ? 'error' : ''}`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold"
        style={{ color: hasError ? '#EF4444' : '#CBD5E1' }}>
        {label}
      </label>

      {type === 'select' ? (
        <select ref={inputRef} id={id} name={name} value={value}
          onChange={onChange} onBlur={onBlur} className={baseClass}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input ref={inputRef} id={id} type={type} name={name} value={value}
          onChange={onChange} onBlur={onBlur} placeholder={placeholder}
          autoComplete={autoComplete} className={baseClass} aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined} />
      )}

      {hint && !hasError && (
        <p id={`${id}-hint`} className="text-xs" style={{ color: '#475569' }}>{hint}</p>
      )}
      {hasError && (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1.5 text-xs"
          style={{ color: '#EF4444' }}>
          <AlertCircle size={12} className="flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
