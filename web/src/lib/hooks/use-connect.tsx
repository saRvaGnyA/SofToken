import { useEffect, useState, createContext, ReactNode } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { polybase } from '../../data/utils/polybase';
import Router from 'next/router';

const web3modalStorageKey = 'WEB3_CONNECT_CACHED_PROVIDER';

export const WalletContext = createContext<any>({});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [profilePicCid, setProfilePicCid] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);
  const [recordGlobal, setRecordGlobal] = useState({});
  const web3Modal =
    typeof window !== 'undefined' && new Web3Modal({ cacheProvider: true });

  /* This effect will fetch wallet address if user has already connected his/her wallet */
  useEffect(() => {
    async function checkConnection() {
      try {
        if (window && window.ethereum) {
          // Check if web3modal wallet connection is available on storage
          if (localStorage.getItem(web3modalStorageKey)) {
            await connectToWallet();
          }
        } else {
          console.log('window or window.ethereum is not available');
        }
      } catch (error) {
        console.log(error, 'Catch error Account is not connected');
      }
    }
    checkConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setWalletAddress = async (provider: any) => {
    try {
      const signer = provider.getSigner();
      if (signer) {
        const web3Address = await signer.getAddress();
        setAddress(web3Address);
        getBalance(provider, web3Address);
      }
    } catch (error) {
      console.log(
        'Account not connected; logged from setWalletAddress function'
      );
    }
  };

  const getBalance = async (provider: any, walletAddress: string) => {
    const walletBalance = await provider.getBalance(walletAddress);
    const balanceInEth = ethers.utils.formatEther(walletBalance);
    setBalance(balanceInEth);
  };

  const disconnectWallet = () => {
    setAddress(undefined);
    setName('');
    setUsername('');
    setProfilePicCid(undefined);
    setIsProfileComplete(false);
    web3Modal && web3Modal.clearCachedProvider();
    Router.push('/');
  };

  const checkIfExtensionIsAvailable = () => {
    if (
      (window && window.web3 === undefined) ||
      (window && window.ethereum === undefined)
    ) {
      setError(true);
      web3Modal && web3Modal.toggleModal();
    }
  };

  const connectToWallet = async () => {
    try {
      setLoading(true);
      checkIfExtensionIsAvailable();
      const connection = web3Modal && (await web3Modal.connect());
      const provider = new ethers.providers.Web3Provider(connection);
      await subscribeProvider(connection);
      setWalletAddress(provider);
      setLoading(false);

      const signer = provider.getSigner();
      const wAddress = await signer.getAddress();
      polybase.signer(async (data: string) => {
        const sig = await provider.send('personal_sign', [
          ethers.utils.hexlify(ethers.utils.toUtf8Bytes(data)),
          wAddress.toLowerCase(),
        ]);

        return { h: 'eth-personal-sign', sig };
      });

      const collectionReference = polybase.collection('User');

      const records = await collectionReference
        .where('id', '==', wAddress)
        .get();

      if (records.data.length === 0) {
        Router.push('/update-profile');
      } else {
        const record = records.data[0].data;
        setRecordGlobal(record);
        setProfilePicCid(record.profilePic);
        setUsername(record.username);
        setName(record.name);
        setIsProfileComplete(true);
      }
    } catch (error) {
      setLoading(false);
      console.log(
        error,
        'got this error on connectToWallet catch block while connecting the wallet'
      );
    }
  };

  const subscribeProvider = async (connection: any) => {
    connection.on('close', () => {
      disconnectWallet();
    });
    connection.on('accountsChanged', async (accounts: string[]) => {
      if (accounts?.length) {
        setAddress(accounts[0]);
        const provider = new ethers.providers.Web3Provider(connection);
        getBalance(provider, accounts[0]);
        
      } else {
        disconnectWallet();
      }
    });
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        loading,
        error,
        isProfileComplete,
        setIsProfileComplete,
        username,
        setUsername,
        name,
        setName,
        recordGlobal,
        profilePicCid,
        setProfilePicCid,
        connectToWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
