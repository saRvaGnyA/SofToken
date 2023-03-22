import { useState } from 'react';
import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';
import cn from 'classnames';
import { Transition } from '@/components/ui/transition';
import DashboardLayout from '@/layouts/_dashboard';
import { RadioGroup } from '@/components/ui/radio-group';
import { Listbox } from '@/components/ui/listbox';
import Button from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ChevronDown } from '@/components/icons/chevron-down';
import { SearchIcon } from '@/components/icons/search';
import FarmList from '@/components/farms/list';
import { FarmsData } from '@/data/static/farms-data';
import { ChatsData } from '@/data/static/chats-data';

const sort = [
  { id: 1, name: 'Hot' },
  { id: 2, name: 'APR' },
  { id: 3, name: 'Earned' },
  { id: 4, name: 'Total staked' },
  { id: 5, name: 'Latest' },
];


const ChatInfoPage: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Farms"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="mx-auto w-full sm:pt-8">
        

        <div className="mb-3 hidden grid-cols-3 gap-6 rounded-lg bg-white shadow-card dark:bg-light-dark sm:grid lg:grid-cols-5">
          <span className="px-8 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
            Pool
          </span>
          <span className="px-8 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
            Earned
          </span>
          <span className="px-8 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300">
            APR
          </span>
          <span className="hidden px-8 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300 lg:block">
            Liquidity
          </span>
          <span className="hidden px-8 py-6 text-sm tracking-wider text-gray-500 dark:text-gray-300 lg:block">
            Multiplier
          </span>
        </div>

        {ChatsData.map((farm) => {
          return (
            <FarmList
              key={farm.id}
              from={farm.from}
              to={farm.to}
              earned={farm.earned}
              apr={farm.apr}
              liquidity={farm.liquidity}
              multiplier={farm.multiplier}
            >
              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
                <div className="text-xs font-medium uppercase text-black ltr:text-right rtl:text-left dark:text-white sm:text-sm">
                  Wallet balance: 0
                </div>
                <div className="flex flex-col gap-3 text-xs font-medium uppercase text-black ltr:text-right rtl:text-left dark:text-white sm:text-sm">
                  <span>Your Staked: 4.208 (0.03% of pool)</span>
                  <span>0.08 WBTC + 1753.60 ETH ($18.96)</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.0"
                    className="spin-button-hidden h-13 w-full appearance-none rounded-lg border-solid border-gray-200 bg-body px-4 text-sm tracking-tighter text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:shadow-none focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600"
                  />
                  <span className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-lg border border-solid bg-gray-100 px-2 py-1 text-xs uppercase text-gray-900 ltr:right-3 rtl:left-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    Max
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.0"
                    className="spin-button-hidden h-13 w-full appearance-none rounded-lg border-solid border-gray-200 bg-body px-4 text-sm tracking-tighter text-gray-900 placeholder:text-gray-600 focus:border-gray-900 focus:shadow-none focus:outline-none focus:ring-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-600"
                  />
                  <span className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-lg border border-solid bg-gray-100 px-2 py-1 text-xs uppercase text-gray-900 ltr:right-3 rtl:left-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                    Max
                  </span>
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4 sm:mb-6 sm:gap-6">
                <Button shape="rounded" fullWidth size="large">
                  CHAT
                </Button>
                <Button shape="rounded" fullWidth size="large">
                  UNSTAKE
                </Button>
              </div>
              <Button shape="rounded" fullWidth size="large">
                HARVEST
              </Button>
            </FarmList>
          );
        })}
      </div>
    </>
  );
};

ChatInfoPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ChatInfoPage;
