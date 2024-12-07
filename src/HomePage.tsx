import { useState } from "react";
import "./App.css";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { NavigationMenuDemo } from "./myComponents/test";
import { Link } from "react-router-dom";
import CoolNav from "./myComponents/CoolNav";
import logo from "./assets/courseL.webp";

function HomePage() {
  const [count, setCount] = useState(0);
  const course1 = {
    video_id: "PE0u7-SX2hs",
    title: "How to Improve Yourself Right Now",
    author: "Jordan Peterson",
    transcript:
      "### Introduction:\nThe discussion revolves around the importance of self-improvement and how taking small, actionable steps can lead to a more organized and fulfilling life. Emphasizing the necessity of addressing personal discomforts, the speaker highlights the profound impact of daily habits and the importance of setting clear aims in life.\n\n### Key Point 1: The Necessity of Self-Improvement\nSelf-improvement is essential not only for personal well-being but also for the well-being of those around you. The speaker argues that failing to organize oneself can lead to unnecessary suffering, both for oneself and for others. Pain often serves as a catalyst for change, and recognizing this can motivate individuals to make improvements in their lives. \n\n### Key Point 2: Start Small and Fix Your Environment\nOne practical approach to self-improvement is to focus on your immediate environment. The speaker suggests taking a moment to assess your surroundings and identifying small things that bother you, like clutter or disorganization. By addressing these minor irritations, you can create a more pleasant and functional space, which can lead to broader improvements in your life.\n\n### Key Point 3: The Importance of Daily Routines\nDaily routines are fundamental to our lives, often comprising a significant portion of our time. The speaker emphasizes that these routines should not be overlooked as trivial; instead, they should be optimized. By making small adjustments to daily habits, individuals can significantly enhance their overall quality of life and reduce stressors that accumulate over time.\n\n### Key Point 4: Focus on What You Can Control\nThe speaker advises individuals to recognize their limits and focus on problems they can realistically address. Attempting to solve larger, more complex issues outside of one’s competence can lead to frustration and potential harm. Instead, one should concentrate on manageable tasks that can lead to positive changes, reinforcing the idea of humility in the self-improvement process.\n\n### Key Point 5: The Power of Aim and Perception\nA key takeaway from the discussion is the idea that perception is influenced by what we aim at. The speaker illustrates this with the example of a psychological experiment where viewers miss a gorilla in a video because they are focused on counting basketball passes. This highlights the importance of setting clear intentions in life, as what we choose to focus on shapes our experiences and reality. Therefore, individuals should be mindful of their aims, as they significantly impact how the world appears to them.",
    quiz: "1. **Multiple-Choice Question:**\n   What is the primary reason given for why one should bother improving oneself?\n   a) To impress others  \n   b) To avoid unnecessary suffering  \n   c) To achieve wealth and success  \n   d) To fulfill societal expectations  \n   **Correct Answer:** b) To avoid unnecessary suffering\n\n2. **True/False Question:**\n   The speaker suggests that organizing your living space can be a form of psychotherapy.  \n   **Answer:** True\n\n3. **Short-Answer Question:**\n   According to the speaker, what should you focus on fixing to improve your life?  \n   **Answer:** You should focus on fixing the things that bother you in your immediate environment, particularly the things you encounter every day.",
  } as const;

  const course2 = {
    video_id: "5vKGU3aEGss",
    title: "The Road to Revolution: The American Revolution Explained",
    author: "John Green",
    transcript:
      "### Introduction:\nIn this episode of Crash Course U.S. History, John Green explores the events leading up to the American Revolution, focusing on the Seven Years War, its causes, and its far-reaching consequences, particularly for the American colonies and Native Americans.\n\n### Key Point 1: The Seven Years War as a Catalyst\nThe Seven Years War, known in America as the French and Indian War, was primarily driven by economic interests tied to mercantilism. This economic theory emphasized government regulation to boost national power through favorable trade balances. The British Empire sought to expand its territories for raw materials and markets, which led to conflicts with the French and Native Americans over land claims, particularly in the Ohio River Valley.\n\n### Key Point 2: The Impact of War on Colonial Relations\nThe war resulted in significant territorial changes after Britain’s victory, but it also created tensions between colonists and the British government. The Proclamation Line of 1763 aimed to limit colonial expansion westward to appease Native Americans, but colonists largely ignored it, leading to increased resentment towards British authority. This disregard for the Proclamation highlighted the growing divide between colonial desires and British governance.\n\n### Key Point 3: Ideological Shifts and the Road to Revolution\nThe aftermath of the Seven Years War saw the rise of new political philosophies, including republicanism and liberalism, which challenged traditional authority. Republicanism emphasized governance without a monarchy and the importance of civic virtue, while liberalism focused on protecting individual rights as defined by thinkers like John Locke. Additionally, the Great Awakening revitalized religious fervor, encouraging individuals to question established norms, including political authority. These ideological shifts set the stage for the American Revolution by fostering a spirit of independence and skepticism towards British rule.",
    quiz: "1. **Multiple-Choice Question:**\n   What was the primary economic theory that guided the British Empire in the 18th century?\n   a) Free Trade  \n   b) Mercantilism  \n   c) Socialism  \n   d) Capitalism  \n   **Correct Answer:** b) Mercantilism\n\n2. **True/False Question:**\n   The Proclamation Line of 1763 allowed British colonists to settle west of the Appalachian Mountains.  \n   **Answer:** False\n\n3. **Short-Answer Question:**\n   What were the two political philosophies that emerged in the colonies around the end of the Seven Years War, which contributed to the American Revolution?  \n   **Answer:** Republicanism and Liberalism",
  } as const;

  const courses = [course1, course2];

  return (
    <div>
      <div style={{ width: "100%" }}>
        <CoolNav />
      </div>

      <div
        style={{
          width: "100%",
          height: "100vh", // Full viewport height
          display: "flex",
          flexDirection: "column", // Stack items vertically
          justifyContent: "center", // Center items vertically
          alignItems: "center", // Center items horizontally
        }}
      >
        <div style={{ width: "100%", alignContent: "center" }}>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Turn YouTube Videos Into Courses
          </h1>
        </div>
        <div style={{ width: "100%" }} className="m-10">
          <Button variant="outline">Explore</Button>
          <Button className="bg-slate-950 text-white hover:bg-slate-700">
            <Link to="/explore">Create</Link>
          </Button>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <img src={logo} width={300} height={300} />
          </div>
        </div>
      </div>
      <div
        style={{ width: "100wh", height: 200 }}
        className="bottomOfLanding"
      ></div>
      <div
        style={{
          width: "100%",
          height: "100vh", // Full viewport height
          display: "flex",
          flexDirection: "column", // Stack items vertically
          justifyContent: "center", // Center items vertically
          alignItems: "center", // Center items horizontally
        }}
      >
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          How it works
        </h1>
        <Accordion type="multiple" className="mt-10">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Step 1. Search for videos you want to study.
            </AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Step 2. Drag and drop the videos in order.
            </AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Step 3. We automatically create your course
            </AccordionTrigger>
            <AccordionContent>
              Using ai (powered by OpenAi) we generate summaries and quizzes on
              each YouTube video.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* <InfiniteMovingCardsDemo /> */}
      </div>
    </div>
  );
}

export default HomePage;
