import NftDetails from '@/components/nft/nft-details'
import { NextSeo } from 'next-seo'
import React from 'react'
import DashboardLayout from '@/layouts/_dashboard';
import { NextPageWithLayout } from '@/types';
import { InferGetStaticPropsType } from 'next';
import { getStaticProps } from '.';
import ChatPage from './chatpage';

const chat: NextPageWithLayout<
InferGetStaticPropsType<typeof getStaticProps>
>  = () =>{
  return (
    <>
      <NextSeo
        title="Chat"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <ChatPage/>
      {/* <NftDetails product={nftData} /> */}
    </>
  )
}


chat.getLayout = function getLayout(page) {
    return (
      <DashboardLayout  contentClassName="flex items-center justify-center">
        {page}
      </DashboardLayout>
    );
  };
export default chat;
  
