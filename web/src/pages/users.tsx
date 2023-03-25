import NftDetails from '@/components/nft/nft-details';
import { NextSeo } from 'next-seo';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/_dashboard';
import { NextPageWithLayout } from '@/types';
import { InferGetStaticPropsType } from 'next';
import { getStaticProps } from '.';
import ChatPage from './chatpage';
import NFTGrid from '@/components/ui/nft-card';
import AuthorImage from '@/assets/images/author.jpg';
import NFT1 from '@/assets/images/nft/nft-1.jpg';
import { polybase } from '@/data/utils/polybase';
import UserGrid from '@/components/ui/user-card';
import Button from '@/components/ui/button/button';
import { Web3Storage } from 'web3.storage';

const chat: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = () => {
  const [users, setusers] = useState([]);
  //   const [listOfPics, setlistOfPics] = useState([]);
  var listOfPics = [];
  const nft_list = [
    {
      id: 1,
      author: 'cameronwilliamson',
      authorImage: AuthorImage,
      image: NFT1,
      name: 'Pulses Of Imagination #214',
      collection: 'Chromory',
      price: '0.40 ETH',
    },
  ];
  function makeStorageClient() {
    return new Web3Storage({ token: process.env.NEXT_PUBLIC_FILECOIN_API_KEY });
  }
  const getPicDetails = async () => {
    var userRef = polybase.collection('User');
    var usersList = await userRef.get();

    var pic_list = [];
    usersList.data.forEach(async (item, index) => {
      const client = makeStorageClient();
      var picRes = await client.get(item.data.profilePic);

      const files = await picRes?.files();
      //   console.log(files[0].name)
      var pic = files?.map((file: any) =>
        Object.assign(file, {
            preview: URL.createObjectURL(file),
        //   source: `https://ipfs.io/ipfs/${file.cid}/`,
        })
      );

      console.log(`pic: ${pic[0].preview}`);
      pic_list.push(pic[0].preview);
      listOfPics = pic_list;
    });
  };
  const getUsers = async () => {
    var userRef = polybase.collection('User');
    var usersList = await userRef.get();
    var fetched_users = [];
    console.log(`list of pics: ${listOfPics}`);
   
    usersList.data.forEach(async (item, index) => {
      console.log(`for every pic : ${listOfPics[index]}`)
      fetched_users.push({
        id: item.data.id,
        author: item.data.username,
        image: listOfPics[index],
        name: item.data.name,
        collection: item.data.bio,
      });
    });
    console.log(fetched_users);
    console.log(`pic list is: ${listOfPics.length}`);
    // console.log(fetched_users.length);
    setusers(fetched_users);
    // users = fetched_users;
  };

  useEffect(() => {
    getPicDetails();
    getUsers();
  }, []);

  return (
    <>
      <NextSeo
        title="Chat"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      {/* <Button onClick={getUsers}>Get Users</Button> */}
      <div
        className={
          'grid gap-5 sm:grid-cols-2 md:grid-cols-3 3xl:grid-cols-4 4xl:grid-cols-5'
        }
      >
        {listOfPics&&  users.map((userObj) => (
          <UserGrid
            key={userObj.id}
            id={userObj.id}
            name={userObj.name}
            image={userObj.image}
            author={userObj.author}
            authorImage={AuthorImage}
            price={userObj.price}
            collection={userObj.collection}
          />
        ))}
      </div>

      {/* <NftDetails product={nftData} /> */}
    </>
  );
};

chat.getLayout = function getLayout(page) {
  return (
    <DashboardLayout contentClassName="flex items-center justify-center">
      {page}
    </DashboardLayout>
  );
};
export default chat;
