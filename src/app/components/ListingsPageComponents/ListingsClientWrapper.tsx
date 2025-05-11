'use client';

import ListingsContent from '@/app/components/ListingsPageComponents/ListingsContent';
import { House } from '@/app/types/house';

type Props = {
  initialHouses: House[];
};

export default function ListingsClientWrapper({ initialHouses }: Props) {
  return <ListingsContent initialHouses={initialHouses} />;
}
