import Image from '@/components/ui/image';
import cn from 'classnames';
import { StaticImageData } from 'next/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { useEffect, useState } from 'react';

type ItemType = {
  id?: string | number;
  name: string;
  clause_type: string;
  description: string;
};
type CardProps = {
  item: ItemType;
  className?: string;
};

export default function CollectionCard({ item, className = '' }: CardProps) {
  const { name, clause_type, description, id } = item ?? {};
  const [image, setImage] = useState('');

  const initialLoad = async () => {
    const resImg = await fetch(
      `https://bafybeihpjhkeuiq3k6nqa3fkgeigeri7iebtrsuyuey5y6vy36n345xmbi.ipfs.w3s.link/${id}`
    );
    const img = await resImg.json();
    setImage(`https://w3s.link/ipfs/${img.image.slice(7)}`);
  };

  useEffect(() => {
    if (id) {
      initialLoad();
    }
  }, [id]);

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg transition-transform hover:-translate-y-1',
        className
      )}
    >
      <div className="relative flex aspect-[8/11] w-full justify-center overflow-hidden rounded-lg">
        {image && <img src={image} alt={name} />}
      </div>
      <div className="absolute top-0 left-0 z-[5] flex h-full w-full flex-col justify-between bg-gradient-to-t from-black p-5 md:p-6">
        <AnchorLink
          href={`/nft-details/${id}`}
          className="absolute top-0 left-0 z-10 h-full w-full"
        />
        <div className="flex justify-between gap-3">
          <div
            className="inline-flex h-8 shrink-0 items-center rounded-2xl bg-white/20 px-4 text-xs font-medium uppercase -tracking-wide text-white
          backdrop-blur-[40px]"
          >
            {clause_type === 'prop'
              ? 'Properiatary'
              : clause_type === 'royalty'
              ? 'Code with Royalty'
              : 'Code without Royalty'}
          </div>
        </div>
        <div className="block">
          <h2 className="mb-1.5 truncate text-lg font-medium -tracking-wider text-white">
            {name}
          </h2>
          <div className="text-sm font-medium -tracking-wide text-[#B6AAA2]">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}
