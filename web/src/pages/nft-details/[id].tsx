import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { NextSeo } from 'next-seo';
import type { NextPageWithLayout } from '@/types';
import DashboardLayout from '@/layouts/_dashboard';
import NftDetails from '@/components/nft/nft-details';
import { nftData } from '@/data/static/single-nft';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { polybase } from '@/data/utils/polybase';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

const NFTDetailsPage: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = () => {
  const NFTCollectionReference = polybase.collection('NFT');
  const [item, setItem] = useState({});
  const [url, setUrl] = useState('');

  const initialLoad = async () => {
    const res = await NFTCollectionReference.record(id).get();
    console.log(res);
    setItem(res.data);
    const resImg = await fetch(
      `https://bafybeihpjhkeuiq3k6nqa3fkgeigeri7iebtrsuyuey5y6vy36n345xmbi.ipfs.w3s.link/${id}`
    );
    const img = await resImg.json();
    setUrl(`https://w3s.link/ipfs/${img.image.slice(7)}`);
  };
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      initialLoad();
    }
  }, [id]);

  return (
    <>
      <NextSeo title="NFT Details" description="SofToken" />
      <NftDetails product={{ ...item, image: url }} />
    </>
  );
};

NFTDetailsPage.getLayout = function getLayout(page) {
  return <DashboardLayout contentClassName="!pb-0">{page}</DashboardLayout>;
};

export default NFTDetailsPage;
