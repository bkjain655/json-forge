"use client";
import { useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CONTENT } from "@/lib/faq-content";

export default function Description() {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel: string) => {
    setExpanded(expanded === panel ? "" : panel);
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-center mb-6">About JSON Forge – Best Online JSON & YAML Tools for Developers</h2>
        
        <Accordion type="single" defaultValue={CONTENT[0].id} collapsible className="w-full">
          {CONTENT.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger 
                className="flex justify-between items-center w-full p-4"
                onClick={() => handleChange(item.id)}
              >
                <span className="font-semibold text-left">{item.title}</span>
                {expanded === item.id ? <ChevronUp /> : <ChevronDown />}
              </AccordionTrigger>
              <AccordionContent className="p-4 text-left block">
                {item.description.map((paragraph, index) => (
                  <p key={index} className="mb-2">{paragraph}</p>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
