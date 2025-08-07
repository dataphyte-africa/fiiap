"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

export interface ComboBoxOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterComboBoxProps {
  options: ComboBoxOption[];
  placeholder: string;
  queryParam?: string; // Optional when used as controlled component
  label?: string;
  className?: string;
  multiple?: boolean;
  // Controlled component props
  value?: string | string[];
  onSelectionChange?: (value: string | string[]) => void;
}

export function FilterComboBox({
  options,
  placeholder,
  queryParam,
  label,
  className,
  multiple = true,
  value,
  onSelectionChange,
}: FilterComboBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('organisations.filters');
  
  // Determine if component is controlled
  const isControlled = value !== undefined;
  
  // Get current selected values - either from props (controlled) or URL params (uncontrolled)
  const currentValues = React.useMemo(() => {
    if (isControlled) {
      // Controlled mode - use value prop
      if (Array.isArray(value)) {
        return value;
      } else if (value) {
        return [value];
      } else {
        return [];
      }
    } else {
      // Uncontrolled mode - use URL params
      if (!queryParam) return [];
      const paramValue = searchParams.get(queryParam);
      if (!paramValue) return [];
      return multiple ? paramValue.split(',') : [paramValue];
    }
  }, [isControlled, value, searchParams, queryParam, multiple]);

  const handleSelectionChange = (optionValue: string, checked: boolean) => {
    if (isControlled) {
      // Controlled mode - call onSelectionChange callback
      if (onSelectionChange) {
        if (multiple) {
          let newValues = [...currentValues];
          
          if (checked) {
            // Add value if not already present
            if (!newValues.includes(optionValue)) {
              newValues.push(optionValue);
            }
          } else {
            // Remove value
            newValues = newValues.filter(v => v !== optionValue);
          }
          
          onSelectionChange(newValues);
        } else {
          // Single selection mode
          if (checked) {
            onSelectionChange(optionValue);
          } else {
            onSelectionChange('');
          }
        }
      }
    } else {
      // Uncontrolled mode - update URL params
      if (!queryParam) return;
      
      const params = new URLSearchParams(searchParams.toString());
      
      if (multiple) {
        let newValues = [...currentValues];
        
        if (checked) {
          // Add value if not already present
          if (!newValues.includes(optionValue)) {
            newValues.push(optionValue);
          }
        } else {
          // Remove value
          newValues = newValues.filter(v => v !== optionValue);
        }
        console.log(newValues, "newValues");
        if (newValues.length > 0) {
          params.set(queryParam, newValues.join(','));
        } else {
          console.log("deleting");
          params.delete(queryParam);
          params.set(queryParam, '');
        }
      } else {
        // Single selection mode
        if (checked) {
          params.set(queryParam, optionValue);
        } else {
          params.delete(queryParam);
        }
      }
      
      // Update URL
      const newUrl = params.toString() ? `?${params.toString()}` : '';
      router.push(newUrl, { scroll: false });
    }
  };

  const selectedCount = currentValues.length;
  const displayText = selectedCount > 0 
    ? multiple 
      ? t('selectedCount', { count: selectedCount })
      : options.find(opt => opt.value === currentValues[0])?.label || placeholder
    : placeholder;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "justify-between text-sm font-normal  w-full border-input rounded-md px-4 py-2 cursor-pointer flex items-center",
            selectedCount === 0 && "text-muted-foreground",
            className
          )}
        >
          <div className="flex flex-col items-start gap-1">
          {label && <span className="text-sm font-bold text-muted-foreground">{label}</span>}
          {displayText}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[200px] max-w-[300px] overflow-y-auto max-h-[300px] p-2" align="start">
        <div className="space-y-1">
          {options.map((option) => {
            const isSelected = currentValues.includes(option.value);
            
            return (
              <div
                key={option.value}
                className="flex items-center space-x-2 rounded-sm px-2 py-1.5 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onClick={() => handleSelectionChange(option.value, !isSelected)}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => {}} // Handled by parent div onClick
                  className="pointer-events-none"
                />
                <div className="flex-1 flex flex-col items-start justify-between gap-1">
                  <span className="text-sm">{option.label}</span>
                  {option.count !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {t('organisationCount', { count: option.count })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 