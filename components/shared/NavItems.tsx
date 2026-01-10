'use client';

import { headerLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import React from 'react'
import SmartLink from './SmartLink';

const NavItems = () => {
  const pathname = usePathname();

  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
      {headerLinks.map((link) => {
        const isActive = pathname === link.route;
        
        return (
          <li
            key={link.route}
            className={`${
              isActive && 'text-primary-500'
            } flex-center p-medium-16 whitespace-nowrap`}
          >
            <SmartLink href={link.route}>{link.label}</SmartLink>
          </li>
        )
      })}
    </ul>
  )
}

export default NavItems