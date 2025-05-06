'use client';
import { MockInterview } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import QuestionsSection from '@/app/dashboard/interview/[interviewId]/start/_components/QuestionsSection';
import { use } from 'react';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function StartInterview({ params }) {
  const { interviewId } = use(params);
  const router = useRouter();
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    if (interviewId) {
      getInterviewDetails();
    }
  }, [interviewId]);

  const getInterviewDetails = async () => {
    if (!interviewId) return;

    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));
      
      if (result && result.length > 0) {
        const jsonMockResp = JSON.parse(result[0].jsonMockResp);
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(result[0]);
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  const handlePreviousQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (mockInterviewQuestion && activeQuestionIndex < mockInterviewQuestion.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    }
  };

  const handleEndInterview = () => {
    router.push(`/dashboard/interview/${interviewId}/result`);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>

      <div className="flex justify-end gap-6 mt-6">
        {activeQuestionIndex > 0 && (
          <Button onClick={handlePreviousQuestion}>Previous Question</Button>
        )}
        {mockInterviewQuestion && activeQuestionIndex < mockInterviewQuestion.length - 1 && (
          <Button onClick={handleNextQuestion}>Next Question</Button>
        )}
        {mockInterviewQuestion && activeQuestionIndex === mockInterviewQuestion.length - 1 && (
          <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}> 
          <Button onClick={handleEndInterview}>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;