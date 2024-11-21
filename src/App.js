import React, { useState } from 'react';
import './App.css';

function App() {
  const [userInput, setUserInput] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [codeProposal, setCodeProposal] = useState('');
  const [loadingIdea, setLoadingIdea] = useState(null);
  const [selectedTech, setSelectedTech] = useState('React');


  const getIdeas = async () => {
    setLoading(true);
    try {
      const response = await fetch(process.env.REACT_APP_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Dame 3 ideas para programar en ${selectedTech} basadas en: ${userInput}. Clasifícalas por nivel de dificultad (fácil, medio, difícil).` }],
          max_tokens: 150,
          temperature: 0.7,
        })
      });
      const data = await response.json();
      const ideasText = data.choices[0].message.content.trim();
      const ideasArray = ideasText.split('\n').filter(idea => idea.trim() !== '');
      setIdeas(ideasArray);
    } catch (error) {
      console.error('Error fetching ideas:', error);
      setIdeas(['Error fetching ideas']);
    }
    setLoading(false);
  };

  const getCodeProposal = async (idea) => {
    setLoadingIdea(idea);
    try {
      const response = await fetch(process.env.REACT_APP_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Genera una propuesta de código para: ${idea} utilizando: ${selectedTech}` }],
          max_tokens: 500,
          temperature: 0.7,
        })
      });
      const data = await response.json();
      setCodeProposal(data.choices[0].message.content.trim());
    } catch (error) {
      console.error('Error fetching code proposal:', error);
      setCodeProposal('Error fetching code proposal');
    }
    setLoadingIdea(null);
  };

  return (
    <div className="App">
      <h1>Generador de Ideas de Programación</h1>
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Escribe tu idea aquí"
      />
      <select value={selectedTech} onChange={(e) => setSelectedTech(e.target.value)}>
  <option value="React">React</option>
  <option value="Python">Python</option>
  <option value="Node.js">Node.js</option>
</select>
      <button onClick={getIdeas} disabled={loading}>
        {loading ? 'Cargando...' : 'Obtener Ideas'}
      </button>
      {ideas.length > 0 && (
        <div>
          <h2>Ideas Generadas:</h2>
          <ul>
            {ideas.map((idea, index) => (
              <li key={index}>
                {idea}
                <button onClick={() => getCodeProposal(idea)} disabled={loadingIdea === idea}>
                  {loadingIdea === idea ? 'Cargando...' : 'Generar Código'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {codeProposal && (
        <div>
          <h2>Propuesta de Código:</h2>
          <pre>{codeProposal}</pre>
        </div>
      )}
    </div>
  );
}

export default App;