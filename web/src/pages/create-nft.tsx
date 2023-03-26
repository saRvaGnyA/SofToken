import { useContext, useState } from 'react';
import type { NextPageWithLayout } from '@/types';
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import { Transition } from '@/components/ui/transition';
import DashboardLayout from '@/layouts/_dashboard';
import { RadioGroup } from '@/components/ui/radio-group';
import { Listbox } from '@/components/ui/listbox';
import Image from '@/components/ui/image';
import Collapse from '@/components/ui/collapse';
import Button from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import Uploader from '@/components/ui/forms/uploader';
import { Verified } from '@/components/icons/verified';
import InputLabel from '@/components/ui/input-label';
import ToggleBar from '@/components/ui/toggle-bar';
import { TagIcon } from '@/components/icons/tag-icon';
import { LoopIcon } from '@/components/icons/loop-icon';
import { SandClock } from '@/components/icons/sand-clock';
import { ChevronDown } from '@/components/icons/chevron-down';
import { Ethereum } from '@/components/icons/ethereum';
import { Tether } from '@/components/icons/tether';
import { Flow } from '@/components/icons/flow';
import { HistoryIcon } from '@/components/icons/history';
import { Warning } from '@/components/icons/warning';
import { Unlocked } from '@/components/icons/unlocked';
import Avatar from '@/components/ui/avatar';
import { Contract, ethers } from 'ethers';
import * as PushAPI from '@pushprotocol/restapi';
import Web3Modal from 'web3modal';
import { Web3Storage } from 'web3.storage';
import { polybase } from '@/data/utils/polybase';

import DependencySelect from '@/components/ui/dependency-select';
import Router from 'next/router';

//images
import AuthorImage from '@/assets/images/author.jpg';
import NFT1 from '@/assets/images/nft/nft-1.jpg';
import { WalletContext } from '@/lib/hooks/use-connect';
import { ABI, CONTRACT_ADDRESS } from '@/constants';

const PriceOptions = [
  {
    name: 'Properitary Executable, Non-redistributable',
    value: 'prop',
    icon: <TagIcon className="h-5 w-5 sm:h-auto sm:w-auto" />,
  },
  {
    name: 'Reusable & Modifiable Codebase With Royalty',
    value: 'royalty',
    icon: <HistoryIcon className="h-5 w-5 sm:h-auto sm:w-auto" />,
  },
  {
    name: 'Reusable & Modifiable Codebase Without Royalty',
    value: 'nonroyalty',
    icon: <Unlocked className="h-5 w-5 sm:h-auto sm:w-auto" />,
  },
];

type PriceTypeProps = {
  value: string;
  onChange: (value: string) => void;
};

function PriceType({ value, onChange }: PriceTypeProps) {
  return (
    <RadioGroup
      value={value}
      onChange={onChange}
      className="grid grid-cols-3 gap-3"
    >
      {PriceOptions.map((item, index) => (
        <RadioGroup.Option value={item.value} key={index}>
          {({ checked }) => (
            <span
              className={`relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-solid bg-white text-center text-sm font-medium tracking-wider shadow-card transition-all hover:shadow-large dark:bg-light-dark ${
                checked ? 'border-brand' : 'border-white dark:border-light-dark'
              }`}
            >
              <span className="relative flex h-28 flex-col items-center justify-center gap-3 px-2 text-center text-xs uppercase sm:h-36 sm:gap-4 sm:text-sm">
                {item.icon}
                {item.name}
              </span>
            </span>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
}

const CreateNFTPage: NextPageWithLayout = () => {
  const collectionReference = polybase.collection('NFT');
  const userCollectionReference = polybase.collection('User');
  let [publish, setPublish] = useState(true);
  let [priceType, setPriceType] = useState('prop');
  let [cid, setcid] = useState('');
  let [dependency_arr, setdependency_arr] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [zipFiles, setZipFiles] = useState([]);
  const [termsAgree, setTermsAgree] = useState(false);
  const [description, setDescription] = useState('');
  const [nftCollection, setNftCollection] = useState([]);
  const { address, disconnectWallet, balance, recordGlobal } =
    useContext(WalletContext);

  const web3Modal =
    typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });

  function makeStorageClient() {
    return new Web3Storage({ token: process.env.NEXT_PUBLIC_FILECOIN_API_KEY });
  }

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

    // const response = await PushAPI.chat.createGroup({
    //   account: `${address}`, //address of user
    //   groupName: 'EthGlobal NFT',
    //   groupDescription: 'This is the oficial group for Push Protocol',
    //   members: ['0xC7cc983FCD339B1020a48D6f473a5DE663461148'],
    //   groupImage:
    //     'https://plus.unsplash.com/premium_photo-1675873627492-49be1504998c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80',
    //   admins: ['0xCc673eE49Eb916b33919294D39F0518FdC0DaF0f'],
    //   isPublic: true,
    //   pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
    // });
    // console.log(response);
    const response2 = await PushAPI.chat.getGroupByName({
      groupName: 'Ani NFT',
    });
    console.log(response2);
    const response3 = await PushAPI.chat.getGroupByName({
      groupName: 'EthGlobal NFT',
    });
    console.log(response3);
    // const response4 = await PushAPI.chat.approve({
    //   status: 'Approved',
    //   account: `${address}`,
    //   senderAddress : `${response2.chatId}` // receiver's address or chatId of a group
    // })
    // const response5 = await PushAPI.chat.approve({
    //   status: 'Approved',
    //   account: `${address}`,
    //   senderAddress : `${response3.chatId}` // receiver's address or chatId of a group
    // })

    // console.log(response4);
    // console.log(response5);
    // setdecrypt_msg(pgpDecryptedPvtKey);
    // return pgpDecryptedPvtKey;

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
  const mintNFT = async () => {
    const client = makeStorageClient();
    const filesCid = await client.put(zipFiles);

    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const tokensContract = new Contract(CONTRACT_ADDRESS, ABI, signer);

    const mint_Res = await tokensContract.mint_nft(filesCid, []);
    await mint_Res.wait(1);

    const token_id = (await tokensContract.getTotalTokens()) - 1;

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: 5 }],
      });
      console.log('You have succefully switched to Binance Test network');
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        console.log(
          'This network is not available in your metamask, please add it'
        );
      }
      console.log('Failed to switch to the network');
    }

    //create group of corrs NFT
    const user = await PushAPI.user.get({
      account: `eip155:${address}`,
    });
    console.log(user);
    const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      signer: signer,
    });

    //store token id and nft details on polybase

    await collectionReference.create([
      token_id.toString(),
      name,
      description,
      Date.now().toString(),
      Number(price),
      priceType,
      [],
      await userCollectionReference.record(address),
    ]);

    const response = await PushAPI.chat.createGroup({
      account: `${address}`, //address of user
      groupName: name,
      groupDescription: 'This is the oficial group for Push Protocol',
      members: ['0xC7cc983FCD339B1020a48D6f473a5DE663461148'],
      groupImage:
        'https://plus.unsplash.com/premium_photo-1675873627492-49be1504998c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80',
      admins: ['0xCc673eE49Eb916b33919294D39F0518FdC0DaF0f'],
      isPublic: true,
      pgpPrivateKey: pgpDecryptedPvtKey, //decrypted private key
    });
    console.log(response);

    Router.push('/profile');
  };

  return (
    <>
      <NextSeo title="Create NFT" description="SofToken" />
      <div className="mx-auto w-full px-4 pt-8 pb-14 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 xl:px-10 2xl:px-0">
        <h2 className="mb-6 text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-10 sm:text-2xl">
          Create New NFT
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* File uploader */}
            <div className="mb-8">
              <InputLabel title="Upload Software Files" important />
              <Uploader files={zipFiles} setFiles={setZipFiles} />
            </div>

            {/* NFT price type */}
            <div className="flex items-center justify-between gap-4">
              <InputLabel
                important
                title="Select License Type"
                subTitle="Select the clauses applicable for the license you wish to choose."
              />
              <div className="shrink-0">
                <Switch checked={publish} onChange={() => setPublish(!publish)}>
                  <div
                    className={cn(
                      publish ? 'bg-brand' : 'bg-gray-200 dark:bg-gray-700',
                      'relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-300'
                    )}
                  >
                    <span
                      className={cn(
                        publish
                          ? 'bg-white ltr:translate-x-5 rtl:-translate-x-5 dark:bg-light-dark'
                          : 'bg-white ltr:translate-x-0.5 rtl:-translate-x-0.5 dark:bg-light-dark',
                        'inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform duration-200'
                      )}
                    />
                  </div>
                </Switch>
              </div>
            </div>
            {publish && <PriceType value={priceType} onChange={setPriceType} />}
          </div>

          <div className="hidden flex-col lg:flex">
            {/* NFT preview */}
            <InputLabel title="NFT Preview" />
            <div className="relative flex flex-grow flex-col overflow-hidden rounded-lg bg-white shadow-card transition-all duration-200 hover:shadow-large dark:bg-light-dark">
              <div className="flex items-center p-4 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400">
                @{recordGlobal.username}
              </div>
              <div className="relative block w-full pb-full">
                <Image
                  src={NFT1}
                  layout="fill"
                  objectFit="cover"
                  alt={'Image Preview'}
                />
              </div>
              <div className="p-5">
                <div className="text-base font-medium text-black dark:text-white">
                  {name || 'Sotware Name'}
                </div>
                <div className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  {price} ETH
                </div>
                <div className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
                  {description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="mb-8">
          <InputLabel title="Base Price" important />
          <Input
            min={0.01}
            type="number"
            value={price}
            onChange={(e) => {
              setPrice(Number(e.target.value));
            }}
            placeholder="Enter your base price"
            inputClassName="spin-button-hidden"
          />
        </div>

        {/* Name */}
        <div className="mb-8">
          <InputLabel title="Name" important />
          <Input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Software Name"
          />
        </div>

        {/* Description */}
        <div className="mb-8">
          <InputLabel
            important
            title="Description"
            subTitle="The description will be included on the software's detail page underneath its preview image."
          />
          <Textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            placeholder="Provide a detailed description of your software"
          />
        </div>

        {/* Dependency Selection */}
        <div className="mb-8">
          <InputLabel
            title="Select Dependencies"
            subTitle="Select all the NFTs which are dependencies for your software"
          />
          <Collapse label="Dependency" initialOpen>
            <DependencySelect
              onSelect={(value) => console.log(`this is ${value}`)}
            />
          </Collapse>
        </div>

        {/* AGREE TO TERMS */}
        <div className="mb-8">
          <ToggleBar
            title="Declaration"
            subTitle="I confirm that the information mentioned above is correct to the best of my knowledge and I'm solely responsible for my software. I also confirm that I have mentioned all the applicable dependents of my software (if any) and can be reported from the authors if I miss to include any"
            icon={<Verified />}
            checked={termsAgree}
            onChange={() => setTermsAgree(!termsAgree)}
          />
        </div>

        <Button disabled={!termsAgree} shape="rounded" onClick={mintNFT}>
          CREATE
        </Button>
      </div>
    </>
  );
};

CreateNFTPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default CreateNFTPage;
