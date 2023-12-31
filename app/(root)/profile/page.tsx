import { Button } from '@/components/ui/button'
import Collection from '@/components/ui/shared/Collection'
import { getEventsByUser } from '@/lib/actions/event.action'
import { getOrdersByUser } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/database/modals/order.model'
import { SearchParamProps } from '@/type'
import { auth } from '@clerk/nextjs'

import Link from 'next/link'
import React from 'react'

const Profilepage = async ({searchParams}:SearchParamProps) => {
    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;
const ordersPage = Number(searchParams?.ordersPage) || 1;
const eventsPage = Number(searchParams?.eventsPage) || 1;

    const orders =await getOrdersByUser({userId,page:ordersPage});

    const orderedEvents = orders?.data.map((order:IOrder)=> order.event) || [];
    const oragnizedEvents = await getEventsByUser({ userId, page: eventsPage })
    return (
        <>
            <section className='bg-primary-50 bg-dotted-patern bg-cover bg-center py-5 md:py-10'>
                <div className="wrapper flex items-center justify-center sm:justify-between" >
                    <h3 className="h3-bold text-center sm:text-left">My   Tickets</h3>
                    <Button asChild size="lg" className='button hidden sm:flex'>
                        <Link href="/#events">
                            Explore More Events
                        </Link>
                    </Button>
                </div>
            </section>
            <section className="wrapper my-8">
                <Collection
                    data={orderedEvents}
                    emptyTitle="No Events purchased yet"
                    emptyStateSubtext="No worries - plenty of exciting events to explore!"
                    collectionType="My_Tickets"
                    limit={3}
                    page={ordersPage}
                    urlParamName='ordersPage'
                    totalPages={orders?.totalPages}
                />
            </section>
            <section className='bg-primary-50 bg-dotted-patern bg-cover bg-center py-5 md:py-10'>
                <div className="wrapper flex items-center justify-center sm:justify-between" >
                    <h3 className="h3-bold text-center sm:text-left">Events Organized</h3>
                    <Button asChild size="lg" className='button hidden sm:flex'>
                        <Link href="/events/create">
                            Create New Event
                        </Link>
                    </Button>
                </div>
            </section>
            <section className="wrapper my-8">
                <Collection
                    data={oragnizedEvents?.data}
                    emptyTitle="No Events have been created yet"
                    emptyStateSubtext="Go create some now"
                    collectionType="Events_Organized"
                    limit={6}
                    page={eventsPage}
                    urlParamName='ordersPage'
                    totalPages={oragnizedEvents?.totalPages}
                />
            </section>
        </>
    )
}

export default Profilepage
