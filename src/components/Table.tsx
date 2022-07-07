import classnames from "classnames";

export function Table(props: JSX.HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      {...props}
      className={classnames(
        `border-collapse table-auto w-full text-sm`,
        props.className
      )}
    />
  );
}

Table.Head = function (props: JSX.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      {...props}
      className={classnames(`border-b bg-gray-800`, props.className)}
    />
  );
};

Table.Body = function (props: JSX.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
};

Table.Row = function (
  props: JSX.HTMLAttributes<HTMLTableRowElement> & {
    isHoverable?: boolean;
    isHeader?: boolean;
  }
) {
  const { isHoverable, isHeader, className, ...trProps } = props;
  const classNames = classnames({
    className,
    "bg-white border-b": !isHeader,
    "transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer":
      isHoverable,
  });
  return <tr {...trProps} className={classNames} />;
};

Table.HeaderCell = function (props: JSX.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={classnames(
        `text-sm font-medium text-white px-6 py-4 text-left`,
        props.className
      )}
    />
  );
};

Table.Cell = function (props: JSX.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      {...props}
      className={classnames(
        `px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left`,
        props.className
      )}
    />
  );
};
