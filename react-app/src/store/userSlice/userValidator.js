// Validation function
const validateUserData = (user) => {
  const errors = [];

  // Validate user profile fields
  const profileFields = user.userProfile;
  
  // First name: only letters and length within 15 characters
  if (!profileFields.firstName.trim()) {
    errors.push("First name is required");
  } else if (!/^[A-Za-z]+$/.test(profileFields.firstName) || profileFields.firstName.length > 15) {
    errors.push("First name should only contain letters and be within 15 characters");
  }

  // Validate SSN (assuming it should be 9 digits)
  if (!profileFields.SSN.trim() || !/^\d{9}$/.test(profileFields.SSN)) {
    errors.push("Valid SSN is required and should be 9 digits");
  }
  
  // Last name: only letters and length within 15 characters
  if (!profileFields.lastName.trim()) {
    errors.push("Last name is required");
  } else if (!/^[A-Za-z]+$/.test(profileFields.lastName) || profileFields.lastName.length > 15) {
    errors.push("Last name should only contain letters and be within 15 characters");
  }

  // Validate Date of Birth
  if (!profileFields.DoB.trim()) {
    errors.push("Date of Birth is required");
  }

  const reference = user.reference;

  // Check if at least one reference is provided
  if (reference.length === 0) {
    errors.push("At least one reference is required");
  }

  // Validate address fields
  const addressFields = user.address;

  // City: only letters and length within 15 characters
  if (!addressFields.city.trim()) {
    errors.push("City is required");
  } else if (!/^[A-Za-z]+$/.test(addressFields.city) || addressFields.city.length > 15) {
    errors.push("City should only contain letters and be within 15 characters");
  }

  // Validate ZIP code
  if (!addressFields.zip.trim() || !/^\d{5}(?:[-\s]\d{4})?$/.test(addressFields.zip)) {
    errors.push("Valid ZIP code is required");
  }

  // Validate contact info
  const contactInfo = user.contactInfo;

  // Cell phone: only numbers and length of 10
  if (!contactInfo.cellPhone.trim() || !/^\d{10}$/.test(contactInfo.cellPhone)) {
    errors.push("Valid cell phone number is required");
  }

  return errors;
};

export default validateUserData;

