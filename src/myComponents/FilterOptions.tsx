import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RatingRadio } from "./RatingRadio";
import { DurationSlider } from "./DurationSlider";

export function FilterOptions() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Course Duration</AccordionTrigger>
        <AccordionContent>
          <DurationSlider defaultValue={[33]} max={100} step={1} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Topic</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other
          components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Rating</AccordionTrigger>
        <AccordionContent>
          <RatingRadio />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
