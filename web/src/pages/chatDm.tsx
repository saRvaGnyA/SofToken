import { useContext, useEffect, useRef, useState } from 'react';
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
import queryList from '@/components/querys/list';
import { querysData } from '@/data/static/querys-data';
import { ChatsData } from '@/data/static/chats-data';
import { useWeb3React } from '@web3-react/core';
import * as PushAPI from '@pushprotocol/restapi';
import { Web3ReactManagerReturn } from '@web3-react/core/dist/types';
// import { Web3Storage } from "web3.storage";
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { WalletContext } from '@/lib/hooks/use-connect';
import routes from '@/config/routes';
import Chatlist from '@/components/chat/list';

const sort = [
  { id: 1, name: 'Hot' },
  { id: 2, name: 'APR' },
  { id: 3, name: 'Earned' },
  { id: 4, name: 'Total staked' },
  { id: 5, name: 'Latest' },
];

function SortList() {
  const [selectedItem, setSelectedItem] = useState(sort[0]);

  return (
    <div className="relative w-full md:w-auto">
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
          placeholder="Search querys"
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

const ChatDm: NextPageWithLayout = () => {
  const router = useRouter();
  const query = router.query;
  const [chat_msgs, setchat_msgs] = useState([]);
  const [curr_msg, setcurr_msg] = useState('');
  const { address, disconnectWallet, balance } = useContext(WalletContext);
  const web3Modal =
    typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });
  const test = async () => {
    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    // const signer = library.getSigners(account);
    // const signer = await getProviderOrSigner();
    //   const user = await PushAPI.user.create({
    //     account: '${address}'
    // });
    const user2 = await PushAPI.user.get({
      account: `eip155:${address}`,
    });
    console.log(user2);
    console.log(user2.encryptedPrivateKey);
    const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
      encryptedPGPPrivateKey: user2.encryptedPrivateKey,
      signer: signer,
    });

    // actual api
    const response = await PushAPI.chat.send({
      messageContent: 'Hi Get lost!',
      messageType: 'Text', // can be "Text" | "Image" | "File" | "GIF"
      receiverAddress: `${query.to}`,
      signer: signer,
      pgpPrivateKey: pgpDecryptedPvtKey,
    });
    console.log(response);
  };

  const sendMessage = async () => {
    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    // const signer = library.getSigners(account);
    // const signer = await getProviderOrSigner();
    //   const user = await PushAPI.user.create({
    //     account: '${address}'
    // });
    const user = await PushAPI.user.get({
      account: `eip155:${address}`,
    });
    console.log(user);
    console.log(user.encryptedPrivateKey);
    const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      signer: signer,
    });
    console.log(curr_msg);
    // actual api
    const response = await PushAPI.chat.send({
      messageContent: curr_msg,
      messageType: 'Text', // can be "Text" | "Image" | "File" | "GIF"
      receiverAddress: `${query.to}`,
      signer: signer,
      pgpPrivateKey: pgpDecryptedPvtKey,
    });
    console.log(response);
    const conversationHash = await PushAPI.chat.conversationHash({
      account: `eip155:${address}`,
      conversationId: `${query.to}`, // receiver's address or chatId of a group
    });
    const chatHistory = await PushAPI.chat.history({
      threadhash: conversationHash.threadHash,
      account: `eip155:${address}`,
      limit: 6,
      toDecrypt: true,
      pgpPrivateKey: pgpDecryptedPvtKey,
    });
    console.log(chatHistory);
    chatHistory.reverse();
    setchat_msgs(chatHistory);
    const to_addr = query.to.toString();
    if (to_addr.startsWith('0x')) {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer: signer,
        type: 3, // target
        identityType: 2, // direct payload
        notification: {
          title: `${address} sent you a message on dm`,
          body: curr_msg,
        },
        payload: {
          title: `${address} sent you a message on dm`,
          body: curr_msg,
          cta: '',
          img: '',
        },
        recipients: `eip155:5:${to_addr}`, // recipient address
        channel: `eip155:5:0xCc673eE49Eb916b33919294D39F0518FdC0DaF0f`, // your channel address
        env: 'staging',
      });
      console.log(`api response: ${apiResponse}`);
    }
  };
  const getMessage = async () => {
    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const user = await PushAPI.user.get({
      account: `eip155:${address}`,
    });
    console.log(user);
    // console.log(user2.encryptedPrivateKey)
    const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      signer: signer,
    });

    // actual api
    // const chats = await PushAPI.chat.chats({
    //   account: `eip155:${address}`,
    //   toDecrypt: true,
    //   pgpPrivateKey: pgpDecryptedPvtKey,
    // });
    // const chatsReq = await PushAPI.chat.requests({
    //   account: `eip155:${address}`,
    //   toDecrypt: true,
    //   pgpPrivateKey: pgpDecryptedPvtKey,
    // });

    const conversationHash = await PushAPI.chat.conversationHash({
      account: `eip155:${address}`,
      conversationId: `${query.to}`, // receiver's address or chatId of a group
    });

    // actual api
    console.log(conversationHash);
    // const chatLatest = await PushAPI.chat.latest({
    //   threadhash: conversationHash.threadHash,
    //   account: `eip155:${address}`,
    //   toDecrypt: true,
    //   pgpPrivateKey: pgpDecryptedPvtKey
    // });
    // console.log(chatLatest)
    const chatHistory = await PushAPI.chat.history({
      threadhash: conversationHash.threadHash,
      account: `eip155:${address}`,
      limit: 6,
      toDecrypt: true,
      pgpPrivateKey: pgpDecryptedPvtKey,
    });
    console.log(chatHistory);
    chatHistory.reverse();
    setchat_msgs(chatHistory);

    // const response = await PushAPI.chat.send({
    //   messageContent: "Gm gm! It's me... Mario",
    //   messageType: 'Text', // can be "Text" | "Image" | "File" | "GIF"
    //   receiverAddress: `${query.to}`,
    //   signer: signer,
    //   pgpPrivateKey: pgpDecryptedPvtKey
    // });
    // console.log(`chats:${chats[0]}`);
    // console.log(`chats req:${chatsReq}`);
  };
  useEffect(() => {
    getMessage();
  }, []);

  return (
    <>
      <NextSeo
        title="querys"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <Button
        onClick={() => {
          return getMessage();
        }}
      >
        Load Messages
      </Button>
      {/* <Button
        onClick={() => {
          return test();
        }}
      >
        Test
      </Button> */}
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
        {/*  */}
        <Chatlist
          key={query.id}
          from={query.from}
          to={query.to}
          earned={query.name}
          apr={query.apr}
          liquidity={query.liquidity}
          multiplier={query.multiplier}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6">
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
          <Button
            shape="rounded"
            fullWidth
            size="large"
            onClick={() => {
              router.push({ pathname: '/chatDm', query: query });
            }}
          >
            Chat
          </Button>
        </Chatlist>
        <div className="relative h-[20rem] overflow-auto  bg-gray-200 dark:bg-gray-900">
          <div className="p-2">
            {chat_msgs.map((msg) => {
              //   const query = query;
              console.log(msg.fromDID.slice(7).toString(), address.toString());

              return address.toString() == msg.fromDID.slice(7).toString() ? (
                <div className="chat-message my-2">
                  <div className="flex items-end justify-end">
                    <div className="order-1 mx-2 flex max-w-xs flex-col items-end space-y-2 text-xs">
                      <div>
                        <div className="inline-block rounded-l-lg rounded-br-lg bg-blue-400 pb-2 text-white dark:bg-blue-800 ">
                          <span className="m-1 inline-block rounded-l-lg rounded-br-lg p-1 text-black dark:text-white ">
                            {msg.fromDID.slice(7)}
                          </span>
                          <br></br>
                          <span className="m-2 dark:text-gray-400">
                            {msg.messageContent}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="chat-message my-2">
                  <div className="flex items-end">
                    <div className="order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs">
                      <div>
                        <div className="inline-block rounded-r-lg rounded-bl-lg bg-gray-300 pb-2 text-gray-600 dark:bg-gray-800">
                          <span className="m-1 inline-block rounded-r-lg rounded-bl-lg p-1 text-black dark:text-white ">
                            {msg.fromDID.slice(7)}
                          </span>
                          <br></br>
                          <span className="m-2 dark:text-gray-400">
                            {msg.messageContent}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <label htmlFor="chat" className="sr-only ">
          Your message
        </label>
        <div className=" flex h-16 w-full items-center rounded-b-lg bg-gray-50 px-3 pb-2 dark:bg-gray-700">
          <button
            type="button"
            className="inline-flex cursor-pointer justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Upload image</span>
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Add emoji</span>
          </button>
          <textarea
            id="chat"
            rows="1"
            onChange={(e) => {
              setcurr_msg(e.target.value);
            }}
            className="mx-4 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="Your message..."
          ></textarea>
          <button
            type="submit"
            onClick={() => {
              sendMessage();
            }}
            className="inline-flex cursor-pointer justify-center rounded-full p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
          >
            <svg
              aria-hidden="true"
              className="h-6 w-6 rotate-90"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </div>
    </>
  );
};

ChatDm.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ChatDm;
