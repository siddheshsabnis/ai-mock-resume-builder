"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [JobPosition, setJobPosition] = useState("");
  const [JobDesc, setJobDesc] = useState("");
  const [JobExperience, setJobExperience] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!JobPosition || !JobDesc || !JobExperience) {
      alert("Please fill in all fields before submitting!");
      return;
    }

    console.log("Input:", JobPosition, JobDesc, JobExperience);

    // Mock Response Instead of API Call
    const mockResponse = {
      questions: [
        { question: "What is React?", answer: "React is a JS library for building UIs." },
        { question: "What is Node.js?", answer: "Node.js is a runtime for executing JS outside the browser." },
      ],
    };

    console.log("Mock Interview Questions:", JSON.stringify(mockResponse, null, 2)); // ✅ FIXED
    alert("Interview Questions Generated! (Check Console)");
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your Interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add details about your job position/role, job description,
                    and years of experience
                  </h2>
                  <div className="mt-7 my-3">
                    <label>Job Role/Job Position</label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      required
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label>Job Description/Tech Stack (in short)</label>
                    <Textarea
                      placeholder="Ex. React, Angular, MySQL, etc."
                      required
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label>Years of Experience</label>
                    <Input
                      placeholder="Ex. 5"
                      type="number"
                      max="50"
                      required
                      onChange={(event) => setJobExperience(event.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="Submit">Start Interview</Button>
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
