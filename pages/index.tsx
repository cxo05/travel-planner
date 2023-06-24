import React from 'react';

import Image from 'next/image';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import { ClientSafeProvider, LiteralUnion, getProviders, getSession, signIn } from "next-auth/react"
import { BuiltInProviderType } from 'next-auth/providers';

const LandingPage = ({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className='flex justify-center items-center h-full'>
      <Card>
        <div className='flex flex-col items-center'>
          <Image
            src={"/logo-no-background.png"}
            width={100}
            height={100}
            alt='Logo'
            className='py-10'
          />
          {providers &&
            Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <Button
                  onClick={() => signIn(provider.id, {
                    callbackUrl: `${window.location.origin}/plans`
                  })}
                  raised
                >
                  Sign in with {provider.name}
                </Button>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}

export default LandingPage;

interface Props {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider
  > | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const session = await getSession(ctx)

  if (session) {
    return {
      redirect: {
        destination: '/plans',
        permanent: false,
      },
    }
  }

  const providers = await getProviders()
  return {
    props: { providers },
  }
}