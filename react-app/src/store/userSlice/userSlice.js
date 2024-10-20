import { createSlice } from '@reduxjs/toolkit';
import { fetchUserThunk } from './userThunks';

const initialState = {
    userName: '',
    password: '',
    role: '',
    userProfile: {
        firstName: '',
        lastName: '',
        middleName: '',
        preferredName: '',
        email: '',
        SSN: '',
        DoB: '',
        gender: '',
        profilePicture: '',
    },
    address: {
        apt: '',
        strName: '',
        city: '',
        state: '',
        zip: '',
    },
    contactInfo: {
        cellPhone: '',
        workPhone: '',
    },
    employment: {
        status: '',
        start: '',
        end: '',
    },
    emergencyContact: [],
    reference: {
        firstName: '',
        lastName: '',
        middleName: '',
        phone: '',
        email: '',
        relationship: '',
    },
    onboardStatus: '',
    driverLicense: {
        number: '',
        expirationDate: '',
        licenseCopy: '',
    },
    house: '',
    feedback: [],
    nextStep: '',
    car: {
        model: '',
        color: '',
        make: ''
    },
};

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            return { ...state, ...action.payload };
        },
        updateField: (state, action) => {
            const { field, value } = action.payload;
            const fields = field.split('.');
            let current = state;

            for (let i = 0; i < fields.length - 1; i++) {
                current = current[fields[i]];
            }

            current[fields[fields.length - 1]] = value;
        },
        addEmergencyContact: (state, action) => {
            state["emergencyContact"].push(action.payload)
        },
        deleteEmergencyContact: (state, action) => {
            const email = action.payload;
            state.emergencyContact = state.emergencyContact.filter(contact => contact.email !== email);
        },
        clearUser: (state) => {
            return initialState;
        },
    },

    extraReducers: (builder) => {
      builder.addCase(
        fetchUserThunk.fulfilled,
        (state, action) => {
          return { ...state, ...action.payload };
        },
      );
    },
});

// Export actions
export const {
    setUser,
    updateField,
    addEmergencyContact,
    deleteEmergencyContact,
    clearUser,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
