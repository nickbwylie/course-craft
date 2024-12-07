import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

type SliderProps = React.ComponentProps<typeof Slider>;

export function DurationSlider({ className, ...props }: SliderProps) {
  return (
    <div style={{ width: "100%", height: 30, marginTop: 10 }}>
      <Slider
        defaultValue={[50]}
        max={100}
        step={1}
        className={cn("w-[60%]", className)}
        {...props}
      />
    </div>
  );
}
