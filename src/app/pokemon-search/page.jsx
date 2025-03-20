"use client";

import { useState } from 'react';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import './poke-search.css';

const PokemonSearchApp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true);
    setError(null);
    setPokemon(null);

    //fetch Pokémon data using PokeAPI
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
      const data = response.data;

      setPokemon({
        name: data.name,
        image: data.sprites.front_default,
        types: data.types.map(t => t.type.name)
      });
    //error handling for invalid searches
    } catch (err) {
      setError('Pokémon not found. Please try another name or ID (ID starts from "1" onwards).');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div id='search-page' className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <motion.div id='motion-div' initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
        <div id='poke-search' className="p-4 w-full max-w-md rounded-2xl shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-center mb-4">Pokémon Search</h1>
            <div className="flex gap-2 mb-4">

            {/* search bar to search by Pokémon name or ID */}
              <input id='input-search'
                placeholder="Enter Pokémon name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-grow"
              />
              <button id='search-btn' onClick={handleSearch} disabled={loading}>Search</button>
            </div>

            {/* loading indicator while fetching data */}
            {loading && <Loader className="animate-spin mx-auto" />}

            {/* display error if poke not found */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* display Pokémon’s name, image, and type(s) when search performed */}
            {pokemon && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-center mt-4">
                  <h2 className="text-xl font-bold">{pokemon.name.toUpperCase()}</h2>
                  <img id='poke-img' src={pokemon.image} alt={pokemon.name} className="w-32 h-32 mx-auto" />
                  <div className="flex justify-center gap-2 mt-2">
                    {pokemon.types.map((type) => (
                      <span key={type} className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">{type}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PokemonSearchApp;