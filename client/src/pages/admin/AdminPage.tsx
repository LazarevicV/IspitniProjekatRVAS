import React from "react";

import { cn } from "@/lib/utils";
import { ProductsTab } from "./products/ProductsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTab } from "./orders/OrdersTab";
import { CategoriesTab } from "./categories/CategoriesTab";
// import { SchoolsTab } from "./schools/SchoolsTab";

const AdminPage: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("w-full flex justify-center items-center", className)}>
      <Tabs defaultValue="products" className="max-w-4xl w-full">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>
        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { AdminPage };
