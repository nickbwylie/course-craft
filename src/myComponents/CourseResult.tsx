import { Button } from "@/components/ui/button";
import { CourseWithFirstVideo } from "@/types/CourseType";
import { Link } from "react-router-dom";

export interface CourseResult {
  youtubeThumbnail: string;
  title: string;
}

export default function CourseResult({
  course_description,
  course_id,
  course_title,
  thumbnail_url,
}: CourseWithFirstVideo) {
  return (
    <div className="flex w-full no-wrap border-b-2 pb-4">
      <div style={{ width: "30%" }} className="aspect-video relative">
        <img
          src={thumbnail_url}
          alt={course_title}
          className="object-cover w-full h-full"
        />
      </div>
      <div style={{ width: "50%" }} className="ml-4">
        <h5 className="text-md font-semibold w-full">{course_title}</h5>
        <p className="text-sm w-full font-normal">{course_description}</p>

        <p className="mt-4 text-xs w-full text-gray-700">Nick Wylie</p>
        <p className="text-xs w-full flex text-gray-700">
          <div className="text-md font-bold text-black">4.1</div> (1,205)
        </p>
        <p className="text-xs w-full text-gray-700">
          4 hours of content - 8 videos - expert{" "}
        </p>
      </div>
      <div
        style={{ width: "20%", display: "flex", justifyContent: "flex-end" }}
      >
        <Button
          variant="outline"
          style={{ width: 100 }}
          className="font-bold text-black"
        >
          <Link to={`/course/${course_id}`} className="w-full h-full">
            Enroll
          </Link>
        </Button>
      </div>
    </div>
  );
}
