import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function RatingRadio() {
  return (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">⭐⭐⭐⭐ 4 & up</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="com✩fortable" id="r2" />
        <Label htmlFor="r2">⭐⭐⭐ 3 & up</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">⭐⭐⭐ 2 & up</Label>
      </div>
    </RadioGroup>
  );
}
