export const mockProfileData = {
    personal: {
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        location: "New York, USA",
        linkedin: "linkedin.com/in/johndoe",
        portfolio: "johndoe.com",
    },
    summary: {
        bio: "I am a passionate software engineer with 5 years of experience in building scalable web applications using React, Node.js, and Cloud technologies. I love solving complex problems and mentoring junior developers.",
        jobTitles: "Frontend Developer, Full Stack Engineer",
    },
    skills: {
        primary: "React, TypeScript, Node.js, Next.js",
        tools: "VS Code, Git, Figma, Docker, AWS",
        soft: "Leadership, Communication, Problem Solving",
    },
    experience: [
        {
            id: 1,
            title: "Senior Frontend Engineer",
            company: "TechCorp Inc.",
            startDate: "2022-01-01",
            endDate: "Present",
            location: "New York, NY",
            description: "Led the migration of the main dashboard from Angular to React. Improved performance by 40%. Mentored 3 junior developers.",
        },
        {
            id: 2,
            title: "Software Engineer",
            company: "WebSolutions LLC",
            startDate: "2019-06-01",
            endDate: "2021-12-31",
            location: "Remote",
            description: "Developed and maintained multiple client websites using React and Gatsby. Collaborated with designers to implement pixel-perfect UIs.",
        },
    ],
    education: [
        {
            id: 1,
            degree: "Bachelor of Science in Computer Science",
            institution: "University of Technology",
            year: "2019",
            grade: "3.8 GPA",
        },
    ],
    projects: [
        {
            id: 1,
            title: "E-commerce Platform",
            description: "A full-featured e-commerce platform built with Next.js, Stripe, and Sanity CMS.",
            technologies: "Next.js, Stripe, Sanity",
            link: "github.com/johndoe/ecommerce",
        },
    ],
    certifications: [
        {
            id: 1,
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
        },
    ],
    preferences: {
        roles: "Frontend Developer, Full Stack Developer",
        location: "Remote, New York",
        salary: "$120k - $150k",
        noticePeriod: "30 Days",
    },
    extras: {
        strengths: "Public Speaking, Technical Writing",
        hobbies: "Photography, Hiking, Chess",
    },
};
