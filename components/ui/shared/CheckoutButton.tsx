  'use client'
import { IEvent } from '@/lib/database/modals/event.model'
import {  SignedIn, SignedOut, auth, useUser } from '@clerk/nextjs'
import React from 'react'
import { Button } from '../button'
import Link from 'next/link'
import Checkout from './Checkout'

const CheckoutButton = ({event}:{event:IEvent}) => {
const {user} = useUser();
const userId = user?.publicMetadata.userId as string;
const hasEventFinished = new Date(event.endDateTime) < new Date();

  return (
    <div className='flex items-center gap-3'>
      

      {hasEventFinished ? ( 
       <p className='p-2 text-red-600'>Event Ended.</p>
      ):( 
        <> 
        <SignedOut> 
            <Button asChild className='button rounded-full' size="lg"> 
                <Link href="/sign-in"> 
                Get Tickets
                </Link>
            </Button>
        </SignedOut>
        <SignedIn> 
        {userId ? <p className='p-regular-18 text-red-500 '>Your Event</p>:
         <Checkout event ={event} userId={userId}/>
        }
        </SignedIn>
        </>
      )}
    </div>
  //    <div className='flex items-center gap-3'>
  //    {hasEventFinished ? ( 
  //     <p className='p-2 text-red-600'>Sorry, tickets are no longer available.</p>
  //    ):( 
  //      <> 
  //      <SignedOut> 
  //          <Button asChild className='button rounded-full' size="lg"> 
  //              <Link href="/sign-in"> 
  //              Get Tickets
  //              </Link>
  //          </Button>
  //      </SignedOut>
  //      <SignedIn> 
  //        
  //       <Checkout event ={event} userId={userId}/>
  //   
  //      </SignedIn>
  //      </>
  //    )}
  //  </div>
  )
}

export default CheckoutButton
