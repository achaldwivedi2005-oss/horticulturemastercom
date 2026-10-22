/**
 * Agricultural & horticultural universities in India, used in the sign-up / profile dropdown.
 * Grouped by state. "Other" lets students type a college that isn't listed.
 */
export const universityGroups: { group: string; items: string[] }[] = [
  {
    group: "Central & ICAR deemed universities",
    items: [
      "ICAR-Indian Agricultural Research Institute (IARI), New Delhi",
      "Central Agricultural University, Imphal",
      "Dr. Rajendra Prasad Central Agricultural University, Pusa",
      "Rani Lakshmi Bai Central Agricultural University, Jhansi",
      "Banaras Hindu University – Institute of Agricultural Sciences, Varanasi",
      "Visva-Bharati – Palli Siksha Bhavana, Santiniketan",
      "Nagaland University – SASRD, Medziphema",
    ],
  },
  {
    group: "Andhra Pradesh",
    items: [
      "Acharya N.G. Ranga Agricultural University, Guntur",
      "Dr. Y.S.R. Horticultural University, Venkataramannagudem",
    ],
  },
  { group: "Assam", items: ["Assam Agricultural University, Jorhat"] },
  { group: "Bihar", items: ["Bihar Agricultural University, Sabour"] },
  {
    group: "Chhattisgarh",
    items: [
      "Indira Gandhi Krishi Vishwavidyalaya, Raipur",
      "Mahatma Gandhi Udyanikee Evam Vanikee Vishwavidyalaya, Durg",
    ],
  },
  {
    group: "Gujarat",
    items: [
      "Anand Agricultural University, Anand",
      "Junagadh Agricultural University, Junagadh",
      "Navsari Agricultural University, Navsari",
      "Sardarkrushinagar Dantiwada Agricultural University, Dantiwada",
    ],
  },
  {
    group: "Haryana",
    items: [
      "CCS Haryana Agricultural University, Hisar",
      "Maharana Pratap Horticultural University, Karnal",
    ],
  },
  {
    group: "Himachal Pradesh",
    items: [
      "CSK Himachal Pradesh Krishi Vishvavidyalaya, Palampur",
      "Dr. Y.S. Parmar University of Horticulture and Forestry, Nauni (Solan)",
    ],
  },
  {
    group: "Jammu & Kashmir",
    items: ["SKUAST-Kashmir, Srinagar", "SKUAST-Jammu, Jammu"],
  },
  { group: "Jharkhand", items: ["Birsa Agricultural University, Ranchi"] },
  {
    group: "Karnataka",
    items: [
      "University of Agricultural Sciences, Bengaluru",
      "University of Agricultural Sciences, Dharwad",
      "University of Agricultural Sciences, Raichur",
      "Keladi Shivappa Nayaka University of Agricultural and Horticultural Sciences, Shivamogga",
      "University of Horticultural Sciences, Bagalkot",
    ],
  },
  { group: "Kerala", items: ["Kerala Agricultural University, Thrissur"] },
  {
    group: "Madhya Pradesh",
    items: [
      "Jawaharlal Nehru Krishi Vishwa Vidyalaya, Jabalpur",
      "Rajmata Vijayaraje Scindia Krishi Vishwa Vidyalaya, Gwalior",
    ],
  },
  {
    group: "Maharashtra",
    items: [
      "Mahatma Phule Krishi Vidyapeeth, Rahuri",
      "Dr. Panjabrao Deshmukh Krishi Vidyapeeth, Akola",
      "Vasantrao Naik Marathwada Krishi Vidyapeeth, Parbhani",
      "Dr. Balasaheb Sawant Konkan Krishi Vidyapeeth, Dapoli",
    ],
  },
  { group: "Odisha", items: ["Odisha University of Agriculture and Technology, Bhubaneswar"] },
  { group: "Punjab", items: ["Punjab Agricultural University, Ludhiana"] },
  {
    group: "Rajasthan",
    items: [
      "Swami Keshwanand Rajasthan Agricultural University, Bikaner",
      "Maharana Pratap University of Agriculture and Technology, Udaipur",
      "Sri Karan Narendra Agriculture University, Jobner",
      "Agriculture University, Kota",
      "Agriculture University, Jodhpur",
    ],
  },
  { group: "Tamil Nadu", items: ["Tamil Nadu Agricultural University, Coimbatore"] },
  {
    group: "Telangana",
    items: [
      "Professor Jayashankar Telangana Agricultural University, Hyderabad",
      "Sri Konda Laxman Telangana Horticultural University, Mulugu",
    ],
  },
  {
    group: "Uttar Pradesh",
    items: [
      "Chandra Shekhar Azad University of Agriculture and Technology, Kanpur",
      "Acharya Narendra Deva University of Agriculture and Technology, Ayodhya",
      "Sardar Vallabhbhai Patel University of Agriculture and Technology, Meerut",
      "Banda University of Agriculture and Technology, Banda",
    ],
  },
  {
    group: "Uttarakhand",
    items: [
      "G.B. Pant University of Agriculture and Technology, Pantnagar",
      "VCSG Uttarakhand University of Horticulture and Forestry, Bharsar",
    ],
  },
  {
    group: "West Bengal",
    items: [
      "Bidhan Chandra Krishi Viswavidyalaya, Mohanpur",
      "Uttar Banga Krishi Viswavidyalaya, Cooch Behar",
    ],
  },
];

export const OTHER_UNIVERSITY = "Other";

export const allUniversities = universityGroups.flatMap((g) => g.items);

export const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
  "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry",
  "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];
