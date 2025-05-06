"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAimodel";
import { LoaderCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { MockInterview } from "@/utils/schema";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [JobPosition, setJobPosition] = useState("");
  const [JobDesc, setJobDesc] = useState("");
  const [JobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router=useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const mockId = uuidv4();
    const InputPrompt = `Job Position: ${JobPosition}, Job Description: ${JobDesc}, Years of Experience: ${JobExperience}. Based on this, generate ${
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5
    } interview questions with answers in JSON format. Only include 'question' and 'answer' fields.`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const responseText = await result.response.text();
      const cleanedText = responseText.replace(/```json|```/g, "").trim();
      const jsonData = JSON.parse(cleanedText);

      const resp = await db.insert(MockInterview).values({
        mockId: mockId,
        jsonMockResp: JSON.stringify(jsonData),
        jobPosition: JobPosition.trim(),
        jobDesc: JobDesc.trim(),
        jobExperience: JobExperience.trim(),
        createdby: user?.primaryEmailAddress?.emailAddress || "guest",
        createdat: new Date().toISOString(),
      }).returning();
      if(resp) {
        setOpenDialog(false);
        router.push('/dashboard/interview/'+resp[0]?.mockId)
      }

      console.log("✅ Inserted into DB:", resp);
      alert("✅ Interview added successfully!");
      setOpenDialog(false);
    } catch (err) {
      console.error("❌ AI or DB Error:", err);
      alert("❌ Something went wrong. Check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your Interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div className="mt-4">
                  <label>Job Role/Position</label>
                  <Input
                    placeholder="Ex. Frontend Developer"
                    required
                    value={JobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>

                <div className="my-3">
                  <label>Job Description / Tech Stack</label>
                  <Textarea
                    placeholder="Ex. React, Tailwind, REST API"
                    required
                    value={JobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
                </div>

                <div className="my-3">
                  <label>Years of Experience</label>
                  <Input
                    type="number"
                    placeholder="Ex. 3"
                    required
                    value={JobExperience}
                    onChange={(e) => setJobExperience(e.target.value)}
                  />
                </div>

                <div className="flex gap-5 justify-end mt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
