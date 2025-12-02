// ATS Analysis Prompt Template
const ATS_ANALYSIS_PROMPT = (profileData, targetRoles) => `
You are an expert ATS (Applicant Tracking System) analyzer and career coach with deep knowledge of recruitment processes.

TASK: Analyze the following professional profile and provide a comprehensive ATS score with actionable improvement suggestions.

PROFILE DATA:
${profileData}

TARGET ROLES: ${targetRoles || 'Not specified'}

ANALYSIS REQUIREMENTS:
1. Calculate ATS Score (0-100) based on:
   - Profile Completeness (25 points): All required fields, photo, contact info
   - Skills Relevance (25 points): Match with target roles, technical + soft skills
   - Experience Quality (20 points): Descriptions, achievements, career progression
   - Education & Certifications (15 points): Relevant qualifications
   - Keyword Optimization (15 points): Industry keywords, action verbs, quantifiable results

2. Identify strengths and weaknesses
3. Provide specific, actionable suggestions categorized by priority
4. Recommend relevant keywords for the target roles

RESPONSE FORMAT (JSON):
{
  "atsScore": {
    "total": <number 0-100>,
    "breakdown": {
      "completeness": <number 0-25>,
      "skills": <number 0-25>,
      "experience": <number 0-20>,
      "education": <number 0-15>,
      "keywords": <number 0-15>
    },
    "grade": "<A+, A, B+, B, C+, C, D, or F>",
    "reasoning": "<brief explanation of the total score>"
  },
  "strengths": [
    "<specific strength 1>",
    "<specific strength 2>",
    "<specific strength 3>"
  ],
  "weaknesses": [
    "<specific weakness 1>",
    "<specific weakness 2>",
    "<specific weakness 3>"
  ],
  "suggestions": {
    "critical": [
      {
        "issue": "<critical issue>",
        "action": "<specific action to take>",
        "impact": "High",
        "priority": 1
      }
    ],
    "improvements": [
      {
        "area": "<area to improve>",
        "suggestion": "<specific suggestion>",
        "impact": "Medium",
        "priority": 2
      }
    ],
    "keywords": [
      "<keyword 1>",
      "<keyword 2>",
      "<keyword 3>"
    ]
  },
  "industryInsights": "<2-3 sentences about industry trends and how this profile aligns>"
}

IMPORTANT:
- Be specific and actionable in all suggestions
- Focus on ATS optimization, not just general career advice
- Ensure all scores add up correctly
- Provide realistic, achievable recommendations
- Consider the target roles when evaluating skills and experience

Provide ONLY the JSON response, no additional text.
`;

const SCORING_CRITERIA_PROMPT = `
DETAILED SCORING CRITERIA:

COMPLETENESS (0-25 points):
- All required fields filled: 10 points
- Professional photo uploaded: 5 points
- Complete contact information: 5 points
- Professional summary/bio present: 5 points

SKILLS RELEVANCE (0-25 points):
- Primary skills listed and relevant: 10 points
- Skills match target job titles: 8 points
- Balance of technical and soft skills: 4 points
- Industry-relevant tools mentioned: 3 points

EXPERIENCE QUALITY (0-20 points):
- Work experience entries present: 8 points
- Descriptions include achievements: 6 points
- Relevant job titles: 4 points
- Shows career progression: 2 points

EDUCATION & CERTIFICATIONS (0-15 points):
- Education background provided: 8 points
- Relevant certifications: 5 points
- Continuous learning indicators: 2 points

KEYWORD OPTIMIZATION (0-15 points):
- Industry keywords present: 6 points
- Action verbs used: 4 points
- Quantifiable achievements: 3 points
- ATS-friendly formatting: 2 points
`;

module.exports = {
    ATS_ANALYSIS_PROMPT,
    SCORING_CRITERIA_PROMPT,
};
