import { useContext, useState, useEffect } from 'react';
import type { NextPageWithLayout } from '@/types';
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import { Transition } from '@/components/ui/transition';
import DashboardLayout from '@/layouts/_dashboard';
import { RadioGroup } from '@/components/ui/radio-group';
import { Listbox } from '@/components/ui/listbox';
import Image from '@/components/ui/image';
import Button from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import Uploader from '@/components/ui/forms/image-uploader';
import InputLabel from '@/components/ui/input-label';
import ToggleBar from '@/components/ui/toggle-bar';
import { TagIcon } from '@/components/icons/tag-icon';
import { LoopIcon } from '@/components/icons/loop-icon';
import { SandClock } from '@/components/icons/sand-clock';
import { ChevronDown } from '@/components/icons/chevron-down';
import { Ethereum } from '@/components/icons/ethereum';
import { Flow } from '@/components/icons/flow';
import { OptionIcon } from '@/components/icons/option';
import { Verified } from '@/components/icons/verified';
import Avatar from '@/components/ui/avatar';
import { WalletContext } from '@/lib/hooks/use-connect';
import { polybase } from '../data/utils/polybase';
import { Web3Storage } from 'web3.storage';
import Router from 'next/router';

//images
import AuthorImage from '@/assets/images/author.jpg';
import NFT1 from '@/assets/images/nft/nft-1.jpg';

const UpdateProfilePage: NextPageWithLayout = () => {
  const [profilePic, setProfilePic] = useState([]);
  const [profilePreview, setProfilePreview] = useState([]);
  const [coverPic, setCoverPic] = useState([]);
  const [termsAgree, setTermsAgree] = useState(false);
  const [bio, setBio] = useState('');
  const collectionReference = polybase.collection('User');
  const {
    address,
    balance,
    username,
    name,
    profilePicCid,
    isProfileComplete,
    setUsername,
    setName,
    setProfilePicCid,
    setIsProfileComplete,
  } = useContext(WalletContext);

  function makeStorageClient() {
    return new Web3Storage({ token: process.env.NEXT_PUBLIC_FILECOIN_API_KEY });
  }

  const initialDataLoad = async () => {
    const { data } = await collectionReference.where('id', '==', address).get();
    console.log(data[0].data);
    const record = data[0].data;
    setBio(record.bio);
    setName(record.name);
    setUsername(record.username);

    const client = makeStorageClient();
    const res = await client.get(profilePicCid);

    // unpack File objects from the response
    const files = await res?.files();
    setProfilePreview(
      files?.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  };

  useEffect(() => {
    if (isProfileComplete) {
      initialDataLoad();
    }
  }, [isProfileComplete]);

  const submitHandler = async () => {
    const timestamp = Date.now().toString();
    const client = makeStorageClient();
    const pfPicCid = await client.put(profilePic);
    const coverPicCid = await client.put(coverPic);
    const userData = await collectionReference.create([
      address,
      timestamp,
      username,
      name,
      bio,
      coverPicCid,
      pfPicCid,
    ]);
    setProfilePicCid(pfPicCid);
    setIsProfileComplete(true);
    Router.push('/profile');
  };

  const updateHandler = async () => {
    const client = makeStorageClient();
    let pfPicCid = '';
    let coverPicCid = '';
    if (profilePic.length > 0) {
      pfPicCid = await client.put(profilePic);
    }
    if (coverPic.length > 0) {
      coverPicCid = await client.put(coverPic);
    }
    await collectionReference
      .record(address)
      .call('updateDetails', [name, bio, pfPicCid, coverPicCid]);
    Router.push('/profile');
  };

  return (
    <>
      <NextSeo
        title={isProfileComplete ? 'Update Profile Details' : 'Create Profile'}
        description="SofToken"
      />
      <div className="mx-auto w-full px-4 pt-8 pb-14 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 xl:px-10 2xl:px-0">
        <h2 className="mb-6 text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-10 sm:text-2xl">
          {isProfileComplete ? 'Update Profile Details' : 'Create Profile'}
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* File uploader */}
            <div className="mb-8">
              <InputLabel title="Upload Cover Photo" important />
              <Uploader files={coverPic} setFiles={setCoverPic} />
            </div>

            {/* File uploader */}
            <div className="mb-8">
              <InputLabel title="Upload Profile Photo" important />
              <Uploader files={profilePic} setFiles={setProfilePic} />
            </div>
          </div>

          <div className="hidden flex-col lg:flex">
            {/* Profile preview */}
            <InputLabel title="Profile Preview" />
            <div className="relative flex flex-grow flex-col overflow-hidden rounded-lg bg-white shadow-card transition-all duration-200 hover:shadow-large dark:bg-light-dark">
              <div className="flex items-center p-4 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400">
                @{username || 'Your Username'}
              </div>
              <div className="relative block w-full pb-full">
                <Image
                  src={
                    profilePic[0]?.preview ||
                    profilePreview[0]?.preview ||
                    AuthorImage
                  }
                  layout="fill"
                  objectFit="cover"
                  alt="Uploaded Profile Pic"
                />
              </div>
              <div className="p-5">
                <div className="text-base font-medium text-black dark:text-white">
                  {name || 'Your Name'}
                  <br /> {address && address.slice(0, 6)}...
                  {address && address.slice(-6)}
                </div>
                <div className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  {balance && balance.slice(0, 6)} ETH
                </div>
                <div className="mt-4 text-sm font-medium text-black dark:text-white">
                  {bio || 'Your Short Bio'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Username */}
        <div className="mb-8">
          <InputLabel
            title="Username"
            subTitle="Username can not be updated after profile is created. Username must be unique"
            important
          />
          <Input
            type="text"
            placeholder="Your Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isProfileComplete}
          />
        </div>

        {/* Name */}
        <div className="mb-8">
          <InputLabel title="Name" important />
          <Input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* bio */}
        <div className="mb-8">
          <InputLabel
            title="Bio"
            subTitle="The bio will be included on your profile page"
            important
          />
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Provide a brief intro about yourself"
          />
        </div>

        {/* Agree to Terms */}
        {!isProfileComplete && (
          <div className="mb-8">
            <ToggleBar
              title="Agree to Terms"
              subTitle="I agree to the terms and conditions of SofToken NFT Marketplace"
              icon={<Verified />}
              checked={termsAgree}
              onChange={() => setTermsAgree(!termsAgree)}
            />
          </div>
        )}

        <Button
          onClick={isProfileComplete ? updateHandler : submitHandler}
          disabled={isProfileComplete ? false : !termsAgree}
          shape="rounded"
        >
          {isProfileComplete ? 'UPDATE' : 'CREATE'}
        </Button>
      </div>
    </>
  );
};

UpdateProfilePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default UpdateProfilePage;
