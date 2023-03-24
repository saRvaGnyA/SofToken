import { useContext, useEffect, useState } from 'react';
import { StaticImageData } from 'next/image';
import { SearchIcon } from '@/components/icons/search';
import Avatar from '@/components/ui/avatar';
import { WalletContext } from '@/lib/hooks/use-connect';

export const collectionList = [
  {
    name: 'Iron flower',
    value: 'iron-flower',
  },
  {
    name: 'Creative web',
    value: 'creative-web',
  },
  {
    name: 'Art in binary',
    value: 'art-in-binary',
  },
  {
    name: 'Sound of wave',
    value: 'sound-of-wave',
  },
  {
    name: 'Pixel art',
    value: 'pixel-art',
  },
];

interface DependencySelectTypes {
  onSelect: (value: string) => void;
}

export default function DependencySelect({ onSelect }: DependencySelectTypes) {
  let [searchKeyword, setSearchKeyword] = useState('');
  const [dependencyName, setdepenencyName] = useState([]);
  const { recordGlobal } = useContext(WalletContext);
  let coinListData = collectionList;
  if (searchKeyword.length > 0) {
    coinListData = collectionList.filter(function (item) {
      const name = item.name;
      return (
        name.match(searchKeyword) ||
        (name.toLowerCase().match(searchKeyword) && name)
      );
    });
  }
  function handleSelectedCoin(value: string) {
    onSelect(value);
    console.log('select');

    if (!dependencyName.includes(value))
      setdepenencyName([...dependencyName, value]);
    else {
      var newdeps = [];
      for (var i in dependencyName) {
        if (dependencyName[i] !== value) newdeps.push(dependencyName[i]);
      }

      setdepenencyName(newdeps);
    }
    console.log(dependencyName);
  }
  useEffect(() => {}, [dependencyName]);

  return (
    <div className="w-full rounded-lg bg-white text-sm shadow-large dark:bg-light-dark">
      <div className="relative">
        <SearchIcon className="absolute left-6 h-full text-gray-700 dark:text-white" />
        <input
          type="search"
          autoFocus={true}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search..."
          className="w-full border-x-0 border-b border-dashed border-gray-200 py-3.5 pl-14 pr-6 text-sm focus:border-gray-300 focus:ring-0 dark:border-gray-600 dark:bg-light-dark dark:text-white dark:focus:border-gray-500"
        />
      </div>
      <ul role="listbox" className="py-3">
        {coinListData.length > 0 ? (
          coinListData.map((item, index) =>
            dependencyName.includes(item.value) ? (
              <li
                key={index}
                role="listitem"
                tabIndex={index}
                onClick={() => handleSelectedCoin(item.value)}
                className="mb-1 flex cursor-pointer items-center gap-3 bg-gray-200 py-1.5 px-6  outline-none dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                <span className="text-sm tracking-tight text-gray-600 dark:text-white">
                  {item.name}
                </span>
              </li>
            ) : (
              <li
                key={index}
                role="listitem"
                tabIndex={index}
                onClick={() => handleSelectedCoin(item.value)}
                className="mb-1 flex cursor-pointer items-center gap-3 py-1.5 px-6 outline-none hover:bg-gray-100 dark:hover:bg-gray-700 "
              >
                <span className="text-sm tracking-tight text-gray-600 dark:text-white">
                  {item.name}
                </span>
              </li>
            )
          )
        ) : (
          <li className="px-6 py-5 text-center">
            <h3 className="mb-2 text-sm text-gray-600 dark:text-white">
              Oops! Could not find this NFT in your collection
            </h3>
          </li>
        )}
      </ul>
    </div>
  );
}
