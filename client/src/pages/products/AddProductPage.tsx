import React from "react";

import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductTabUser } from "./components/ProductsTabUser";
// import { SchoolsTab } from "./schools/SchoolsTab";

const AddProductPage: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("w-full flex justify-center items-center", className)}>
      <Tabs defaultValue="products" className="max-w-4xl w-full">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories" disabled>
            Categories
          </TabsTrigger>
          <TabsTrigger value="orders" disabled>
            Orders
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductTabUser />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { AddProductPage };
