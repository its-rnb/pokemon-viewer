/* eslint-disable react/jsx-filename-extension */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import '../pokemon-explorer/poke-exp.css';

const PokemonExplorerApp = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [sortType, setSortType] = useState("");
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [limit] = useState(18);
  const router = useRouter();

  // Fetch Pokémon data with pagination
  const fetchPokemonList = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const pokemonData = await Promise.all(
        response.data.results.map(async (pokemon) => {
          const details = await axios.get(pokemon.url);
          return details.data;
        })
      );

      setPokemonList(pokemonData);
      setFilteredList(pokemonData);

      // Set maxPages based on total count
      const totalCount = response.data.count; 
      setMaxPages(Math.ceil(totalCount / limit));
      
    } catch (err) {
      setError("Failed to fetch Pokémon list.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch available types that have at least one Pokémon
// Fetch available types that have at least one Pokémon
const fetchPokemonTypes = async () => {
    try {
      const response = await axios.get("https://pokeapi.co/api/v2/type");
      const availableTypes = [];
  
      for (const type of response.data.results) {
        const typeData = await axios.get(type.url);
  
        if (typeData.data.pokemon.length > 0) {
          availableTypes.push(type.name); // Only push types that have Pokémon
        }
      }
      setTypes(availableTypes);
    } catch (err) {
      setError("Failed to fetch Pokémon types.");
    }
  };
  
  // Fetch Pokémon by Type
  const fetchPokemonByType = async (type) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
      const pokemonData = await Promise.all(
        response.data.pokemon.slice(0, limit).map(async (p) => {
          const details = await axios.get(p.pokemon.url);
          return details.data;
        })
      );
  
      setFilteredList(pokemonData);
      setPokemonList(pokemonData); // Update the main list as well
      setMaxPages(1); // Only one page is available when filtered by type
    } catch (err) {
      setError("Failed to fetch Pokémon by type.");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Type Change
  const handleTypeChange = async (event) => {
    const selected = event.target.value;
    setSelectedType(selected);
  
    if (selected === "") {
      // If no type is selected, fetch Pokémon normally
      fetchPokemonList();
    } else {
      await fetchPokemonByType(selected);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    applyFilters(searchValue, selectedType, sortType);
  };

  const handleSortChange = (event) => {
    const selectedSort = event.target.value;
    setSortType(selectedSort);
    applyFilters(searchTerm, selectedType, selectedSort);
  };

  const applyFilters = (searchTerm, selectedType, selectedSort) => {
    let filtered = pokemonList;

    if (searchTerm) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.some((t) => t.type.name === selectedType)
      );
    }

    if (selectedSort === "name-asc") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === "name-desc") {
      filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (selectedSort === "experience-asc") {
      filtered = filtered.sort((a, b) => a.base_experience - b.base_experience);
    } else if (selectedSort === "experience-desc") {
      filtered = filtered.sort((a, b) => b.base_experience - a.base_experience);
    }

    setFilteredList(filtered);
  };

  useEffect(() => {
    fetchPokemonList();
    fetchPokemonTypes();
  }, [page]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 id="exp-title" className="flex text-3xl font-bold justify-center">Pokémon Explorer</h1>
      <div id="data-ops" className="flex flex-wrap gap-2 my-4 justify-center">

        <input id="input-search"
          type="text"
          placeholder="Type Pokémon..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded"
        />

        <select id="filter-type"
          value={selectedType}
          onChange={handleTypeChange}
          className="border p-2 rounded"
        >
          <option value="">Filter by type</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select id="sort-by"
          value={sortType}
          onChange={handleSortChange}
          className="border p-2 rounded"
        >
          <option value="">Sort by</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="experience-asc">Base Experience (Low-High)</option>
          <option value="experience-desc">Base Experience (High-Low)</option>
        </select>

      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredList.map((pokemon) => (
          <div
            key={pokemon.id}
            className="border rounded p-2 text-center cursor-pointer hover:shadow"
            onClick={() => router.push(`/pokemon/${pokemon.name}`)}
          >
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-20 h-20 mx-auto"
            />
            <p className="capitalize">{pokemon.name}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Previous
        </button>
        
        <span>Page {page} of {maxPages}</span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, maxPages))}
          disabled={page === maxPages}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PokemonExplorerApp;