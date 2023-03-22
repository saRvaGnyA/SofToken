import { useContext, useState } from 'react';
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
//images
import AuthorImage from '@/assets/images/author.jpg';
import NFT1 from '@/assets/images/nft/nft-1.jpg';

const UpdateProfilePage: NextPageWithLayout = () => {
  let [explicit, setExplicit] = useState(false);
  let [unlocked, setUnlocked] = useState(false);
  const [termsAgree, setTermsAgree] = useState(false);
  const [bio, setBio] = useState('');
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

  return (
    <>
      <NextSeo title="Update Profile Details" description="SofToken" />
      <div className="mx-auto w-full px-4 pt-8 pb-14 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 xl:px-10 2xl:px-0">
        <h2 className="mb-6 text-lg font-medium uppercase tracking-wider text-gray-900 dark:text-white sm:mb-10 sm:text-2xl">
          Update Profile Details
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* File uploader */}
            <div className="mb-8">
              <InputLabel title="Upload Cover Photo" important />
              <Uploader />
            </div>

            {/* File uploader */}
            <div className="mb-8">
              <InputLabel title="Upload Profile Photo" important />
              <Uploader />
            </div>
          </div>

          <div className="hidden flex-col lg:flex">
            {/* NFT preview */}
            <InputLabel title="Preview" />
            <div className="relative flex flex-grow flex-col overflow-hidden rounded-lg bg-white shadow-card transition-all duration-200 hover:shadow-large dark:bg-light-dark">
              <div className="flex items-center p-4 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400">
                <Avatar
                  size="sm"
                  image={AuthorImage}
                  alt="Cameronwilliamson"
                  className="border-white bg-gray-300 ltr:mr-3 rtl:ml-3 dark:bg-gray-400"
                />
                @{username || 'Your Username'}
              </div>
              <div className="relative block w-full pb-full">
                <Image
                  src={NFT1}
                  placeholder="blur"
                  layout="fill"
                  objectFit="cover"
                  alt="Pulses of Imagination #214"
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
        <div className="mb-8">
          <ToggleBar
            title="Agree to Terms"
            subTitle="I agree to the terms and conditions of this NFT Marketplace"
            icon={<Verified />}
            checked={termsAgree}
            onChange={() => setTermsAgree(!termsAgree)}
          />
        </div>

        <Button disabled={!termsAgree} shape="rounded">
          CREATE
        </Button>
      </div>
    </>
  );
};

UpdateProfilePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default UpdateProfilePage;
