import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import DashboardLayout from '@/layouts/_dashboard';
import AnchorLink from '@/components/ui/links/anchor-link';
import Button from '@/components/ui/button';
import NotificationCard, {
  NotificationCardProps,
} from '@/components/ui/notification-card';

//images
import User1 from '@/assets/images/avatar/8.jpg';
import User2 from '@/assets/images/avatar/9.jpg';
import User3 from '@/assets/images/avatar/10.jpg';
import User4 from '@/assets/images/avatar/11.jpg';
import Image from '@/components/ui/image';
import { url } from 'inspector';
import { useContext, useEffect, useState } from 'react';
import WalletConnect from '@/components/nft/wallet-connect';
import { useRouter } from 'next/router';
import { WalletContext } from '@/lib/hooks/use-connect';
import { ethers } from 'ethers';
import * as PushAPI from '@pushprotocol/restapi';
import Web3Modal from 'web3modal';

// const notifications = [
//   {
//     id: 1,
//     type: 'followed',
//     actor: {
//       name: 'dolcemariposa',
//       avatar: User1,
//     },
//     time: 'Just Now',
//     url: '#',
//     notifier: 'you',
//   },
//   {
//     id: 2,
//     type: 'liked',
//     actor: {
//       name: 'pimptronot',
//       avatar: User2,
//     },
//     time: '10 minutes ago',
//     url: '#',
//     notifier: 'Cryppo #1491',
//   },
//   {
//     id: 3,
//     type: 'purchased',
//     actor: {
//       name: 'centralgold',
//       avatar: User3,
//     },
//     time: '20 minutes ago',
//     url: '#',
//     notifier: 'Pepe mfer #16241',
//   },
//   {
//     id: 4,
//     type: 'followed',
//     actor: {
//       name: 'theline',
//       avatar: User4,
//     },
//     time: '30 minutes ago',
//     url: '#',
//     notifier: 'you',
//   },
// ];

const NotificationPage: NextPageWithLayout = () => {
  const { address, disconnectWallet, balance } = useContext(WalletContext);
  const web3Modal =
    typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });
  const getNotif = async () => {
    const connection = web3Modal && (await web3Modal.connect());
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const user = await PushAPI.user.get({
      account: `eip155:${address}`,
    });
    console.log(user);
    // console.log(user2.encryptedPrivateKey)
    // const pgpDecryptedPvtKey = await PushAPI.chat.decryptPGPKey({
    //   encryptedPGPPrivateKey: user.encryptedPrivateKey,
    //   signer: signer,
    // });
    const notifications = await PushAPI.user.getFeeds({
      user: `eip155:5:${address}`, // user address in CAIP
      env: 'staging',
      
    });
    console.log(notifications);
    setnotifications(notifications)
    return notifications
    
  };
  const [notifications, setnotifications] = useState([])
  // setnotifications(getNotif())
  // getNotif()
  useEffect(() => {
    getNotif()
  }, [])
  
  return (
    <>
      <NextSeo
        title="Notifications"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <div className="mx-auto w-[660px] max-w-full">
        <div className="mb-7 flex items-center justify-between gap-6">
          <h2 className="text-center text-lg font-medium text-gray-900 dark:text-white sm:text-xl lg:text-2xl">
            Notifications
          </h2>
          <Button
            color="white"
            variant="transparent"
            size="mini"
            shape="rounded"
          >
            <span className="text-xs tracking-tighter">Mark all as read</span>
          </Button>
        </div>

        {notifications.map((notification) => {
          console.log(notification.notification.title)
          console.log(notification.notification.body)
          const notif = {
            id: notification.sid,
            title: notification.notification.title,
            body :notification.notification.body
          }
          const notificationItem = notif as NotificationCardProps;
          return (
            // <div>hello</div>
            <NotificationCard key={notif.id} {...notificationItem} />
          );
        })}
      </div>
    </>
  );
};

NotificationPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default NotificationPage;
