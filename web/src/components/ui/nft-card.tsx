import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { Verified } from '@/components/icons/verified';
import Avatar from '@/components/ui/avatar';
import { StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type NFTGridProps = {
  author: string;
  authorImage: StaticImageData;
  id: BigInteger;
  image: StaticImageData;
  name: string;
  collection: string;
  price: string;
};

export default function NFTGrid({
  author,
  authorImage,
  id,
  image,
  name,
  collection,
  price,
}: NFTGridProps) {
  const [url, setUrl] = useState('');

  const initialLoad = async () => {
    const res = await fetch(
      `https://bafybeihpjhkeuiq3k6nqa3fkgeigeri7iebtrsuyuey5y6vy36n345xmbi.ipfs.w3s.link/${id}`
    );
    const img = await res.json();
    setUrl(img.image);
  };

  useEffect(() => {
    initialLoad();
  }, []);
 const router = useRouter()
  return (
    <div className="relative overflow-hidden rounded-lg bg-white shadow-card transition-all duration-200 hover:shadow-large dark:bg-light-dark">
      {/* <AnchorLink href="/nft-details" className="relative block w-full pb-full">
        <Image
          src={image}
          placeholder="blur"
          layout="fill"
          objectFit="cover"
          alt=""
        />
https://bafybeig7e6b4uyqsqh7lwjuuizcnyygekjuajof6myg67yilxdtdcbspua.ipfs.w3s.link/images/2.svg
      </AnchorLink> */}
      {url && <img src={`https://w3s.link/ipfs/${url.slice(7)}`}></img>}

      <div className="p-5">
        <AnchorLink
          href={`/nft-details/${id}`}
          className="text-sm font-medium text-black dark:text-white"
        >
          {name}
        </AnchorLink>
        <div className="mt-1.5 flex">
          <div className="inline-flex items-center text-xs text-gray-600 dark:text-gray-400">
            {collection}
          </div>
        </div>
        <div className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          Base Price: {price}
        </div>
      </div>
    </div>
  );
}
