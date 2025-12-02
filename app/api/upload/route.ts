import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { file, folder } = body;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Upload to Cloudinary
        // Use a user-specific folder structure if needed, e.g., `users/${session.user.id}/${folder}`
        const targetFolder = folder ? `wabcatalyst/${folder}` : 'wabcatalyst/uploads';

        const url = await uploadToCloudinary(file, targetFolder);

        return NextResponse.json({ url }, { status: 200 });
    } catch (error) {
        console.error('Upload API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
