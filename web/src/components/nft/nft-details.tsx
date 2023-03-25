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
import { Contract, ethers } from 'ethers';
import * as PushAPI from '@pushprotocol/restapi';
import Web3Modal from 'web3modal';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { CONTRACT_ADDRESS, ABI } from '@/constants';

interface NftFooterProps {
  className?: string;
  price?: number;
  name_of_nft: string;
  minter: object;
}

function NftFooter({
  className = 'md:hidden',
  price,
  name_of_nft,
  minter,
}: NftFooterProps) {
  const { openModal } = useModal();
  const router = useRouter();
  const { address, disconnectWallet, balance } = useContext(WalletContext);
  const web3Modal =
    typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });
  const subscribeNFT = async () => {
    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const tokensContract = new Contract(CONTRACT_ADDRESS, ABI, signer);
    //fetch token id  and curr cost of nft from polybase
    const token_id = 1;
    var cost_in_eth = 0.001;
    const cost_of_nft = cost_in_eth * 10 ** 18;
    //1 ether = 10^18 =>cost of nft
    // let ethersToWei = ethers.utils.parseUnits(cost_in_eth.toString(), 'ether');
    // console.log(ethersToWei);
    // console.log(ethersToWei.toString());
    // console.log(ethersToWei.toHexString(16));
    // ethereum
    //   .request({
    //     method: 'eth_sendTransaction',
    //     params: [
    //       {
    //         from: address,
    //         to: CONTRACT_ADDRESS,
    //         value: ethersToWei.toHexString(16),
    //       },
    //     ],
    //   })
    //   .then((txHash) => console.log(txHash))
    //   .catch((error) => console.error(error));
    // const res = await tokensContract.subscribe(token_id, cost_of_nft);
    // console.log(res);
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

    router.push({ pathname: '/profile' });
  };
  return (
    <div
      className={cn(
        'sticky bottom-0 z-10 bg-body dark:bg-dark md:-mx-2',
        className
      )}
    >
      <div className="-mx-4 border-t-2 border-gray-900 px-4 pt-4 pb-5 dark:border-gray-700 sm:-mx-6 sm:px-6 md:mx-2 md:px-0 md:pt-5 lg:pt-6 lg:pb-7">
        <div className="flex gap-4 pb-3.5 md:pb-4 xl:gap-5">
          <div className="block w-1/2 shrink-0 md:w-2/5">
            <h3 className="mb-1 truncate text-13px font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-1.5 sm:text-sm">
              Current Price
            </h3>
            <div className="text-lg font-medium -tracking-wider md:text-xl xl:text-2xl">
              {price} ETH
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button shape="rounded" onClick={subscribeNFT}>
            {`BUY FOR ${price} ETH`}
          </Button>
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
          />
        </div>
        <NftFooter price={base_price} name_of_nft={name} minter={minter} />
      </div>
    </div>
  );
}
