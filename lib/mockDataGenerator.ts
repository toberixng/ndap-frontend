// lib/mockDataGenerator.ts
interface MockData {
    personalInformation: {
      fullName: string;
      dateOfBirth: string; // Format: YYYY-MM-DD
      gender: string;
      placeOfBirth: { state: string; lga: string };
      nationality: string;
      maritalStatus: string;
    };
    contactAndAddressInformation: {
      residentialAddresses: { address: string; state: string; lga: string }[];
      phoneNumbers: string[];
      emailAddress?: string;
    };
    governmentAndIdentificationInformation: {
      nin: string; // National Identification Number
      bvn: string; // Bank Verification Number
      votersCardNumber: string;
      passportNumber: string;
      driversLicenseNumber: string;
      taxIdentificationNumber: string;
    };
    crimeHistory: {
      hasCriminalRecord: boolean;
      offenses?: { date: string; description: string }[];
    };
    behavioralAnalysis: {
      riskLevel: string; // Low, Medium, High
      traits: string[];
    };
  }
  
  // Nigerian-specific data
  const firstNames = ["Chukwudi", "Aminat", "Olumide", "Ngozi", "Yusuf", "Funmilayo"];
  const middleNames = ["Chinedu", "Fatima", "Adebayo", "Chinyere", "Ibrahim", "Abosede"];
  const lastNames = ["Okeke", "Abdullahi", "Adeyemi", "Okafor", "Suleiman", "Afolabi"];
  const states = ["Lagos", "Kano", "Rivers", "Ogun", "Enugu", "Kaduna"];
  const lgasByState: { [key: string]: string[] } = {
    Lagos: ["Ikeja", "Lagos Island", "Badagry", "Epe"],
    Kano: ["Kano Municipal", "Dala", "Fagge", "Gwale"],
    Rivers: ["Port Harcourt", "Obio/Akpor", "Bonny", "Okrika"],
    Ogun: ["Abeokuta South", "Ijebu Ode", "Odeda", "Sagamu"],
    Enugu: ["Enugu North", "Nsukka", "Udi", "Igbo-Eze"],
    Kaduna: ["Kaduna North", "Zaria", "Igabi", "Chikun"],
  };
  const streetPrefixes = ["Obafemi Awolowo", "Ahmadu Bello", "Nnamdi Azikiwe", "Tafawa Balewa"];
  const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"];
  const genders = ["Male", "Female"];
  const offenses = [
    "Petty Theft - Shoplifting incident",
    "Fraud - Financial misrepresentation",
    "Assault - Minor physical altercation",
    "Traffic Violation - Reckless driving",
  ];
  const traits = [
    "Trustworthy",
    "Impulsive",
    "Cautious",
    "Aggressive",
    "Sociable",
    "Withdrawn",
  ];
  const riskLevels = ["Low", "Medium", "High"];
  
  export function generateMockData(email?: string): MockData {
    const randomState = states[Math.floor(Math.random() * states.length)];
    const randomLga = lgasByState[randomState][Math.floor(Math.random() * lgasByState[randomState].length)];
    const randomNumber = (min: number, max: number) => Math.floor(min + Math.random() * (max - min));
  
    // Personal Information
    const fullName = `${firstNames[randomNumber(0, firstNames.length)]} ${middleNames[randomNumber(0, middleNames.length)]} ${lastNames[randomNumber(0, lastNames.length)]}`;
    const dobYear = randomNumber(1960, 2005);
    const dobMonth = String(randomNumber(1, 13)).padStart(2, "0");
    const dobDay = String(randomNumber(1, 29)).padStart(2, "0");
    const dateOfBirth = `${dobYear}-${dobMonth}-${dobDay}`;
  
    // Contact & Address Information (4 addresses)
    const residentialAddresses = Array(4)
      .fill(null)
      .map(() => {
        const state = states[randomNumber(0, states.length)];
        const lga = lgasByState[state][randomNumber(0, lgasByState[state].length)];
        const street = `${randomNumber(1, 999)} ${streetPrefixes[randomNumber(0, streetPrefixes.length)]} Road`;
        return { address: street, state, lga };
      });
    const phoneNumbers = Array(2)
      .fill(null)
      .map(() => `+234${randomNumber(700, 999)}${randomNumber(100, 999)}${randomNumber(1000, 9999)}`);
  
    // Government & Identification Information
    const nin = `${randomNumber(10000000000, 99999999999)}`; // 11-digit NIN
    const bvn = `${randomNumber(10000000000, 99999999999)}`; // 11-digit BVN
    const votersCardNumber = `PVC${randomNumber(10000000, 99999999)}`;
    const passportNumber = `A${randomNumber(10000000, 99999999)}`;
    const driversLicenseNumber = `DL${randomNumber(10000000, 99999999)}`;
    const taxIdentificationNumber = `TIN${randomNumber(100000000, 999999999)}`;
  
    // Crime History
    const hasCriminalRecord = Math.random() > 0.7; // 30% chance
    const crimeHistory = hasCriminalRecord
      ? Array(randomNumber(1, 3))
          .fill(null)
          .map(() => ({
            date: `${randomNumber(2015, 2024)}-0${randomNumber(1, 10)}-0${randomNumber(1, 9)}`,
            description: offenses[randomNumber(0, offenses.length)],
          }))
      : undefined;
  
    // Behavioral Analysis
    const riskLevel = riskLevels[randomNumber(0, riskLevels.length)];
    const behavioralTraits = Array(randomNumber(2, 4))
      .fill(null)
      .map(() => traits[randomNumber(0, traits.length)]);
  
    return {
      personalInformation: {
        fullName,
        dateOfBirth,
        gender: genders[randomNumber(0, genders.length)],
        placeOfBirth: { state: randomState, lga: randomLga },
        nationality: "Nigeria",
        maritalStatus: maritalStatuses[randomNumber(0, maritalStatuses.length)],
      },
      contactAndAddressInformation: {
        residentialAddresses,
        phoneNumbers,
        emailAddress: email,
      },
      governmentAndIdentificationInformation: {
        nin,
        bvn,
        votersCardNumber,
        passportNumber,
        driversLicenseNumber,
        taxIdentificationNumber,
      },
      crimeHistory: {
        hasCriminalRecord,
        offenses: crimeHistory,
      },
      behavioralAnalysis: {
        riskLevel,
        traits: behavioralTraits,
      },
    };
  }