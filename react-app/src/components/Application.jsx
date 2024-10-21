import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserThunk } from '../store/userSlice/userThunks';
import { fetchDocumentThunk } from '../store/documentSlice/documentThunk';
import { updateDocument } from '../store/documentSlice/documentSlice';
import { addEmergencyContact, updateField, deleteEmergencyContact} from '../store/userSlice/userSlice';
    
const UserForm = () => {
    const BASE_URL = "http://localhost:3000";
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const document = useSelector((state) => state.document);
    const [showReference, setShowReference] = useState("no");
    const [showDriverLicense, setShowDriverLicense] = useState("no");
    const [other, setOther] = useState("");

    const [contact, setContact] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        phone: '',
        email: '',
        relationship: '',
    });

    useEffect(() => {
        dispatch(fetchUserThunk());
        dispatch(fetchDocumentThunk());
    }, []);

    useEffect(()=> {
        if (user.driverLicense.number=='' && user.driverLicense.expirationDate=='' && user.driverLicense.licenseCopy=='') {
            setShowDriverLicense("no")
        }
        else {
            setShowDriverLicense("yes")
        }
    }, [user.driverLicense])

    useEffect(()=> {
        if (Object.values(user.reference).every(value => value === "" || value === user.reference._id)) {
            setShowReference("no")
        }
        else {
            setShowReference("yes")
        }
    }, [user.reference])

    const handleStatusChange = (e, type)=> {
        if (e.target.value=="yes") {
            dispatch(updateField({field: "employment.status", value: "citizen"}))
        }
        else {
            dispatch(updateField({field: "employment.status", value: "h1b"}))
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(updateField({ field: name, value: value }));
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContact((prevContact) => ({
            ...prevContact,
            [name]: value,
        }));
    };

    const addContact = (e) => {
        e.preventDefault();
        const copy = contact;
        dispatch(addEmergencyContact(copy));
        setContact({
            firstName: '',
            lastName: '',
            middleName: '',
            phone: '',
            email: '',
            relationship: '',
        });
    };

    const handleDocumentChange = async (e, type) => {
        const file = e.target.files[0];
        const base64File = await fileToBase64(file);
        let fileType = type;
        if (type.includes(".")) {
            fileType = type.split('.').pop();
        }
        dispatch(updateDocument({type: fileType, url: base64File}));        
    }
    console.log(document)

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

      //todo
    const uploadDocuments = async ()=> {
        const res = await fetch(
            `${BASE_URL}/document/upload?type=profilePicture`,
            {
                method: 'PUT',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                    },
                body: JSON.stringify({
                    base64File: document["profilePicture"],
                })
            });

        
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
    }

    const handleLicenseChange = (e) => {
        if (e.target.value == "no") {
            dispatch(updateField({ field: "driverLicense.number", value: "" }));
            dispatch(updateField({ field: "driverLicense.expirationDate", value: "" }));
            dispatch(updateField({ field: "driverLicense.licenseCopy", value: "" }));
            setShowDriverLicense("no")
        }
        else {
            setShowDriverLicense("yes")
        }
    }

    const handleReferenceChange = (e) => {
        if (e.target.value == "no") {
            dispatch(updateField({ field: "reference.firstName", value: "" }));
            dispatch(updateField({ field: "reference.lastName", value: "" }));
            dispatch(updateField({ field: "reference.middleName", value: "" }));
            dispatch(updateField({ field: "reference.phone", value: "" }));
            dispatch(updateField({ field: "reference.email", value: "" }));
            dispatch(updateField({ field: "reference.relationship", value: "" }));
            setShowReference("no")
        }
        else {
            setShowReference("yes")
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', user);
    };

    console.log(user.employment)


    return (
        <>
        <form onSubmit={handleSubmit}>
            <button onClick={uploadDocuments}>test doc upload</button>

            <h1>section i</h1>

            <label htmlFor="userProfile.firstName">First Name</label>
            <input type="text" name="userProfile.firstName" value={user.userProfile.firstName} onChange={handleChange} required/><br />

            <label htmlFor="userProfile.lastName">Last Name</label>
            <input type="text" name="userProfile.lastName" value={user.userProfile.lastName} onChange={handleChange} required /><br />

            <label htmlFor="userProfile.middleName">Middle Name</label>
            <input type="text" name="userProfile.middleName" value={user.userProfile.middleName} onChange={handleChange} /><br />

            <label htmlFor="userProfile.preferredName">Preferred Name</label>
            <input type="text" name="userProfile.preferredName" value={user.userProfile.preferredName} onChange={handleChange} /><br />

            <h1>section ii</h1>

            {(document.profilePicture!=="") ? 
            (<img
                src={document.profilePicture} 
                alt="Profile"
                style={{ width: '500px', height: '500px', objectFit: 'cover' }}
            />): 
            (<></>)}
            <label htmlFor="profilePicture">Upload a new profile picture</label>
            <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={(e) => handleDocumentChange(e, "userProfile.profilePicture")}
            /><br />

            <h1>section iii</h1>

            <label htmlFor="address.apt">Apartment #</label>
            <input type="text" name="address.apt" value={user.address.apt} onChange={handleChange} /><br />

            <label htmlFor="address.strName">Street Name</label>
            <input type="text" name="address.strName" value={user.address.strName} onChange={handleChange} required/><br />

            <label htmlFor="address.city">City</label>
            <input type="text" name="address.city" value={user.address.city} onChange={handleChange} required/><br />

            <label htmlFor="address.state">State</label>
            <input type="text" name="address.state" value={user.address.state} onChange={handleChange} required/><br />

            <label htmlFor="address.zip">Zip Code</label>
            <input type="text" name="address.zip" value={user.address.zip} onChange={handleChange} required/><br />

            <h1>section iv</h1>

            <label htmlFor="contactInfo.cellPhone">Cell Phone</label>
            <input type="tel" name="contactInfo.cellPhone" value={user.contactInfo.cellPhone} onChange={handleChange} required/><br />

            <label htmlFor="contactInfo.workPhone">Work Phone</label>
            <input type="tel" name="contactInfo.workPhone" value={user.contactInfo.workPhone} onChange={handleChange} /><br />

            <h1>section v</h1>

            <label htmlFor="car.model">Car Model</label>
            <input type="text" name="car.model" value={user.car.model} onChange={handleChange} /><br />

            <label htmlFor="car.color">Car Color</label>
            <input type="text" name="car.color" value={user.car.color} onChange={handleChange} /><br />

            <label htmlFor="car.make">Car Make</label>
            <input type="text" name="car.make" value={user.car.make} onChange={handleChange} /><br />

            <h1>section vi</h1>

            <label htmlFor="userProfile.email">Email</label>
            <input type="email" name="userProfile.email" value={user.userProfile.email} readOnly /><br />

            <h1>section vii</h1>

            <label htmlFor="userProfile.SSN">SSN</label>
            <input type="text" name="userProfile.SSN" value={user.userProfile.SSN} onChange={handleChange} required/><br />

            <label htmlFor="userProfile.DoB">Date of Birth</label>
            <input type="date" name="userProfile.DoB" value={user.userProfile.DoB} onChange={handleChange} required/><br />

            <label htmlFor="userProfile.gender">Gender</label>
            <select name="userProfile.gender" value={user.userProfile.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">I do not wish to answer</option>
            </select><br />

            

            <h1>section viii</h1>
            {/* todo OPT stuff */}
            <label>
                Are you a citizen or permanent resident of the U.S?
                <select
                value={(user.employment.status=="citizen" || user.employment.status=="green_card")?"yes":"no"} 
                onChange={(e) => handleStatusChange(e, "citizen")}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </label>

            {(user.employment.status=="citizen" || user.employment.status=="green_card") ? (
                <>
                <label>
                    Citizen or Green Card Holders?
                    <select
                    name="employment.status"
                    value={user.employment.status} 
                    onChange={handleChange}>
                        <option value="citizen">Citizen</option>
                        <option value="green_card">Green Card</option>
                    </select>
                </label>
                </>
            ):(
                <>
                <label>
                What is your work authorization?
                    <select
                    name="employment.status"
                    value={user.employment.status} 
                    onChange={handleChange}>
                        <option value="h1b">H1-B</option>
                        <option value="l2">L2</option>
                        <option value="f1">{`F1(CPT/OPT)`}</option>
                        <option value="other">Other</option>
                    </select>
                </label>

                <label htmlFor="employment.start">Start Date: </label>
                <input type="date" name="employment.start" value={other} onChange={handleChange} required /><br />

                <label htmlFor="employment.end">End Date: </label>
                <input type="date" name="employment.end" value={other} onChange={handleChange} required /><br />
                </>
            )}

            {user.employment.status == "opt" ? (
                <>
                <label>
                    Citizen or Green Card Holders?
                    <select
                    name="employment.status"
                    value={user.employment.status} 
                    onChange={(e) => handleChange(e)}>
                        <option value="citizen">Citizen</option>
                        <option value="green_card">Green Card</option>
                    </select>
                </label>
                </>
            ):(<>TODO</>)}

            {user.employment.status=="other" ? (
                <>
                <label htmlFor="employment.status">Please specify: </label>
                <input type="text" name="employment.status" value={other} onChange={(e)=> {setOther(e.target.value)}} required /><br />
                </>
            ):(<></>)}

            <h1>section ix</h1>

            <label>
                Do you have a driver’s license?
                <select
                value={showDriverLicense} 
                onChange={handleLicenseChange}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </label>

            {showDriverLicense=="yes" ?
            (<>
            <label htmlFor="driverLicense.number">Plate Number #</label>
            <input type="text" name="driverLicense.number" value={user.driverLicense.number} onChange={handleChange} required /><br />

            <label htmlFor="driverLicense.expirationDate">Expiration Date</label>
            <input type="date" name="driverLicense.expirationDate" value={user.driverLicense.expirationDate} onChange={handleChange} required/><br />

            {(document.licenseCopy!=="") ? 
            (<img
                src={document.licenseCopy} 
                alt="licenseCopy"
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            />): (<></>)}
            
            <label htmlFor="driverLicense">Upload a new license copy</label>
            <input
                type="file"
                name="driverLicense"
                accept="image/*"
                onChange={(e) => handleDocumentChange(e, "driverLicense.licenseCopy")}
                required
            /><br />
            </>):(<></>)}



            <h1>section x</h1>
            <label>
                Are you referred by anyone?
                <select
                value={showReference} 
                onChange={handleReferenceChange}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </label>

            {showReference== "yes"?
            (<>
            <label htmlFor="reference.firstName">First Name</label>
            <input type="text" name="reference.firstName" value={user.reference.firstName} onChange={handleChange} required /><br />

            <label htmlFor="reference.lastName">Last Name</label>
            <input type="text" name="reference.lastName" value={user.reference.lastName} onChange={handleChange} required /><br />

            <label htmlFor="reference.middleName">Middle Name</label>
            <input type="text" name="reference.middleName" value={user.reference.middleName} onChange={handleChange} /><br />

            <label htmlFor="reference.phone">Phone</label>
            <input type="tel" name="reference.phone" value={user.reference.phone} onChange={handleChange} required /><br />

            <label htmlFor="reference.email">Email</label>
            <input type="email" name="reference.email" value={user.reference.email} onChange={handleChange} required /><br />

            <label htmlFor="reference.relationship">Relationship</label>
            <input type="text" name="reference.relationship" value={user.reference.relationship} onChange={handleChange} required /><br />
            </>):(<></>)}

            <h1>section xi</h1>
            
            {user.emergencyContact.map((contact, index) => (
                <div key={contact.email}>
                    {Object.entries(contact).map(([field, value]) => (
                        <div key={`${contact.email}-${field}`}>
                            <label htmlFor={`emergencyContact.${field}`}>{`Emergency Contact ${field}`}</label>
                            <input type="text" name={`emergencyContact.${field}`} value={value} readOnly /><br />
                            
                        </div>
                    ))}
                    <button onClick={() => dispatch(deleteEmergencyContact(contact.email))} disabled={user.emergencyContact.length===1}>Delete</button>
                </div>
            ))}


            <button type="submit">Submit</button>
        </form>


        <form onSubmit={addContact}>
            <label htmlFor="firstName">Emergency Contact First Name</label>
            <input
                type="text"
                name="firstName"
                value={contact.firstName}
                onChange={handleContactChange}
                required
            />
            <br />

            <label htmlFor="lastName">Emergency Contact Last Name</label>
            <input
                type="text"
                name="lastName"
                value={contact.lastName}
                onChange={handleContactChange}
                required
            />
            <br />

            <label htmlFor="middleName">Emergency Contact Middle Name</label>
            <input
                type="text"
                name="middleName"
                value={contact.middleName}
                onChange={handleContactChange}
            />
            <br />

            <label htmlFor="phone">Emergency Contact Phone</label>
            <input
                type="tel"
                name="phone"
                value={contact.phone}
                onChange={handleContactChange}
                required
            />
            <br />

            <label htmlFor="email">Emergency Contact Email</label>
            <input
                type="text"
                name="email"
                value={contact.email}
                onChange={handleContactChange}
                required
            />
            <br />

            <label htmlFor="relationship">Relationship</label>
            <input
                type="text"
                name="relationship"
                value={contact.relationship}
                onChange={handleContactChange}
                required
            />
            <br />
            <button type="submit">Add Contact</button>
        </form>
        </>
    );
};

export default UserForm;
