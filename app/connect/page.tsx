import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Github, Linkedin } from "lucide-react";

export default function AboutMe() {
  return (
    <div className="flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">About Me</h2>
        <p className="text-gray-700 mb-4">
            With over a decade of experience in the SaaS industry, I have worked with leading organizations like Pega, Gainsight, and Salesforce, solving complex use cases through modern frontend technologies. My expertise spans across Next.js, Tailwind CSS, and component libraries like Ant Design, React MUI, and Radix UI, enabling me to build scalable, high-performance web applications.
        </p>
        <p className="text-gray-700 mb-4">
            In my journey, I have also worked extensively with Angular 2, Object-Oriented JavaScript, HTML5, CSS3, NGRX, Backbone.js, React, and React-Redux, allowing me to tackle diverse frontend challenges across multiple frameworks.
        </p>
        <p className="text-gray-700 mb-4">
            Beyond coding, I take an active role in Scrum and Agile processes, ensuring smooth project execution while fostering collaboration within teams. I am also a Salesforce Certified Scrum Master, bringing structured methodologies to my development workflow.
        </p>
        <p className="text-gray-700 mb-4">
            Always eager to learn and innovate, I thrive on architecting efficient, user-friendly solutions that enhance digital experiences.
        </p>
        <CardContent className="flex flex-row items-center justify-between gap-4">
          <Link href="mailto:bhavesh.kankaria@gmail.com" className="flex items-center space-x-2 text-blue-500 hover:underline">
            <Mail size={20} />
            <span>bhavesh.kankaria@gmail.com</span>
          </Link>
          <Link href="https://github.com/bkjain655" target="_blank" className="flex items-center space-x-2 text-gray-900 hover:underline">
            <Github size={20} />
            <span>GitHub</span>
          </Link>
          <Link href="https://www.linkedin.com/in/bhavesh-kumar-b88013160" target="_blank" className="flex items-center space-x-2 text-blue-700 hover:underline">
            <Linkedin size={20} />
            <span>LinkedIn</span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
