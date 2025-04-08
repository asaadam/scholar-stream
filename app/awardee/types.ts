export interface Scholarship {
  id: string;
  title: string;
  organization: {
    name: string;
    logo: string;
  };
  postedTime: string;
  type: string[];
  location: string;
  fundingAmount?: string;
  fundingDate?: string;
  salary?: string;
  tags: string[];
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  employees?: number;
  isTopScholarship?: boolean;
}

// Sample scholarship data that can be imported by both browse and apply pages
export const scholarships: Scholarship[] = [
  {
    id: "1",
    title: "Global Undergraduate Scholarship",
    organization: {
      name: "Gates Foundation",
      logo: "/placeholder.svg?height=40&width=40",
    },
    postedTime: "2 weeks ago",
    type: ["Undergraduate", "International", "Full Time"],
    location: "United States",
    fundingAmount: "$50,000",
    fundingDate: "September 15, 2024",
    tags: ["STEM", "LEADERSHIP", "COMMUNITY SERVICE", "RESEARCH", "INNOVATION"],
    isTopScholarship: true,
    description: "The Global Undergraduate Scholarship aims to support exceptional students from around the world pursuing undergraduate degrees in STEM fields. Recipients will receive full tuition coverage, living stipend, and research opportunities at participating universities.",
    requirements: [
      "Demonstrated academic excellence with a GPA of 3.5 or higher",
      "Strong leadership skills and community involvement",
      "Interest in pursuing a career in STEM or related fields",
      "Financial need documented through FAFSA or equivalent",
      "Must be enrolled or accepted into an accredited undergraduate program",
      "Two letters of recommendation from academic advisors or professors",
      "Personal statement explaining career goals and impact aspirations",
    ],
    responsibilities: [
      "Maintain a minimum GPA of 3.3 throughout the academic program",
      "Participate in community service or volunteer work (minimum 40 hours per semester)",
      "Submit semester progress reports to the scholarship committee",
      "Attend annual scholarship conference and networking events",
      "Serve as a mentor to incoming scholars in subsequent years",
    ],
  },
  {
    id: "2",
    title: "Women in Computer Science Scholarship",
    organization: {
      name: "Google Scholars",
      logo: "/placeholder.svg?height=40&width=40",
    },
    postedTime: "3 days ago",
    type: ["Graduate", "Undergraduate", "Women", "Computer Science"],
    location: "Global",
    fundingAmount: "$10,000",
    fundingDate: "October 30, 2024",
    employees: 50,
    tags: [
      "COMPUTER SCIENCE",
      "WOMEN IN TECH",
      "SOFTWARE ENGINEERING",
      "AI",
      "MACHINE LEARNING",
    ],
    isTopScholarship: true,
    description: "The Women in Computer Science Scholarship program supports women pursuing degrees in computer science, software engineering, and related fields. This scholarship aims to increase gender diversity in technology and empower the next generation of women leaders in tech.",
    requirements: [
      "Identify as a woman or non-binary individual",
      "Enrolled in an accredited undergraduate or graduate program in computer science or related field",
      "Demonstrated interest in computer science through coursework, projects, or extracurricular activities",
      "Minimum GPA of 3.0 on a 4.0 scale",
      "Demonstrated leadership potential and commitment to supporting women in technology",
      "Must submit a portfolio or examples of programming projects",
      "Essay on how you plan to contribute to advancing diversity in tech",
    ],
    responsibilities: [
      "Participate in at least one hackathon or coding competition during the academic year",
      "Contribute to open-source projects or community coding initiatives",
      "Maintain academic standing with minimum required GPA",
      "Attend virtual mentorship sessions with industry professionals",
      "Submit an end-of-year report detailing academic achievements and community contributions",
    ],
  }
]; 