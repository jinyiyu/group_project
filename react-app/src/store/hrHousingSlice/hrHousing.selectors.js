export const selectHouses = (state) => state.hrHousing.houses || [];
export const selectHousingLoading = (state) => state.hrHousing.loading;
export const selectHousingError = (state) => state.hrHousing.error;
export const selectHouseDetails = (state) => state.hrHousing.houseDetails;
