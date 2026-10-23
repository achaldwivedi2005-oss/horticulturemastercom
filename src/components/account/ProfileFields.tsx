import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { targetExams } from "@/lib/profile-schema";
import { indianStates } from "@/lib/universities";
import { UniversityPicker } from "./UniversityPicker";

export type ProfileValues = {
  full_name: string;
  target_exam: string;
  university: string;
  state: string;
  phone: string;
};

export const emptyProfile: ProfileValues = { full_name: "", target_exam: "", university: "", state: "", phone: "" };

export function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return <p className="text-xs font-medium text-destructive">{message}</p>;
}

/** Shared student profile inputs (sign-up + profile editing). */
export function ProfileFields({
  values,
  onChange,
  errors,
  idPrefix = "p",
}: {
  values: ProfileValues;
  onChange: (patch: Partial<ProfileValues>) => void;
  errors: Partial<Record<string, string | undefined>>;
  idPrefix?: string;
}) {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-name`}>Full name</Label>
        <Input
          id={`${idPrefix}-name`}
          autoComplete="name"
          maxLength={100}
          value={values.full_name}
          onChange={(e) => onChange({ full_name: e.target.value })}
          aria-invalid={!!errors.full_name}
        />
        <FieldError message={errors.full_name} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-exam`}>Target exam</Label>
          <Select value={values.target_exam} onValueChange={(v) => onChange({ target_exam: v })}>
            <SelectTrigger id={`${idPrefix}-exam`} className="h-10" aria-invalid={!!errors.target_exam}>
              <SelectValue placeholder="Choose exam" />
            </SelectTrigger>
            <SelectContent>
              {targetExams.map((e) => (
                <SelectItem key={e} value={e}>
                  {e === "Other" ? "Other competitive exam" : e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.target_exam} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor={`${idPrefix}-state`}>State</Label>
          <Select value={values.state} onValueChange={(v) => onChange({ state: v })}>
            <SelectTrigger id={`${idPrefix}-state`} className="h-10" aria-invalid={!!errors.state}>
              <SelectValue placeholder="Choose state" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {indianStates.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError message={errors.state} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-uni`}>University / college</Label>
        <UniversityPicker
          id={`${idPrefix}-uni`}
          value={values.university}
          onChange={(v) => onChange({ university: v })}
          invalid={!!errors.university}
        />
        <FieldError message={errors.university} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-phone`}>
          Phone number <span className="font-normal text-muted-foreground">(optional, for WhatsApp updates)</span>
        </Label>
        <Input
          id={`${idPrefix}-phone`}
          type="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          maxLength={16}
          value={values.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          aria-invalid={!!errors.phone}
        />
        <FieldError message={errors.phone} />
      </div>
    </>
  );
}

/** Turns a zod error into a field → message map. */
export function toFieldErrors<K extends string = string>(issues: { path: (string | number)[]; message: string }[]): Partial<Record<K, string>> {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const k = String(i.path[0]);
    if (!out[k]) out[k] = i.message;
  }
  return out as Partial<Record<K, string>>;
}
