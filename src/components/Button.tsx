export interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  danger?: boolean;
}

export default function Button(props: ButtonProps) {
  const { danger, className, ...buttonProps } = props;
  if (danger) {
    return (
      <button
        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 ${className}`}
        {...buttonProps}
      />
    );
  }
  return (
    <button
      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
      {...buttonProps}
    />
  );
}
