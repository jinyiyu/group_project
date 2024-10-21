const SortReport = ({ sortOption, setSortOption }) => {
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div>
      <label>Sort by: </label>
      <select value={sortOption} onChange={handleSortChange}>
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
};

export default SortReport;
