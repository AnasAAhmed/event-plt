'use client'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAllCategories } from '@/lib/actions/category.action';
import { ICategory } from '@/lib/database/modals/category.model';
const CategoryFilter = () => {

const [categories, setCategories] = useState<ICategory[]>([]);
const router = useRouter();
const searchParams = useSearchParams();

useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();

      categoryList && setCategories(categoryList as ICategory[])
    }

    getCategories();
  }, [])

// useEffect(() => {
//   const delayDebounceFn = setTimeout(() => {
//     let newUrl = '';

//     if(categories) {
//       newUrl = formUrlQuery({
//         params: searchParams.toString(),
//         key: 'query',
//         value: categories
//       })
//     } else {
//       newUrl = removeKeysFromQuery({
//         params: searchParams.toString(),
//         keysToRemove: ['categories']
//       })
//     }

//     router.push(newUrl, { scroll: false });
//   }, 300)

//   return () => clearTimeout(delayDebounceFn);
// }, [categories, searchParams, router])

const onSelectCategory = (category:string)=>{ 
    let newUrl = '';

        if(category && category !=='All') {
          newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'category',
            value: category
          })
        } else {
          newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['category']
          })
        }
    
        router.push(newUrl, { scroll: false });
      
}
    return (
       
            <Select   onValueChange={(value:string)=>onSelectCategory(value)} >
                <SelectTrigger className="w-full h-[55px]  bg-grey-50 rounded-full">
                    <SelectValue placeholder="Categories" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All" className='select-item p-regular-14'>All</SelectItem>
                    {categories.map((category)=>( 
                        <SelectItem value={category.name} key={category._id} className='select-item p-regular-14'> 
                        {category.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

       
    )
}

export default CategoryFilter
