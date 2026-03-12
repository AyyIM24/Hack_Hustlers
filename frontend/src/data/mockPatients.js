// Mock patient database
const mockPatients = [
  {
    id: "APO-948271",
    name: "Eleanor Vance",
    age: 34,
    gender: "Female",
    bloodGroup: "O+",
    location: "Portland, OR",
    status: "Verified Record",
    lastVisit: "Oct 12, 2023",
  },
  {
    id: "APO-310582",
    name: "Marcus Chen",
    age: 45,
    gender: "Male",
    bloodGroup: "A-",
    location: "Seattle, WA",
    status: "Verified Record",
    lastVisit: "Jan 05, 2024",
  },
  {
    id: "APO-726419",
    name: "Priya Sharma",
    age: 28,
    gender: "Female",
    bloodGroup: "B+",
    location: "Austin, TX",
    status: "Pending Review",
    lastVisit: "Mar 01, 2024",
  },
  {
    id: "APO-119834",
    name: "James Okonkwo",
    age: 52,
    gender: "Male",
    bloodGroup: "AB+",
    location: "Chicago, IL",
    status: "Verified Record",
    lastVisit: "Feb 18, 2024",
  },
];

/**
 * Simulates an API call to fetch patient data by their scanned ID.
 * Returns a promise that resolves after a short delay.
 */
export const fetchPatientById = (scannedId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const patient = mockPatients.find(
        (p) => p.id.toLowerCase() === scannedId.trim().toLowerCase()
      );
      if (patient) {
        resolve(patient);
      } else {
        reject(new Error("Patient Not Found"));
      }
    }, 1200); // simulate network latency
  });
};

export default mockPatients;
