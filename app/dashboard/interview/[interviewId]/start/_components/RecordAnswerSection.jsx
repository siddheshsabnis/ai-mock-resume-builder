'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAimodel';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { db } from '@/utils/db';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results.length > 0) {
      const transcript = results.map(result => result.transcript).join(' ');
      setUserAnswer(transcript);
    }
  }, [results]);

  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      setUserAnswer('');
      setResults([]);
      startSpeechToText();
    }
  };

  const SaveUserAnswer = async () => {
    if (!mockInterviewQuestion || !interviewData || userAnswer.length < 10) {
      toast.error("Please record a longer answer");
      return;
    }

    setLoading(true);
    try {
      const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Based on the question and user answer, give a JSON with 'rating' and 'feedback' (3-5 lines improvement tips).`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const responseText = result.response.text();

      // Default feedback in case of parsing issues
      let rating = "5";
      let feedback = "Your answer was acceptable. Consider adding more specific examples.";
      
      try {
        // Try to extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedJson = JSON.parse(jsonMatch[0]);
          rating = parsedJson.rating || rating;
          feedback = parsedJson.feedback || feedback;
        }
      } catch (jsonError) {
        console.error("Error parsing AI response:", jsonError);
        // Continue with default values
      }

      // For debugging
      console.log("About to insert:", {
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        userAnswer,
        feedback
      });

      // Try simplified insert without returning
      try {
        await db.insert(UserAnswer).values({
          mockIdRef: interviewData?.mockId || 0,
          question: mockInterviewQuestion[activeQuestionIndex]?.question || "Question",
          correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer || "",
          userAnswer: userAnswer,
          feedback: feedback,
          rating: rating,
          userEmail: user?.primaryEmailAddress?.emailAddress || "user@example.com",
          createdAt: moment().format('DD-MM-YYYY')
        });
        
        toast.success("✅ Your answer has been recorded and feedback is ready!");
        setUserAnswer('');
        setResults([]);
      } catch (dbError) {
        console.error("Database insertion error:", dbError);
        toast.error("❌ Failed to save your answer to the database.");
      }
    } catch (error) {
      console.error("Error in SaveUserAnswer:", error);
      toast.error("❌ Error saving your answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='relative flex flex-col mt-20 justify-center items-center bg-white rounded-lg p-5'>
        <Image
          src='/image.png'
          width={200}
          height={200}
          alt='Background Image'
          className='absolute'
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10,
          }}
        />
      </div>

      <Button
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
        disabled={loading}
      >
        {isRecording ? (
          <h2 className='text-red-600 flex gap-2'>
            <Mic /> Stop Recording...
          </h2>
        ) : (
          'Record Answer'
        )}
      </Button>

      {userAnswer && (
        <div className="w-full p-4 my-2 bg-gray-100 rounded-lg max-w-2xl">
          <h3 className="font-medium mb-2">Your Answer:</h3>
          <p className="text-sm">{userAnswer}</p>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={SaveUserAnswer}
              disabled={!userAnswer || loading || userAnswer.length < 10}
            >
              {loading ? 'Saving...' : 'Save Answer'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecordAnswerSection;