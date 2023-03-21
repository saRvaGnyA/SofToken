import { useState } from 'react';
import cn from 'classnames';
import AuthorCard from '@/components/ui/author-card';
import Image from '@/components/ui/image';
import Logo from '@/components/ui/logo';
import LogoIcon from '@/components/ui/logo-icon';
import MenuSvg from '@/components/ui/menu-icon';
import { MenuItem } from '@/components/ui/collapsible-menu';
import Scrollbar from '@/components/ui/scrollbar';
import Button from '@/components/ui/button';
import routes from '@/config/routes';
import { useDrawer } from '@/components/drawer-views/context';
import { HomeIcon } from '@/components/icons/home';
import { FarmIcon } from '@/components/icons/farm';
import { PoolIcon } from '@/components/icons/pool';
import { ProfileIcon } from '@/components/icons/profile';
import { DiskIcon } from '@/components/icons/disk';
import { ExchangeIcon } from '@/components/icons/exchange';
import { VoteIcon } from '@/components/icons/vote-icon';
import { Close } from '@/components/icons/close';
import { PlusCircle } from '@/components/icons/plus-circle';
import { CompassIcon } from '@/components/icons/compass';
import { InfoCircle } from '@/components/icons/info-circle';
import MenuIcon from '@/assets/images/menu.svg';

//images
import AuthorImage from '@/assets/images/author.jpg';

export const menuItems = [
  {
    name: 'Home',
    icon: <HomeIcon />,
    href: routes.home,
    dropdownItems: [
      {
        name: 'Modern',
        href: routes.home,
      },
      {
        name: 'Minimal',
        href: routes.minimal,
      },
      {
        name: 'Retro',
        href: routes.retro,
      },
      {
        name: 'Classic',
        href: routes.classic,
      },
    ],
  },
  {
    name: 'Farm',
    icon: <FarmIcon />,
    href: routes.farms,
  },
  {
    name: 'Swap',
    icon: <ExchangeIcon />,
    href: routes.swap,
  },
  {
    name: 'Liquidity',
    icon: <PoolIcon />,
    href: routes.liquidity,
  },
  {
    name: 'Explore NFTs',
    icon: <CompassIcon />,
    href: routes.search,
  },
  {
    name: 'Create NFT',
    icon: <PlusCircle />,
    href: routes.createNft,
  },
  {
    name: 'NFT Details',
    icon: <DiskIcon />,
    href: routes.nftDetails,
  },
  {
    name: 'Profile',
    icon: <ProfileIcon />,
    href: routes.profile,
  },
  {
    name: 'Vote',
    icon: <VoteIcon />,
    href: routes.vote,
    dropdownItems: [
      {
        name: 'Explore',
        href: routes.vote,
      },
      {
        name: 'Vote with pools',
        href: routes.proposals,
      },
      {
        name: 'Create proposal',
        href: routes.createProposal,
      },
    ],
  },
];

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const { closeDrawer } = useDrawer();
  return (
    <aside
      className={cn(
        ` ${
          open
            ? 'border-0  shadow-expand xs:w-80 xl:w-72 2xl:w-80 '
            : 'w-24 border-dashed border-gray-200 ltr:border-r rtl:border-l 2xl:w-28'
        } top-0 z-40 h-full w-full max-w-full  bg-body duration-200 ltr:left-0 rtl:right-0  dark:border-gray-700 dark:bg-dark xl:fixed  `,
        className
      )}
    >
      <div
        className={`relative flex h-24  items-center  overflow-hidden px-6 py-4 2xl:px-8 ${
          open ? 'flex-start' : 'justify-center'
        }`}
      >
        {!open ? (
          <div onClick={() => setOpen(!open)}>
            <LogoIcon />
          </div>
        ) : (
          <Logo />
        )}

        {open && (
          <div
            className={` absolute right-5 top-[38px] h-5 w-5 cursor-pointer text-gray-50 rtl:xl:right-[230px] rtl:2xl:right-[260px] 3xl:top-[34px] 3xl:h-6 3xl:w-6
             ${!open && 'rotate-180'}`}
            onClick={() => setOpen(!open)}
          >
            <MenuSvg />
          </div>
        )}

        <div className="md:hidden">
          <Button
            title="Close"
            color="white"
            shape="circle"
            variant="transparent"
            size="small"
            onClick={closeDrawer}
          >
            <Close className="h-auto w-2.5" />
          </Button>
        </div>
      </div>

      <Scrollbar style={{ height: 'calc(100% - 96px)' }}>
        <div className="px-6 pb-5 2xl:px-8">
          {!open ? (
            <>
              <div className="mt-5 2xl:mt-8" onClick={() => setOpen(!open)}>
                {menuItems.map((item, index) => (
                  <MenuItem key={index} href="" icon={item.icon} />
                ))}
              </div>
              <div
                className=" mt-28 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <AuthorCard image={AuthorImage} />
              </div>
            </>
          ) : (
            <>
              <div className="mt-5 2xl:mt-8">
                {menuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    name={item.name}
                    href={item.href}
                    icon={item.icon}
                    dropdownItems={item.dropdownItems}
                  />
                ))}
              </div>
              <div className="mt-28 min-h-[80px] ">
                <AuthorCard
                  image={AuthorImage}
                  name="Cameron Williamson"
                  role="admin"
                />
              </div>
            </>
          )}
        </div>
      </Scrollbar>
    </aside>
  );
}
