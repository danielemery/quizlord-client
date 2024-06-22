export interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  danger?: boolean;
  warning?: boolean;
}

const disabledClasses =
  'disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed';
const commonClasses = `inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${disabledClasses}`;

export default function Button(props: ButtonProps) {
  const { danger, warning, className, ...buttonProps } = props;

  if (danger) {
    return (
      <button
        className={`${commonClasses} bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 ${className}`}
        {...buttonProps}
      />
    );
  }

  if (warning) {
    return (
      <button
        className={`${commonClasses} bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${className}`}
        {...buttonProps}
      />
    );
  }

  return (
    <button
      className={`${commonClasses} bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
      {...buttonProps}
    />
  );
}
