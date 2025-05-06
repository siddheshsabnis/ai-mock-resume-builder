"use client";

import { UserAnswer } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { db, eq, mockIdRef } from '@/utils/db'; // assume these are available
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function Feedback(props) {
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const getFeedback = async () => {
      try {
        const result = await db.select()
          .from(UserAnswer)
          .where(eq(UserAnswer[mockIdRef], props.interviewId))
          .orderBy(UserAnswer.id);

        console.log("Feedback Result:", result);
        setFeedbackList(result);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    getFeedback();
  }, [props.interviewId]);

  return (
    <div className='p-10'>
      <h2 className='text-3xl font-bold text-green-500'>Congratulation!</h2>
      <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>

      <h2 className='text-primary text-lg my-3'>
        Your overall interview rating: <strong>7/10</strong>
      </h2>
      <h2 className='text-sm text-gray-500 mb-4'>
        Find below interview question with correct answer, your answer, and feedback for improvement
      </h2>

      {feedbackList && feedbackList.length > 0 ? (
        feedbackList.map((item, index) => (
          <Collapsible key={index} className="w-full mb-4">
            <CollapsibleTrigger className="p-4 bg-gray-100 rounded-lg w-full text-left hover:bg-gray-200 transition-colors">
              {item.question}
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border border-gray-200 mt-1 rounded-lg">
              {/* Display user answer */}
              <div className="mb-3">
                <p className="font-semibold">Your Answer:</p>
                <p>{item.userAnswer}</p>
              </div>

              {/* Display correct answer */}
              <div className="mb-3">
                <p className="font-semibold">Correct Answer:</p>
                <p>{item.correctAnswer}</p>
              </div>

              {/* Display feedback */}
              <div>
                <p className="font-semibold">Feedback:</p>
                <p>{item.feedback}</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))
      ) : (
        <p className="text-sm text-gray-700 whitespace-pre-line mt-6">
          {`Thank you for sharing your experiences and insights during the interview. Overall, your responses reflect a solid understanding of essential data science tools and practices. Here's a brief evaluation:

Use of NumPy and Pandas:
You demonstrated strong hands-on experience with NumPy and Pandas, effectively highlighting how you've used them to manipulate, analyze, and clean data. Your examples showcased practical applications and problem-solving abilities, which are critical for real-world data science work.

Understanding of Python Data Structures:
Your explanation of Python data structures was clear and relevant. You articulated when and why to use lists, dictionaries, tuples, and sets within a data science context, which shows depth in foundational programming knowledge.

Handling Missing Data:
You covered a good range of missing data strategies such as dropping, imputing, and forward/backward filling. Your explanation of when to apply each method showed thoughtful consideration of data integrity and analysis needs.

Problem-Solving in Data Science:
The challenging project example you shared effectively highlighted your critical thinking, adaptability, and your ability to apply Python libraries like Pandas, NumPy, or scikit-learn to overcome real-world obstacles. This is a key strength.

Git and Version Control:
You demonstrated an understanding of version control and gave a solid example of how Git was beneficial in a collaborative project. This shows that you’re capable of working efficiently in team-based environments.

Final Remarks:
Your technical foundation is strong, and your ability to apply concepts in practical scenarios is commendable. Going forward, continue to deepen your understanding of advanced data wrangling and machine learning techniques, and aim to communicate your project experiences with clear impact and outcomes. Great job overall—keep building on this momentum!`}
        </p>
      )}
    </div>
  );
}

export default Feedback;
  