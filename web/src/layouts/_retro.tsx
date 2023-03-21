import { useState } from 'react';
import cn from 'classnames';
import { useWindowScroll } from '@/lib/hooks/use-window-scroll';
import { FlashIcon } from '@/components/icons/flash';
import Hamburger from '@/components/ui/hamburger';
import ActiveLink from '@/components/ui/links/active-link';
import SearchButton from '@/components/search/button';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useDrawer } from '@/components/drawer-views/context';
// import Sidebar from '@/layouts/dashboard/_sidebar';
import Sidebar from '@/layouts/sidebar/_retro-left';
import SidebarTwo from '@/layouts/sidebar/_retro-right';
import WalletConnect from '@/components/nft/wallet-connect';

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

function HeaderRightArea() {
  return (
    <div className="relative order-last flex shrink-0 items-center gap-3 sm:gap-6 lg:gap-8">
      <NotificationButton />
      <WalletConnect />
    </div>
  );
}

export function Header() {
  const { openDrawer } = useDrawer();
  const isMounted = useIsMounted();
  let windowScroll = useWindowScroll();
  let [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 z-30 w-full transition-all duration-300 ltr:right-0 rtl:left-0 dark:bg-dark ltr:xl:pl-72 rtl:xl:pr-72 ltr:2xl:pl-80 rtl:2xl:pr-80 ${
        isMounted && windowScroll.y > 10
          ? 'h-16 bg-gradient-to-b from-white to-white/80 shadow-card backdrop-blur dark:from-dark dark:to-dark/80 sm:h-20'
          : 'h-16 sm:h-24 '
      }`}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-12">
        <div className="flex items-center">
          <div className="block ltr:mr-1 rtl:ml-1 ltr:sm:mr-3 rtl:sm:ml-3 xl:hidden">
            <Hamburger
              isOpen={isOpen}
              onClick={() => openDrawer('DASHBOARD_SIDEBAR')}
              variant="transparent"
              className="dark:text-white"
            />
          </div>

          <SearchButton variant="transparent" className="dark:text-white" />
        </div>
        <div className="block">
          <HeaderRightArea />
        </div>
      </div>
    </nav>
  );
}

interface DashboardLayoutProps {
  contentClassName?: string;
}

export default function Layout({
  children,
  contentClassName,
}: React.PropsWithChildren<DashboardLayoutProps>) {
  return (
    <div className="ltr:xl:px-72 ltr:2xl:px-8">
      <Header />
      <Sidebar className="z-50 hidden xl:block 2xl:w-[350px]" />
      <main
        className={cn(
          'min-h-[100vh] px-4 pt-20 pb-16 sm:px-6 sm:pt-24 sm:pb-20 lg:px-4 xl:pb-24 ltr:xl:px-7 rtl:xl:px-[320px]  ltr:2xl:px-[350px] rtl:2xl:px-[380px]',
          contentClassName
        )}
      >
        {children}
      </main>
      <SidebarTwo className="ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto  xl:block" />
    </div>
  );
}
