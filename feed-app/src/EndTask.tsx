export default function EndTask() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Task Completed</h1>
      <p className="text-xl max-w-md">
        Thank you for completing this portion of the study. 
        <br/><br/>
        Please return to the survey (Qualtrics/Google Forms) to complete your post-task questionnaire.
      </p>
    </div>
  );
}
