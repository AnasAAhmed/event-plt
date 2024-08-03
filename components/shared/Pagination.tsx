"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';

type PaginationProps = {
  page: number | string,
  totalPages: number,
  urlParamName?: string
}

const Pagination = ({ page, totalPages, urlParamName = 'page' }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onClick = (btnType: string) => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1;

    const params = new URLSearchParams(searchParams.toString());
    params.set(urlParamName, pageValue.toString());

    const newUrl = `?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  }

  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => onClick('prev')}
        disabled={Number(page) <= 1}
      >
        Previous
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-28"
        onClick={() => onClick('next')}
        disabled={Number(page) >= totalPages}
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination;
