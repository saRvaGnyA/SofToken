import ParamTab, { TabPanel } from '@/components/ui/param-tab';
import ListCard from '@/components/ui/account-card';
import TransactionSearchForm from '@/components/author/transaction-search-form';
import TransactionHistory from '@/components/author/transaction-history';
import CollectionCard from '@/components/ui/collection-card';
import { useState, useEffect } from 'react';
// static data
import { collections } from '@/data/static/collections';
import {
  authorWallets,
  authorNetworks,
  authorProtocols,
} from '@/data/static/author-profile';
import { polybase } from '@/data/utils/polybase';

export default function ProfileTab({
  followersList,
  followingList,
  userRecord,
  profileImage,
  user,
}) {
  const collectionReference = polybase.collection('User');
  const NFTCollectionReference = polybase.collection('NFT');

  const [followerDetails, setFollowerDetails] = useState([]);
  const [followingDetails, setFollowingDetails] = useState([]);
  const [nftsCollection, setNftsCollection] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  const getDetails = async () => {
    const followers = await followersList.map(async ({ data }) => {
      const followerRecords = await collectionReference
        .where('username', '==', data.follower_id)
        .get();
      return {
        id: followerRecords.data[0].data.id,
        name: followerRecords.data[0].data.name,
        username: followerRecords.data[0].data.username,
      };
    });
    const followersFinal = await Promise.all(followers);
    // console.log('followers:\n');
    // console.log(followersFinal);
    setFollowerDetails(followersFinal);

    const following = await followingList.map(async ({ data }) => {
      const followingRecords = await collectionReference
        .where('username', '==', data.following_id)
        .get();
      return {
        id: followingRecords.data[0].data.id,
        name: followingRecords.data[0].data.name,
        username: followingRecords.data[0].data.username,
      };
    });
    const followingFinal = await Promise.all(following);
    // console.log(followingFinal);
    setFollowingDetails(followingFinal);
  };

  const getNFTCollectionDetails = async () => {
    const nfts = await NFTCollectionReference.where(
      'minter',
      '==',
      user.id
    ).get();
    console.log(nfts);
    setNftsCollection(nfts.data);
  };

  const getPortfolioCollectionDetails = async () => {
    if (user.nfts) {
      const nfts = user.nfts.map(async (nft) => {
        const nftRecord = await NFTCollectionReference.record(nft).get();
        return nftRecord.data;
      });
      const portfolioNFTs = await Promise.all(nfts);
      setPortfolio(portfolioNFTs);
    }
  };

  useEffect(() => {
    if (user) {
      getDetails();
      getNFTCollectionDetails();
      getPortfolioCollectionDetails();
    }
  }, [followersList, followingList, user]);

  return (
    <ParamTab
      tabMenu={[
        {
          title: 'Collection',
          path: 'collection',
        },
        {
          title: 'Portfolio',
          path: 'portfolio',
        },
        {
          title: 'Followers',
          path: 'followers',
        },
        {
          title: 'Following',
          path: 'following',
        },
      ]}
    >
      <TabPanel className="focus:outline-none">
        <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 lg:gap-5 xl:gap-6 3xl:grid-cols-3 4xl:grid-cols-4">
          {nftsCollection?.map((collection) => (
            <CollectionCard item={collection.data} key={collection?.data.id} />
          ))}
        </div>
      </TabPanel>
      <TabPanel className="focus:outline-none">
        <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 lg:gap-5 xl:gap-6 3xl:grid-cols-3 4xl:grid-cols-4">
          {portfolio?.map((collection) => (
            <CollectionCard item={collection.data} key={collection?.data.id} />
          ))}
        </div>
      </TabPanel>
      <TabPanel className="focus:outline-none">
        <div className="space-y-8 md:space-y-10 xl:space-y-12">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4">
            {followerDetails?.map((wallet) => (
              <ListCard item={wallet} key={wallet?.id} variant="medium" />
            ))}
          </div>
        </div>
      </TabPanel>
      <TabPanel className="focus:outline-none">
        <div className="space-y-8 md:space-y-10 xl:space-y-12">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4">
            {followingDetails?.map((wallet) => (
              <ListCard item={wallet} key={wallet?.id} variant="medium" />
            ))}
          </div>
        </div>
      </TabPanel>
    </ParamTab>
  );
}
