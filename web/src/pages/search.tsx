import { useContext, useEffect, useState } from 'react';
import { atom, useAtom } from 'jotai';
import { NextSeo } from 'next-seo';
import AuthorImage from '@/assets/images/author.jpg';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import type { NextPageWithLayout } from '@/types';
import Slider from 'rc-slider';
import { motion } from 'framer-motion';
import DashboardLayout from '@/layouts/_dashboard';
import { ChevronDown } from '@/components/icons/chevron-down';
import NFTGrid from '@/components/ui/nft-card';
import { RadioGroup } from '@/components/ui/radio-group';
import { Listbox } from '@/components/ui/listbox';
import Collapse from '@/components/ui/collapse';
import { Transition } from '@/components/ui/transition';
import { NormalGridIcon } from '@/components/icons/normal-grid';
import { CompactGridIcon } from '@/components/icons/compact-grid';
import CollectionSelect from '@/components/ui/collection-select-list';
import { useDrawer } from '@/components/drawer-views/context';
import Scrollbar from '@/components/ui/scrollbar';
import Button from '@/components/ui/button';
import { Close } from '@/components/icons/close';
import { NFTList } from '@/data/static/nft-list';
import { WalletContext } from '@/lib/hooks/use-connect';
import { Contract, ethers } from 'ethers';
import * as PushAPI from '@pushprotocol/restapi';
import Web3Modal from 'web3modal';
import { CONTRACT_ADDRESS, ABI } from '../constants/index.js';
import DependencySelect from '@/components/ui/dependency-select';
import { polybase } from '@/data/utils/polybase';
import { listenerCount } from 'process';
const gridCompactViewAtom = atom(false);

import { useRouter } from 'next/router.js';

export function DrawerFilters() {
  const { closeDrawer } = useDrawer();
  return (
    <div className="relative w-full max-w-full bg-white dark:bg-dark xs:w-80">
      <div className="flex h-20 items-center justify-between overflow-hidden px-6 py-4">
        <h2 className="text-xl font-medium uppercase tracking-wider text-gray-900 dark:text-white">
          Filters
        </h2>
        <Button
          shape="circle"
          color="white"
          onClick={closeDrawer}
          className="dark:bg-light-dark"
        >
          <Close className="h-auto w-3" />
        </Button>
      </div>
      <Scrollbar style={{ height: 'calc(100% - 96px)' }}>
        <div className="px-6 pb-20 pt-1">
          <Filters />
        </div>
      </Scrollbar>
      <div className="absolute left-0 bottom-4 z-10 w-full px-6">
        <Button fullWidth onClick={closeDrawer}>
          DONE
        </Button>
      </div>
    </div>
  );
}
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

// var listOfNFTs = [];
var status = '';
var final_price = { min: 0, max: 1000 };

function useGridSwitcher() {
  const [isGridCompact, setIsGridCompact] = useAtom(gridCompactViewAtom);
  return {
    isGridCompact,
    setIsGridCompact,
  };
}

function GridSwitcher() {
  const { isGridCompact, setIsGridCompact } = useGridSwitcher();
  return (
    <div className="flex overflow-hidden rounded-lg">
      <button
        className={`relative flex h-11 w-11 items-center justify-center bg-gray-100 transition dark:bg-gray-800 ${
          !isGridCompact ? 'z-10 text-white' : 'text-brand dark:text-white'
        }`}
        onClick={() => setIsGridCompact(!isGridCompact)}
        aria-label="Normal Grid"
      >
        {!isGridCompact && (
          <motion.span
            className="absolute left-0 right-0 bottom-0 h-full w-full bg-brand shadow-large"
            layoutId="gridSwitchIndicator"
          />
        )}
        <NormalGridIcon className="relative" />
      </button>
      <button
        className={`relative flex h-11 w-11 items-center justify-center bg-gray-100 transition dark:bg-gray-800 ${
          isGridCompact ? 'z-10 text-white' : 'text-brand dark:text-white'
        }`}
        onClick={() => setIsGridCompact(!isGridCompact)}
        aria-label="Normal Grid"
      >
        {isGridCompact && (
          <motion.span
            className="absolute left-0 right-0 bottom-0 h-full w-full  bg-brand shadow-large"
            layoutId="gridSwitchIndicator"
          />
        )}
        <CompactGridIcon className="relative" />
      </button>
    </div>
  );
}

// function SortList() {
//   return (
//     <div className="relative">
//       <Listbox value={selectedItem} onChange={setSelectedItem}>
//         <Listbox.Button className="flex h-10 w-auto items-center justify-between rounded-lg bg-gray-100 px-4 text-xs text-gray-900 dark:bg-gray-800 dark:text-white sm:w-56 sm:text-sm lg:h-11">
//           {selectedItem.name}
//           <ChevronDown className="ltr:ml-2 rtl:mr-2" />
//         </Listbox.Button>
//         <Transition
//           enter="ease-out duration-200"
//           enterFrom="opacity-0 translate-y-2"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100 -translate-y-0"
//           leaveTo="opacity-0 translate-y-2"
//         >
//           <Listbox.Options className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white p-3 shadow-large dark:bg-light-dark sm:w-full">
//             {sort.map((item) => (
//               <Listbox.Option key={item.id} value={item}>
//                 {({ selected }) => (
//                   <div
//                     className={`block cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-gray-900 transition dark:text-white sm:text-sm  ${
//                       selected
//                         ? 'my-1 bg-gray-100 dark:bg-gray-800'
//                         : 'hover:bg-gray-50 dark:hover:bg-gray-700'
//                     }`}
//                   >
//                     {item.name}
//                   </div>
//                 )}
//               </Listbox.Option>
//             ))}
//           </Listbox.Options>
//         </Transition>
//       </Listbox>
//     </div>
//   );
// }

function PriceRange() {
  let [range, setRange] = useState({ min: 0.1, max: 2 });
  function handleRangeChange(value: any) {
    setRange({
      min: value[0],
      max: value[1],
    });
  }

  function handleMaxChange(max: number) {
    setRange({
      ...range,
      max: max || range.min,
    });
  }

  function handleMinChange(min: number) {
    setRange({
      ...range,
      min: min || 0,
    });
  }
  final_price = range;

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
        <input
          className="h-9 rounded-lg border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500"
          type="number"
          value={range.max}
          step={0.01}
          onChange={(e) => handleMaxChange(parseInt(e.target.value))}
          // onBlur={setprice_range(range)}
          min={range.min}
        />
      </div>
      <Slider
        range
        min={0.1}
        max={2}
        value={[range.min, range.max]}
        allowCross={false}
        step={0.01}
        onChange={(value) => handleRangeChange(value)}
        // onBlur={setprice_range(range)}
      />
    </div>
  );
}

function Status() {
  // console.log(listOfNFTs)
  let [plan, setPlan] = useState('buy-now');
  console.log(plan);
  status = plan;
  return (
    <RadioGroup
      value={plan}
      onChange={setPlan}
      className="grid grid-cols-2 gap-2 p-5"
    >
      <RadioGroup.Option value="prop">
        {({ checked }) => (
          <span
            className={`h-30 flex cursor-pointer grid-cols-2 items-center justify-center rounded-lg border border-solid text-center text-sm font-medium  tracking-wide transition-all ${
              checked
                ? 'border-brand bg-brand text-white shadow-button'
                : 'border-gray-200 bg-white text-brand dark:border-gray-700 dark:bg-gray-800 dark:text-white'
            }`}
          >
            Properitary Executable
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="royalty">
        {({ checked }) => (
          <span
            className={`h-30 flex cursor-pointer items-center justify-center rounded-lg border border-solid text-center text-sm font-medium  tracking-wide transition-all ${
              checked
                ? 'border-brand bg-brand text-white shadow-button'
                : 'border-gray-200 bg-white text-brand dark:border-gray-700 dark:bg-gray-800 dark:text-white'
            }`}
          >
            Reusable with Royalty
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="nonroyalty">
        {({ checked }) => (
          <span
            className={`h-30  flex cursor-pointer items-center justify-center rounded-lg border border-solid text-center text-sm font-medium  tracking-wide transition-all ${
              checked
                ? 'border-brand bg-brand text-white shadow-button'
                : 'border-gray-200 bg-white text-brand dark:border-gray-700 dark:bg-gray-800 dark:text-white'
            }`}
          >
            Reusable without Royalty
          </span>
        )}
      </RadioGroup.Option>
      {/* <RadioGroup.Option value="has-offers">
        {({ checked }) => (
          <span
            className={`flex h-9 cursor-pointer items-center justify-center rounded-lg border border-solid text-center text-sm font-medium uppercase tracking-wide transition-all ${
              checked
                ? 'border-brand bg-brand text-white shadow-button'
                : 'border-gray-200 bg-white text-brand dark:border-gray-700 dark:bg-gray-800 dark:text-white'
            }`}
          >
            Has offers
          </span>
        )}
      </RadioGroup.Option> */}
    </RadioGroup>
  );
}

function Filters() {
  return (
    <>
      <Collapse label="Status" initialOpen>
        <Status />
      </Collapse>
      <Collapse label="Price Range" initialOpen>
        <PriceRange />
      </Collapse>
      <Collapse label="Collection" initialOpen>
        <CollectionSelect onSelect={(value) => console.log(value)} />
      </Collapse>
      <Collapse label="Dependency" initialOpen>
        <DependencySelect
          onSelect={(value) => console.log(`this is ${value}`)}
        />
      </Collapse>
    </>
  );
}

const SearchPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = () => {
  const { isGridCompact } = useGridSwitcher();
  const { openDrawer } = useDrawer();
  const [listOfImgs, setlistOfImgs] = useState([]);
  const [listOfNFTs, setlistOfNFTs] = useState([]);
  const { address, disconnectWallet, balance } = useContext(WalletContext);
  const NFTcollection = polybase.collection('NFT');
  const router = useRouter();
  const web3Modal =
    typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });

  const sort = [
    { id: 1, name: 'Date Listed: Newest' },
    { id: 2, name: 'Date Listed: Oldest' },
    { id: 3, name: 'Ending: Soonest' },
    { id: 4, name: 'Ending: Latest' },
  ];
  const [selectedItem, setSelectedItem] = useState(sort[0]);

  const testing = async () => {
    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = await provider.getSigner();
    const tokensContract = new Contract(CONTRACT_ADDRESS, ABI, signer);
    const listOfToks = await tokensContract.getTotalTokens();
    console.log(parseInt(listOfToks.toString()));
    const numOfToks = parseInt(listOfToks.toString());
    var listOfImages = [];
    // const uriImg = await tokensContract.uri(0);
    // const finalStr =  "https://ipfs.io/ipfs/"+uriImg.toString().slice(7,-6)

    for (let i = 0; i < numOfToks; i++) {
      //  await uriImg.wait(1)
      //  console.log(finalStr)
      //  setlistOfImgs([...listOfImgs,`https://ipfs.io/ipfs/QmQd5ziX7Ru4mXhmrEdT8DevLu6uFg5TtJSxSU7PRJnYEw/${i}.png`])
      listOfImages.push(
        `https://ipfs.io/ipfs/QmQd5ziX7Ru4mXhmrEdT8DevLu6uFg5TtJSxSU7PRJnYEw/${i}.png`
      );
    }
    setlistOfImgs(listOfImages);
    console.log(listOfImgs);

    // return listOfImages;
    //ipfs://Qmaa6TuP2s9pSKczHF4rwWhTKUdygrrDs8RmYYqCjP3Hye/0.json
    //https://ipfs.io/ipfs/bafkreifvallbyfxnedeseuvkkswt5u3hbdb2fexcygbyjqy5a5rzmhrzei
  };
  const getList = async () => {
    var listOfNFT = await NFTcollection.get();
    var finalList = [];
    listOfNFT.data.forEach(function (item, index) {
      console.log(item.data, index);
      finalList.push({
        id: item.data.id,  //needs to be updated
        name: item.data.name,
        desc: item.data.description,
        price: item.data.base_price + ' ETH',
        author: item.data.minter.id,
        clause: item.data.clause_type,
      });
    });
    setlistOfNFTs(finalList);
  };
  const check = async () => {
    console.log(status);
    console.log(final_price);
    var listOfNFT = await NFTcollection.get();

    var finalList = [];
    listOfNFT.data.forEach(function (item, index) {
      var price_ = parseFloat(item.data.base_price);
      console.log(index, price_, status, final_price);
      if (
        price_ >= final_price.min &&
        price_ <= final_price.max &&
        item.data.clause_type === status
      ) {
        finalList.push({
          id: item.data.id, //needs to be updated
          name: item.data.name,
          desc: item.data.description,
          price: item.data.base_price + ' ETH',
          author: item.data.minter.id,
          clause: item.data.clause_type,
        });
        console.log(item.data.id)
      }
    });
    setlistOfNFTs(finalList);
    // console.log(listOfNFTs)
  };

  useEffect(() => {
    getList();
  }, []);
  console.log(`listOfNFTs:${listOfNFTs}`);
  return (
    <>
      {/* <Button
        onClick={async () => {
          getList()
        }}
      >
        Testing
      </Button> */}
      <Button onClick={check}>Fetch</Button>
      <NextSeo
        title="Explore NTF"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="grid sm:pt-5 2xl:grid-cols-[280px_minmax(auto,_1fr)] 4xl:grid-cols-[320px_minmax(auto,_1fr)]">
        <div className="hidden border-dashed border-gray-200 ltr:border-r ltr:pr-8 rtl:border-l rtl:pl-8 dark:border-gray-700 2xl:block">
          <Filters listOfNFTs={listOfNFTs} />
        </div>

        <div className="2xl:ltr:pl-10 2xl:rtl:pr-10 4xl:ltr:pl-12 4xl:rtl:pr-12">
          <div className="relative z-10 mb-6 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-900 dark:text-white sm:text-sm">
              {listOfNFTs.length} items
            </span>

            <div className="flex gap-6 2xl:gap-8">
              {/* <SortList /> */}
              <div className="hidden 3xl:block">
                <GridSwitcher />
              </div>
              <div className="hidden sm:block 2xl:hidden">
                <Button
                  shape="rounded"
                  size="small"
                  color="gray"
                  onClick={() => openDrawer('DRAWER_SEARCH')}
                  className="dark:bg-gray-800"
                >
                  Filters
                </Button>
              </div>
            </div>
          </div>
          <div
            className={
              isGridCompact
                ? 'grid gap-5 sm:grid-cols-2 md:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5'
                : 'grid gap-6 sm:grid-cols-2 md:grid-cols-3 3xl:grid-cols-3 4xl:grid-cols-4'
            }
          >
            {listOfNFTs &&
              listOfNFTs.map((nft) => (
                <NFTGrid
                  key={nft.id}
                  id={nft.id}
                  name={nft.name}
                  image="{nft.image}"
                  author={nft.author}
                  authorImage={AuthorImage}
                  price={nft.price}
                  collection={
                    nft.clause === 'prop'
                      ? 'Properiatary'
                      : nft.clause === 'royalty'
                      ? 'Reusable code with Royalty'
                      : 'Reusable code without Royalty'
                  }
                />
              ))}
          </div>
        </div>

        <div className="fixed bottom-6 left-1/2 z-10 w-full -translate-x-1/2 px-9 sm:hidden">
          <Button onClick={() => openDrawer('DRAWER_SEARCH')} fullWidth>
            Filters
          </Button>
        </div>
      </div>
    </>
  );
};

SearchPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default SearchPage;
