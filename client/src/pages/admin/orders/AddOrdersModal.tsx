import { ProductType } from "@/lib/types";
import React from "react";

// export type ProductType = {
//     id: number;
//     title: string;
//     price: number;
//     description: string;
//     imageUrl: string;
//     categoryId: number;
//   };

const AddOrdersModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({}) => {
  const [file, setFile] = React.useState<File | null>(null);
  const [createdCourse, setCreatedCourse] = React.useState<ProductType>({
    id: "",
    title: "",
    description: "",
    imageUrl: "",
    price: 0,
    categoryId: 0,
  });
  return <h1>AddOrdersModal</h1>;
};

export { AddOrdersModal };
