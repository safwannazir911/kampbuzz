import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpin from "react-loading-spin";
import { Button } from "@/components/ui/button";

const WordOfTheDay = () => {
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add an error state

  useEffect(() => {
    const fetchWordOfTheDay = async () => {
      try {
        const response = await axios.get(
          `https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${
            import.meta.env.VITE_WORDNIK_API_KEY
          }`,
        );
        const wordInfo = response.data;
        const definition =
          wordInfo.definitions[0]?.text || "No definition available";
        setWordData({
          word: wordInfo.word,
          description: definition,
        });
      } catch (err) {
        console.error(err);
        setError(
          "Failed to fetch the word of the day. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWordOfTheDay();
  }, []);

  if (loading) {
    return (
      <div className="w-fit-content flex justify-center mt-2">
        <Button variant="outline" className="gap-3" disabled>
          <LoadingSpin
            size="small"
            primaryColor="purple"
            secondaryColor="pink"
          />
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center border-double border-4 rounded p-2 my-2">
        <h2 className="font-serif font-bold text-xl text-red-600">Error</h2>
        <p className="font-serif">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center border-double border-4 rounded p-2 my-2">
      <h2 className="font-serif font-bold text-xl">Word of the Day</h2>
      <h3 className="text-violet-700 italic">{wordData.word}:</h3>
      <p className="font-serif">{wordData.description}</p>
    </div>
  );
};

export default WordOfTheDay;
