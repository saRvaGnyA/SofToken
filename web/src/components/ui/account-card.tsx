import cn from 'classnames';
import Router from 'next/router';

type ItemType = {
  id?: string | number;
  name: string;
  username?: string;
};

type CardProps = {
  item: ItemType;
  className?: string;
  variant?: 'small' | 'medium' | 'large';
};

export default function ListCard({
  item,
  className = 'p-3 tracking-wider rounded-lg sm:p-4',
}: CardProps) {
  const { name, username } = item ?? {};
  return (
    <div
      className={cn(
        'flex cursor-pointer items-center justify-between bg-white text-sm font-medium shadow-card dark:bg-light-dark',
        className
      )}
      onClick={() => {
        Router.push(`/profile/${username}`);
      }}
    >
      <div className="flex items-center">
        <div className="ltr:ml-2 rtl:mr-2">{name}</div>
      </div>
      <div className="overflow-hidden text-ellipsis -tracking-wider ltr:pl-2 rtl:pr-2">
        @{username}
      </div>
    </div>
  );
}
