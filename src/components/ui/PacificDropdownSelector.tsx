// import { PacificDropdownType } from "@/types";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const PacificDropdownSelector = ({
  list,
  selectedValue,
  onValueChange,
  placeholderText,
  className,
}: {
  list: any; // List of items
  selectedValue: string; // Currently selected value
  onValueChange: (value: string) => void; // Function to handle value change
  placeholderText?: string;
  className?: string;
}) => {
  return (
    <Select
      value={selectedValue}
      onValueChange={(val) => onValueChange(val)} // Update the state on selection
    >
      <SelectTrigger className={cn(className ? className : "rounded-[8px] bg-primary dark:bg-pinkGradient border-none text-white")}>
        <SelectValue placeholder={selectedValue || placeholderText} />
      </SelectTrigger>
      <SelectContent className="w-fit bg-white border-none">
        <SelectGroup>
          {list.map((item: any) => (
            <SelectItem key={item.id} value={item.value}>
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default PacificDropdownSelector;
