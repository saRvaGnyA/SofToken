import cn from 'classnames';
import { StaticImageData } from 'next/image';
import ParamTab, { TabPanel } from '@/components/ui/param-tab';
import Image from '@/components/ui/image';
import FeaturedCard from '@/components/nft/featured-card';
import ListCard from '@/components/ui/list-type';
import AuctionCountdown from '@/components/nft/auction-countdown';
import AnchorLink from '@/components/ui/links/anchor-link';
import Button from '@/components/ui/button';
import { ArrowLinkIcon } from '@/components/icons/arrow-link-icon';
import { DotsIcon } from '@/components/icons/dots-icon';
import Avatar1 from '@/assets/images/avatar/3.png';
import { useModal } from '@/components/modal-views/context';
import { nftData } from '@/data/static/single-nft';
import NftDropDown from './nft-dropdown';
import Avatar from '@/components/ui/avatar';
import { WalletContext } from '@/lib/hooks/use-connect';
import { BigNumber, Contract, ethers } from 'ethers';
import * as PushAPI from '@pushprotocol/restapi';
import Web3Modal from 'web3modal';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { CONTRACT_ADDRESS, ABI, DIFF_ABI } from '@/constants';
import { useContractWrite, useContractRead } from '@thirdweb-dev/react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { parseInt } from 'lodash';
import Slider from 'rc-slider';
import { Web3Storage } from 'web3.storage';

interface NftFooterProps {
  className?: string;
  price?: number;
  name_of_nft: string;
  minter: object;
  tok_id: string;
}

function NftFooter({
  className = 'md:hidden',
  price,
  name_of_nft,
  minter,
  tok_id,
}: NftFooterProps) {
  const { openModal } = useModal();
  const router = useRouter();
  const { address, disconnectWallet, balance } = useContext(WalletContext);
  const web3Modal =
    typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });
<<<<<<< HEAD
  const [isDone, setisDone] = useState(false);
=======

>>>>>>> 4181b0d74d187918c14a1a006daeb2b0a5d876a7
  const query = router.query;

  const [tokenId, setTokenId] = useState(0);
  const [contract, setContract] = useState(null);
  const [rate, setRate] = useState(0);
  const [tokenId0, setTokenId0] = useState(0);
  const [rate0, setRate0] = useState(0);
  const [curr_price, setcurr_price] = useState(price);
  const { mutateAsync: vote, isLoading1 } = useContractWrite(contract, 'vote');
  const { mutateAsync: getRate, isLoading2 } = useContractWrite(
    contract,
    'getRate'
  );
  const [walletConnected, setWalletConnected] = useState(false);
  var rate_NFT = 0;
  const call = async () => {
    try {
      const data = await vote([tok_id, rate_NFT]);
      console.info('contract call successs', data);
    } catch (err) {
      console.error('contract call failure', err);
    }
  };
  const getRateFunction = async () => {
    console.log('Started');
    console.log(tok_id);
    try {
      const data = await getRate([tok_id]);
      console.log(data.toString());
      setRate0(parseInt(data['_hex'], 16));
      console.info('contract call successs', parseInt(data['_hex'], 16));
      setcurr_price(
        parseFloat(price) * (1 + parseFloat(data.toString()) / 1000)
      );
      console.log(curr_price);
    } catch (err) {
      console.error('contract call failure', err);
    }
  };
  function PriceRange() {
    let [range, setRange] = useState({ min: 1, max: 10 });
    function handleRangeChange(value: any) {
      setRange({
        min: value[0],
        max: value[1],
      });
      rate_NFT = value[0];
      console.log(`rate is:${rate_NFT}`);
    }

    function handleMinChange(min: number) {
      setRange({
        ...range,
        min: min || 0,
      });
    }

    return (
      <div className="p-5">
        <div className="mb-4 grid grid-cols-2 gap-2">
          <input
            className="h-9 rounded-lg border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500"
            type="number"
            value={range.min}
            step={0.01}
            onChange={(e) => handleMinChange(parseInt(e.target.value))}
            min="0"
            max={range.max}
          />
          {/* <input
            className="h-9 rounded-lg border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500"
            type="number"
            value={range.max}
            step={0.01}
            onChange={(e) => handleMaxChange(parseInt(e.target.value))}
            // onBlur={setprice_range(range)}
            min={range.min}
          /> */}
        </div>
        <Slider
          range
          min={1}
          max={10}
          value={[range.min, 10]}
          allowCross={false}
          step={1}
          onChange={(value) => handleRangeChange(value)}
          // onBlur={setprice_range(range)}
        />
      </div>
    );
  }
  const initialLoad = async () => {
    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const sdk = ThirdwebSDK.fromSigner(signer);

    const contract = await sdk.getContractFromAbi(
      '0x9d7B3B7F55743bBA41cc4Cc21d7D1660e43411e1',
      DIFF_ABI
    );
    console.log(contract);
    setContract(contract);
    setWalletConnected(true);
    var num = parseInt(query);
    setTokenId(num);
    getRateFunction(num);
  };
  function makeStorageClient() {
    return new Web3Storage({ token: process.env.NEXT_PUBLIC_FILECOIN_API_KEY });
  }
  const subscribeNFT = async () => {
    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const tokensContract = new Contract(CONTRACT_ADDRESS, ABI, signer);
    //fetch token id  and curr cost of nft from polybase
    const token_id = parseInt(tok_id);
    const cost_of_nft = (parseFloat(curr_price) * 10 ** 18).toString();
    //1 ether = 10^18 =>cost of nft
    let ethersToWei = ethers.utils.parseUnits(
      parseFloat(curr_price).toString(),
      'ether'
    );
    console.log(ethersToWei);
    console.log(ethersToWei.toString());
    console.log(ethersToWei.toHexString(16));
    ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: address,
            to: CONTRACT_ADDRESS,
            value: ethersToWei.toHexString(16),
          },
        ],
      })
      .then((txHash) => console.log(txHash))
      .catch((error) => console.error(error));
    const res = await tokensContract.subscribe(token_id, cost_of_nft);
    console.log(res);
    //Request to admin

    const user = await PushAPI.user.get({
      account: `eip155:${address}`,
    });
    console.log(user);
    console.log(user.encryptedPrivateKey);
    const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
      encryptedPGPPrivateKey: user.encryptedPrivateKey,
      signer: signer,
    });
    // console.log(curr_msg);

    // actual api
    var admin_addr = '0x4A9CF09B996F0Ddf5498201f1D6cb8f6C88e3e0e'; // minter address fetched from polybase
    const response = await PushAPI.chat.send({
      messageContent: `Kindly add me to your group: ${name_of_nft}`,
      messageType: 'Text', // can be "Text" | "Image" | "File" | "GIF"
      receiverAddress: `${admin_addr}`,
      signer: signer,
      pgpPrivateKey: pgpDecryptedPvtKey,
    });
    console.log(response);

    const cidReq = await tokensContract.getCID(tok_id);
    console.log(cidReq);
    setisDone(true);

    // router.push({ pathname: '/profile' });
  };
  const downloadNft = async () => {
    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const tokensContract = new Contract(CONTRACT_ADDRESS, ABI, signer);
    //fetch token id  and curr cost of nft from polybase
    const token_id = parseInt(tok_id);

    //Request to admin

    const cidReq = await tokensContract.getCID(2);
    console.log(cidReq);
    const client = makeStorageClient();
    const res = await client.get(cidReq);
    const files = await res?.files();
    console.log(files);
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(files[0]);
    a.download = files[0].name;
    a.click();
    // var element = document.createElement('a');
    // element.setAttribute(
    //   'href',
    //   'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    // );
    // element.setAttribute('download', files[0].name);
    // document.body.appendChild(element);
    // element.click();
    // document.body.removeChild(element);

    //   fetch(`https://${cidReq}.ipfs.w3s.link/`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/pdf',

    //   },
    // })
    // .then((response) => response.blob())
    // .then((blob) => {
    //   // Create blob link to download
    //   const url = window.URL.createObjectURL(
    //     new Blob([blob]),
    //   );
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.setAttribute(
    //     'download',
    //     `FileName.pdf`,
    //   );

    //   // Append to html link element page
    //   document.body.appendChild(link);

    //   // Start download
    //   link.click();

    //   // Clean up and remove the link
    //   link.parentNode.removeChild(link);
    // });

    // router.push({ pathname: '/profile' });
  };

  useEffect(() => {
    initialLoad();
  }, [query, curr_price]);

  return (
    <div
      className={cn(
        'sticky bottom-0 z-10 bg-body dark:bg-dark md:-mx-2',
        className
      )}
    >
      {/* <Button onClick={getRateFunction}>Testing</Button>
      <Button onClick={downloadNft}>Dwnld</Button> */}
      <Button
        onClick={async () => {
          await call();
        }}
      >
        Rate
      </Button>
      <PriceRange />
      <div className="-mx-4 border-t-2 border-gray-900 px-4 pt-4 pb-5 dark:border-gray-700 sm:-mx-6 sm:px-6 md:mx-2 md:px-0 md:pt-5 lg:pt-6 lg:pb-7">
        <div className="flex gap-4 pb-3.5 md:pb-4 xl:gap-5">
          <div className="block w-1/2 shrink-0 md:w-2/5">
            <h3 className="mb-1 truncate text-13px font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-1.5 sm:text-sm">
              Current Price
            </h3>
            <div className="text-lg font-medium -tracking-wider md:text-xl xl:text-2xl">
              {curr_price} ETH
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {!isDone ? (
            <Button shape="rounded" onClick={subscribeNFT}>
              {`BUY FOR ${curr_price} ETH`}
            </Button>
          ) : (
            <Button shape="rounded" onClick={downloadNft}>
              {`Download Source Code`}
            </Button>
          )}
          <Button
            shape="rounded"
            variant="solid"
            color="gray"
            className="dark:bg-gray-800"
            onClick={() => openModal('SHARE_VIEW')}
          >
            SHARE
          </Button>
        </div>
      </div>
    </div>
  );
}

type NftDetailsProps = {
  image: string;
  name: string;
  description: string;
  timestamp: string;
  minted_slug: string;
  base_price: number;
  minter: object;
  tok_id: string;
};

export default function NftDetails({ product }: { product: NftDetailsProps }) {
  const {
    image,
    name,
    description,
    timestamp,
    clause_type,
    base_price,
    minter,
    tok_id,
  } = product;
  return (
    <div className="flex flex-grow">
      <div className="mx-auto flex w-full flex-grow flex-col transition-all xl:max-w-[1360px] 4xl:max-w-[1760px]">
        <div className="relative mb-5 flex flex-grow items-center justify-center md:pb-7 md:pt-4 ltr:md:left-0 ltr:md:pl-6 rtl:md:right-0 rtl:md:pr-6 lg:fixed lg:mb-0 lg:h-[calc(100%-96px)] lg:w-[calc(100%-492px)] ltr:lg:pl-8 rtl:lg:pr-8 xl:w-[calc(100%-550px)] ltr:xl:pr-12 ltr:xl:pl-[340px] rtl:xl:pl-12 rtl:xl:pr-[340px] ltr:2xl:pl-96 rtl:2xl:pr-96 3xl:w-[calc(100%-632px)] ltr:4xl:pl-0 rtl:4xl:pr-0">
          <div className="flex h-full max-h-full w-full items-center justify-center lg:max-w-[768px]">
            <div className="relative aspect-square max-h-full overflow-hidden rounded-lg">
              {image && (
                <img
                  src={image}
                  alt={name}
                  className="h-full bg-gray-200 dark:bg-light-dark"
                />
              )}
            </div>
          </div>
        </div>

        <div className="relative flex w-full flex-grow flex-col justify-between ltr:md:ml-auto ltr:md:pl-8 rtl:md:mr-auto rtl:md:pr-8 lg:min-h-[calc(100vh-96px)] lg:w-[460px] ltr:lg:pl-12 rtl:lg:pr-12 xl:w-[592px] ltr:xl:pl-20 rtl:xl:pr-20">
          <div className="block">
            <div className="block">
              <div className="flex justify-between">
                <h2 className="text-xl font-medium leading-[1.45em] -tracking-wider text-gray-900 dark:text-white md:text-2xl xl:text-3xl">
                  {name}
                </h2>
              </div>
              <div className="mt-1.5 inline-flex items-center text-sm -tracking-wider text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white xl:mt-2.5">
                Minted on{' '}
                {`${new Date(parseInt(timestamp)).toLocaleDateString()}`}
              </div>
              <div className="mt-4 flex flex-wrap gap-6 pt-0.5 lg:-mx-6 lg:mt-6 lg:gap-0">
                <div className="shrink-0 border-dashed border-gray-200 dark:border-gray-700 lg:px-6 lg:ltr:border-r lg:rtl:border-l">
                  <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">
                    Created By
                  </h3>
                  {minter && (
                    <AnchorLink
                      href={`/profile/${minter.username}`}
                      className="inline-flex"
                    >
                      <ListCard
                        item={minter}
                        className="rounded-full p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      />
                    </AnchorLink>
                  )}
                </div>
                <div className="shrink-0 lg:px-6">
                  <h3 className="text-heading-style mb-2.5 uppercase text-gray-900 dark:text-white">
                    License
                  </h3>
                  <AnchorLink href="#" className="inline-flex">
                    <ListCard
                      item={{
                        name:
                          clause_type === 'prop'
                            ? 'Properiatary'
                            : clause_type === 'royalty'
                            ? 'Reusable code with Royalty'
                            : 'Reusable code without Royalty',
                      }}
                      className="rounded-full p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    />
                  </AnchorLink>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-col pb-5 xl:mt-9">
              <ParamTab
                tabMenu={[
                  {
                    title: 'Details',
                    path: 'details',
                  },
                  {
                    title: 'Dependencies',
                    path: 'dependencies',
                  },
                ]}
              >
                <TabPanel className="focus:outline-none">
                  <div className="space-y-6">
                    <div className="block">
                      <h3 className="text-heading-style mb-2 uppercase text-gray-900 dark:text-white">
                        Description
                      </h3>
                      <div className="text-sm leading-6 -tracking-wider text-gray-600 dark:text-gray-400">
                        {description}
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel className="focus:outline-none">
                  <div className="flex flex-col-reverse">
                    {nftData?.bids?.map((bid) => (
                      <FeaturedCard
                        item={bid}
                        key={bid?.id}
                        className="mb-3 first:mb-0"
                      />
                    ))}
                  </div>
                </TabPanel>
              </ParamTab>
            </div>
          </div>
          <NftFooter
            className="hidden md:block"
            price={base_price}
            name_of_nft={name}
            minter={minter}
            tok_id={tok_id}
          />
        </div>
        <NftFooter
          price={base_price}
          tok_id={tok_id}
          name_of_nft={name}
          minter={minter}
        />
      </div>
    </div>
  );
}
