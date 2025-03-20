/* eslint-disable react/jsx-filename-extension */
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

const PokemonDetails = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPokemonDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      setPokemon(response.data);
    } catch (error) {
      setError("Failed to fetch Pokémon details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonDetails();
  }, [name]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!pokemon) return <p>No Pokémon found.</p>;

  return (
    <div className="p-2 grid justify-center">
      <h2 className="flex justify-center text-2xl font-bold capitalize">{pokemon.name}</h2>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="mx-auto w-32 h-32 object-contain"
      />
      
      <p><strong>Base Experience:</strong> {pokemon.base_experience}</p>
      <p><strong>Height:</strong> {pokemon.height}</p>
      <p><strong>Weight:</strong> {pokemon.weight}</p>

      <h3 className="text-xl font-semibold mt-4">Types:</h3>
      <ul>
        {pokemon.types.map((type) => (
          <li key={type.type.name}>{type.type.name}</li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-4">Abilities:</h3>
      <ul>
        {pokemon.abilities.map((ability) => (
          <li key={ability.ability.name}>{ability.ability.name}</li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-4">Stats:</h3>
      <ul className="s">
        {pokemon.stats.map((stat) => (
          <li key={stat.stat.name}>
            {stat.stat.name}: {stat.base_stat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonDetails;