import React from "react";
import { Button } from "@/components/ui/button";
import { Baby } from "@shared/schema";
import { UserRound, Baby as BabyIcon, PlusCircle, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";

interface BabySelectorProps {
  babies: Baby[];
  activeBaby: Baby | null;
  onSelectBaby: (baby: Baby) => void;
  onAddNewBaby: () => void;
  onDeleteBaby?: (babyId: number) => void;
}

export function BabySelector({
  babies,
  activeBaby,
  onSelectBaby,
  onAddNewBaby,
  onDeleteBaby
}: BabySelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 px-3 py-2">
          {activeBaby ? (
            <>
              <BabyIcon className="h-4 w-4 text-primary" />
              <span className="font-medium">{activeBaby.name}</span>
            </>
          ) : (
            <>
              <UserRound className="h-4 w-4" />
              <span className="text-muted-foreground">Select a child</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {babies.map((baby) => (
          <DropdownMenuItem
            key={baby.id}
            className="flex justify-between items-center cursor-pointer"
            onClick={() => onSelectBaby(baby)}
          >
            <div>
              <div className="font-medium">{baby.name}</div>
              <div className="text-xs text-muted-foreground">
                Born {formatDate(baby.birthDate)}
              </div>
            </div>
            {onDeleteBaby && babies.length > 1 && baby.id === activeBaby?.id && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBaby(baby.id);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onAddNewBaby} className="cursor-pointer">
          <div className="flex items-center text-primary">
            <PlusCircle className="h-4 w-4 mr-2" />
            <span>Add new child</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}