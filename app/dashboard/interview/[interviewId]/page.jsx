'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { MockInterview } from '@/utils/schema';
import { Lightbulb, WebcamIcon } from 'lucide-react'; // ✅ only WebcamIcon from lucide
import { Button } from '@/components/ui/button';
import Webcam from "react-webcam"; // ✅ actual webcam component
import Link from 'next/link';




function Interview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const interviewId = params.interviewId;
        console.log("Interview ID:", interviewId);

        const result = await db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.mockId, interviewId));

        console.log("Interview data:", result[0]);
        setInterviewData(result[0]);
      } catch (error) {
        console.error("Error fetching interview details:", error);
      }
    };

    fetchInterviewDetails();
  }, [params]);

  return (
    <div className='my-10 '>
      <h2 className='font-bold text-2xl'>Let's get started</h2>
      <div className='grid grid-cols-1 md:grid-cols-2'>


      </div>
      <div>
        {webCamEnabled ? (
          <Webcam
            audio={true}
            mirrored
            style={{
              height: 300,
              width: 300,
            }}
          />
        ) : (
          <>
            <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
            <Button variant="ghost" onClick={() => setWebCamEnabled(true)}>
              Enable Web Cam and Microphone
            </Button>
          </>
        )}
      </div>

      {interviewData && (
        <div className='flex flex-col my-5 gap-5 p-5 rounded-lg border'>
          <div className='flex flex-col p-5 rounded-lg border gap-5'>

          <h2 className='text-lg'>
            <strong>Job Role/Job Position:</strong> {interviewData.jobPosition} </h2>
            <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong> {interviewData.jobDesc}</h2>
            <h2 className='text-lg'><strong>Years of Experience:</strong> {interviewData.jobExperience}</h2>
         
          </div>
          <div>
            <h2><Lightbulb/><strong>Information</strong></h2>
            <h2></h2>

          </div>

        </div>
        
      )}
      <div className='flex justify-end items-end'>
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
        <Button>Start Interview</Button>
        </Link>
        </div>
    </div>
  );
}

export default Interview;
