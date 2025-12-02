import config from '../config/config.json';

interface ProfileData {
    personal?: {
        fullName?: string;
        email?: string;
        phone?: string;
        location?: string;
        linkedin?: string;
        portfolio?: string;
    };
    summary?: {
        bio?: string;
        jobTitles?: string;
    };
    skills?: {
        primary?: string;
        tools?: string;
        soft?: string;
    };
    experience?: Array<{
        title?: string;
        company?: string;
        startDate?: string;
        endDate?: string;
        location?: string;
        description?: string;
    }>;
    education?: Array<{
        degree?: string;
        institution?: string;
        year?: string;
        grade?: string;
    }>;
    projects?: Array<{
        title?: string;
        description?: string;
        technologies?: string;
        link?: string;
    }>;
}

interface BackendResumeData {
    templateId: string;
    name: string;
    email: string;
    phone: string;
    summary: string;
    skills: string;
    experience: string;
    education: string;
    projects: string;
}

interface BackendResponse {
    success: boolean;
    downloadUrl?: string;
    error?: string;
}

/**
 * Transform frontend profile data to backend format
 */
function transformProfileData(profileData: ProfileData, templateId: string = 'basic'): BackendResumeData {
    // Format experience
    const experienceText = profileData.experience?.map(exp =>
        `${exp.title || ''} at ${exp.company || ''} (${exp.startDate || ''} - ${exp.endDate || ''})\n${exp.description || ''}`
    ).join('\n\n') || 'No experience listed';

    // Format education
    const educationText = profileData.education?.map(edu =>
        `${edu.degree || ''} - ${edu.institution || ''} (${edu.year || ''})${edu.grade ? ` - ${edu.grade}` : ''}`
    ).join('\n') || 'No education listed';

    // Format projects
    const projectsText = profileData.projects?.map(proj =>
        `${proj.title || ''}: ${proj.description || ''}\nTechnologies: ${proj.technologies || ''}`
    ).join('\n\n') || 'No projects listed';

    // Combine all skills
    const allSkills = [
        profileData.skills?.primary,
        profileData.skills?.tools,
        profileData.skills?.soft
    ].filter(Boolean).join(', ') || 'No skills listed';

    return {
        templateId,
        name: profileData.personal?.fullName || 'Unknown',
        email: profileData.personal?.email || '',
        phone: profileData.personal?.phone || '',
        summary: profileData.summary?.bio || 'No summary available',
        skills: allSkills,
        experience: experienceText,
        education: educationText,
        projects: projectsText
    };
}

/**
 * Generate resume using backend service
 */
export async function generateResumeWithBackend(
    profileData: ProfileData,
    templateId: string = 'basic'
): Promise<BackendResponse> {
    try {
        const backendUrl = config.api?.backend_service_url || 'http://localhost:3001';
        const transformedData = transformProfileData(profileData, templateId);

        const response = await fetch(`${backendUrl}/generate-resume`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transformedData),
        });

        if (!response.ok) {
            throw new Error(`Backend service error: ${response.status} ${response.statusText}`);
        }

        const result: BackendResponse = await response.json();

        // Convert relative path to absolute URL
        if (result.success && result.downloadUrl) {
            result.downloadUrl = `${backendUrl}${result.downloadUrl}`;
        }

        return result;
    } catch (error) {
        console.error('Error generating resume with backend:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Download PDF from URL
 */
export function downloadPDF(url: string, filename: string = 'resume.pdf') {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
