import classnames from 'classnames';

export function Table(props: Omit<JSX.TableHTMLAttributes<HTMLTableElement>, 'className'> & { className?: string }) {
  return <table {...props} className={classnames('border-collapse table-auto w-full text-sm', props.className)} />;
}

Table.Head = function (props: Omit<JSX.HTMLAttributes<HTMLTableSectionElement>, 'className'> & { className?: string }) {
  return <thead {...props} className={classnames(`border-b bg-gray-800`, props.className)} />;
};

Table.Body = function (props: JSX.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
};

Table.Row = function (
  props: Omit<JSX.HTMLAttributes<HTMLTableRowElement>, 'className'> & {
    isHoverable?: boolean;
    isHeader?: boolean;
    className?: string;
  },
) {
  const { isHoverable, isHeader, className, ...trProps } = props;
  const classNames = classnames(className, {
    'bg-white border-b': !isHeader,
    'transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer': isHoverable,
  });
  return <tr {...trProps} className={classNames} />;
};

Table.HeaderCell = function (
  props: Omit<JSX.ThHTMLAttributes<HTMLTableCellElement>, 'className'> & { className?: string },
) {
  return (
    <th {...props} className={classnames(`text-sm font-medium text-white px-6 py-4 text-left`, props.className)} />
  );
};

Table.Cell = function (props: Omit<JSX.TdHTMLAttributes<HTMLTableCellElement>, 'className'> & { className?: string }) {
  return (
    <td
      {...props}
      className={classnames(`px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left`, props.className)}
    />
  );
};
