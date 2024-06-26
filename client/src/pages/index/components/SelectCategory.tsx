import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryType } from "@/lib/types";

const SelectCategory: React.FC<{
  className?: string;
  categories: CategoryType[];
  onChange: (value: string) => void;
}> = ({ className, categories, onChange }) => {
  return (
    <div>
      <Select defaultValue="all" onValueChange={onChange}>
        <SelectTrigger className={`w-[180px] ${className}`}>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="all" value="all">
            Select All
          </SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.title}>
              {category.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export { SelectCategory };
