import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { allUniversities, OTHER_UNIVERSITY, universityGroups } from "@/lib/universities";
import { cn } from "@/lib/utils";

/** Searchable list of Indian agricultural & horticultural universities, with an "Other" free-text option. */
export function UniversityPicker({
  id,
  value,
  onChange,
  invalid,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const isListed = allUniversities.includes(value);
  const [otherMode, setOtherMode] = useState(!!value && !isListed);

  const label = otherMode ? "Other (type below)" : value || "Search your university";

  return (
    <div className="grid gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={invalid}
            className={cn(
              "h-10 w-full justify-between rounded-md font-normal",
              !value && !otherMode && "text-muted-foreground",
              invalid && "border-destructive",
            )}
          >
            <span className="truncate">{label}</span>
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] min-w-[18rem] p-0" align="start">
          <Command>
            <CommandInput placeholder="Type to search…" />
            <CommandList className="max-h-72">
              <CommandEmpty>No match — choose "Other" below.</CommandEmpty>
              {universityGroups.map((g) => (
                <CommandGroup key={g.group} heading={g.group}>
                  {g.items.map((u) => (
                    <CommandItem
                      key={u}
                      value={`${u} ${g.group}`}
                      onSelect={() => {
                        onChange(u);
                        setOtherMode(false);
                        setOpen(false);
                      }}
                    >
                      <Check className={cn("size-4", value === u && !otherMode ? "opacity-100" : "opacity-0")} />
                      <span className="text-sm">{u}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
              <CommandGroup heading="Not listed">
                <CommandItem
                  value="other not listed college"
                  onSelect={() => {
                    setOtherMode(true);
                    onChange(isListed ? "" : value);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("size-4", otherMode ? "opacity-100" : "opacity-0")} />
                  {OTHER_UNIVERSITY} — my college isn't listed
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {otherMode && (
        <Input
          aria-label="Your college or university"
          placeholder="Type your college / university name"
          value={value}
          maxLength={200}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
