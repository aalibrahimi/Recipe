export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { ingredients } = req.body;

    const apiKey = '17102085bdf34bfcafdcce2946039c6f'; // Your API Key
    const endpoint = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${apiKey}`;

    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching recipes', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
