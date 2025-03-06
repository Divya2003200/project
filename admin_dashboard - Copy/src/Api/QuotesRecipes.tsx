import axios from "axios";

const QUOTES_API_URL = "https://dummyjson.com/quotes";
const RECIPES_API_URL = "https://dummyjson.com/recipes";

export const getAllQuotes = async (): Promise<{
  id: number;
  quote: string;
  author: string;
}[]> => {
  const response = await axios.get(QUOTES_API_URL);

  return (response.data.quotes || []).map((q: any) => ({
    id: q.id,
    quote: q.quote,   
    author: q.author,
  }));
};



export const getRecipes = async (): Promise<
  {
    id: number;
    name: string;
    description: string;
    image?: string;
  }[]
> => {
  const response = await axios.get(RECIPES_API_URL);
  return response.data.recipes;
};
