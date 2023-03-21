import { useRef, useState } from 'react';
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
import { useWeb3React } from '@web3-react/core';
import * as PushAPI from '@pushprotocol/restapi';
import { Web3ReactManagerReturn } from '@web3-react/core/dist/types';
// import { Web3Storage } from "web3.storage";
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
// import { providers, Contract } from "ethers";

const sort = [
  { id: 1, name: 'Hot' },
  { id: 2, name: 'APR' },
  { id: 3, name: 'Earned' },
  { id: 4, name: 'Total staked' },
  { id: 5, name: 'Latest' },
];

function SortList() {
  const [selectedItem, setSelectedItem] = useState(sort[0]);

  // console.log(account)
  // const web3ModalRef = useRef();
  const { account, library, chainId } = useWeb3React();
  //   const getProviderOrSigner = async () => {
  //   const provider = await web3ModalRef.current.connect();
  //   const web3Provider = new providers.Web3Provider(provider);

  //   const { chainId } = await web3Provider.getNetwork();
  //   if (chainId !== 5) {
  //     window.alert("Change the network to Goerli");
  //     throw new Error("Change network to Goerli");
  //   }

  //     const signer = web3Provider.getSigner();
  //     console.log("Done signer");
  //     return signer;

  // }
  const web3Modal =
    typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });
  const test = async () => {
    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    // const signer = library.getSigners(account);
    // const signer = await getProviderOrSigner();
    //   const user = await PushAPI.user.create({
    //     account: '0x4A9CF09B996F0Ddf5498201f1D6cb8f6C88e3e0e'
    // });
    const user2 = await PushAPI.user.get({
      account: 'eip155:0x4A9CF09B996F0Ddf5498201f1D6cb8f6C88e3e0e',
    });
    console.log(user2);
    console.log(user2.encryptedPrivateKey);
    const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
      encryptedPGPPrivateKey: user2.encryptedPrivateKey,
      signer: signer,
    });

    // actual api
    const response = await PushAPI.chat.send({
      messageContent: "Hi Get lost!",
      messageType: 'Text', // can be "Text" | "Image" | "File" | "GIF"
      receiverAddress: 'eip155:0xCc673eE49Eb916b33919294D39F0518FdC0DaF0f',
      signer: signer,
      pgpPrivateKey: pgpDecryptedPvtKey,
    });
    console.log(response);
  };
  const getMessage = async () => {
    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const user = await PushAPI.user.get({
      account: 'eip155:0x4A9CF09B996F0Ddf5498201f1D6cb8f6C88e3e0e',
    });
    console.log(user);
    // console.log(user2.encryptedPrivateKey)
    const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      signer: signer,
    });

    // actual api
    const chats = await PushAPI.chat.chats({
      account: 'eip155:0x4A9CF09B996F0Ddf5498201f1D6cb8f6C88e3e0e',
      toDecrypt: true,
      pgpPrivateKey: pgpDecryptedPvtKey,
    });
    const chatsReq = await PushAPI.chat.requests({
      account: 'eip155:0x4A9CF09B996F0Ddf5498201f1D6cb8f6C88e3e0e',
      toDecrypt: true,
      pgpPrivateKey: pgpDecryptedPvtKey,
    });

    const conversationHash = await PushAPI.chat.conversationHash({
      account: 'eip155:0x4A9CF09B996F0Ddf5498201f1D6cb8f6C88e3e0e',
      conversationId: 'eip155:0xCc673eE49Eb916b33919294D39F0518FdC0DaF0f' // receiver's address or chatId of a group
    });
      
    // actual api
    console.log(conversationHash)
    // const chatLatest = await PushAPI.chat.latest({
    //   threadhash: conversationHash.threadHash,
    //   account: 'eip155:0x4A9CF09B996F0Ddf5498201f1D6cb8f6C88e3e0e',
    //   toDecrypt: true,
    //   pgpPrivateKey: pgpDecryptedPvtKey
    // });
    // console.log(chatLatest)
    const chatHistory = await PushAPI.chat.history({
      threadhash: conversationHash.threadHash,
      account: 'eip155:0x4A9CF09B996F0Ddf5498201f1D6cb8f6C88e3e0e',
      limit: 3,
      toDecrypt: true,
      pgpPrivateKey: pgpDecryptedPvtKey
    });
    console.log(chatHistory)

    // const response = await PushAPI.chat.send({
    //   messageContent: "Gm gm! It's me... Mario",
    //   messageType: 'Text', // can be "Text" | "Image" | "File" | "GIF"
    //   receiverAddress: 'eip155:0xCc673eE49Eb916b33919294D39F0518FdC0DaF0f',
    //   signer: signer,
    //   pgpPrivateKey: pgpDecryptedPvtKey
    // });
    console.log(`chats:${chats[0]}`);
    console.log(`chats req:${chatsReq}`);
  };
  // const signer = library.getSigner(account);
  return (
    <div className="relative w-full md:w-auto">
      <Button
        onClick={() => {
          return getMessage();
        }}
      >
        Get
      </Button>
      <Button
        onClick={() => {
          return test();
        }}
      >
        Test
      </Button>
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <Listbox.Button className="flex h-11 w-full items-center justify-between rounded-lg bg-gray-100 px-4 text-sm text-gray-900 dark:bg-light-dark dark:text-white md:w-36 lg:w-40 xl:w-56">
          {selectedItem.name}
          <ChevronDown />
        </Listbox.Button>
        <Transition
          enter="ease-out duration-300"
          enterFrom="opacity-0 "
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 "
        >
          <Listbox.Options className="absolute left-0 z-10 mt-2 w-full origin-top-right rounded-lg bg-white p-3 shadow-large dark:bg-light-dark">
            {sort.map((item) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-gray-900 transition dark:text-white  ${
                      selected
                        ? 'my-1 bg-gray-100 dark:bg-dark'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
}

function Search() {
  return (
    <form
      className="relative flex w-full rounded-full md:w-auto lg:w-64 xl:w-80"
      noValidate
      role="search"
    >
      <label className="flex w-full items-center">
        <input
          className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pr-5 ltr:pl-10 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
          placeholder="Search farms"
          autoComplete="off"
        />
        <span className="pointer-events-none absolute flex h-full w-8 cursor-pointer items-center justify-center text-gray-600 hover:text-gray-900 ltr:left-0 ltr:pl-2 rtl:right-0 rtl:pr-2 dark:text-gray-500 sm:ltr:pl-3 sm:rtl:pr-3">
          <SearchIcon className="h-4 w-4" />
        </span>
      </label>
    </form>
  );
}

function StackedSwitch() {
  let [isStacked, setIsStacked] = useState(false);
  return (
    <Switch
      checked={isStacked}
      onChange={setIsStacked}
      className="flex items-center gap-2 text-gray-400 sm:gap-3"
    >
      <div
        className={cn(
          isStacked ? 'bg-brand' : 'bg-gray-200 dark:bg-gray-500',
          'relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-300'
        )}
      >
        <span
          className={cn(
            isStacked
              ? 'bg-white ltr:translate-x-5 rtl:-translate-x-5 dark:bg-light-dark'
              : 'bg-white ltr:translate-x-0.5 rtl:-translate-x-0.5 dark:bg-light-dark',
            'inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform duration-200'
          )}
        />
      </div>
      <span className="inline-flex text-xs font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:text-sm">
        Stacked only
      </span>
    </Switch>
  );
}

function Status() {
  let [status, setStatus] = useState('live');

  return (
    <RadioGroup
      value={status}
      onChange={setStatus}
      className="flex items-center sm:gap-3"
    >
      <RadioGroup.Option value="live">
        {({ checked }) => (
          <span
            className={`relative flex h-11 w-20 cursor-pointer items-center justify-center rounded-lg text-center text-xs font-medium tracking-wider sm:w-24 sm:text-sm ${
              checked ? 'text-white' : 'text-brand'
            }`}
          >
            {checked && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-full w-full rounded-lg bg-brand shadow-large"
                layoutId="statusIndicator"
              />
            )}
            <span className="relative">LIVE</span>
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="finished">
        {({ checked }) => (
          <span
            className={`relative flex h-11 w-20 cursor-pointer items-center justify-center rounded-lg text-center text-xs font-medium tracking-wider sm:w-24 sm:text-sm ${
              checked ? 'text-white' : 'text-brand'
            }`}
          >
            {checked && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-full w-full rounded-lg bg-brand shadow-large"
                layoutId="statusIndicator"
              />
            )}
            <span className="relative">FINISHED</span>
          </span>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  );
}

const ChatPage: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo
        title="Farms"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="mx-auto w-full sm:pt-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-6">
          <div className="flex items-center justify-between gap-4">
            <Status />
            <div className="md:hidden">
              <StackedSwitch />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            <div className="hidden shrink-0 md:block">
              <StackedSwitch />
            </div>
            <Search />
            <SortList />
          </div>
        </div>
        {/* 
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
        </div> */}

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
                  STAKE
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

ChatPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ChatPage;
