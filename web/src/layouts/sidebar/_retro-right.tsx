import cn from 'classnames';
import Scrollbar from '@/components/ui/scrollbar';
import { useDrawer } from '@/components/drawer-views/context';

import { FlashIcon } from '@/components/icons/flash';
import Avatar from '@/components/ui/avatar';
import TopupButton from '@/components/ui/topup-button';
import TransactCoin from '@/components/ui/transact-coin';
import WalletCard from '@/components/ui/wallet-card-two';
import ActiveLink from '@/components/ui/links/active-link';

//images
import AuthorImage from '@/assets/images/author.jpg';

type SidebarProps = {
  className?: string;
};
function NotificationButton() {
  return (
    <ActiveLink href="/notifications">
      <div className="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white text-brand shadow-main transition-all hover:-translate-y-0.5 hover:shadow-large focus:-translate-y-0.5 focus:shadow-large focus:outline-none dark:border-gray-700 dark:bg-light-dark dark:text-white sm:h-12 sm:w-12">
        <FlashIcon className="h-auto w-3 sm:w-auto" />
        <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-brand shadow-light sm:h-3 sm:w-3" />
      </div>
    </ActiveLink>
  );
}

export default function Sidebar({ className }: SidebarProps) {
  const { closeDrawer } = useDrawer();
  return (
    <aside
      className={cn(
        'top-0 z-20 h-full w-full max-w-full border border-slate-100 bg-sidebar-body  ltr:left-0 ltr:border-r rtl:right-0 rtl:border-l dark:border-dashed dark:border-gray-700 dark:bg-dark xs:w-full xl:fixed xl:w-72  xl:pt-20 2xl:w-[350px]',
        className
      )}
    >
      <Scrollbar style={{ height: 'calc(100% + 20px)' }}>
        <div className=" pb-5 ">
          <div className="my-16 mx-5 flex h-full flex-col justify-center rounded-lg  bg-transparent p-6 dark:bg-light-dark sm:mx-6 xl:my-0 xl:mx-0 xl:p-8">
            <Avatar
              image={AuthorImage}
              alt="Author"
              className="mx-auto mb-6"
              size="lg"
            />
            <h3 className="mb-2 text-center text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 3xl:mb-3">
              My Balance
            </h3>
            <div className="mb-7 text-center font-medium tracking-tighter text-gray-900 dark:text-white xl:text-2xl 3xl:mb-8 3xl:text-[32px]">
              $10,86,000
            </div>
            <TopupButton className="mb-8" />
            <div>
              <span className="-mx-6 block border-t border-dashed border-t-gray-200 dark:border-t-gray-700 3xl:-mx-8" />
              <TransactCoin className="mt-6 mb-8" />
            </div>
            <span className="-mx-6 block border-t border-dashed border-t-gray-200 dark:border-t-gray-700 3xl:-mx-8" />
            <div className="mt-8">
              <div className="md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-2 lg:col-span-6 lg:row-start-2 lg:row-end-3 xl:col-start-9 xl:col-end-13 xl:row-start-2 xl:row-end-3 2xl:col-start-10 2xl:col-end-13 2xl:row-start-2 2xl:row-end-3 3xl:col-span-3 3xl:row-start-2 3xl:row-end-3">
                <WalletCard />
              </div>
            </div>
          </div>
        </div>
      </Scrollbar>
    </aside>
  );
}
