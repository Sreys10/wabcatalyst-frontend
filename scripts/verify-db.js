const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { loadEnvConfig } = require('@next/env');

// Load environment variables
loadEnvConfig(process.cwd());

// Mocking the toUserObjectId function from lib/profile.js
function toUserObjectId(sessionUser = {}) {
    const candidate = sessionUser.id || sessionUser.email || crypto.randomUUID();

    if (mongoose.Types.ObjectId.isValid(candidate)) {
        return new mongoose.Types.ObjectId(candidate);
    }

    const hash = crypto
        .createHash("md5")
        .update(candidate)
        .digest("hex")
        .slice(0, 24);

    return new mongoose.Types.ObjectId(hash);
}

async function verify() {
    console.log("🔍 Starting Backend Verification...");

    // 1. Check Environment Variables
    console.log("\n1️⃣  Checking Environment Variables:");
    const googleId = process.env.GOOGLE_CLIENT_ID;
    const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
    const mongoURI = process.env.MONGODB_URI;

    if (googleId && googleSecret) {
        console.log("   ✅ Google OAuth credentials found.");
    } else {
        console.log("   ❌ Google OAuth credentials MISSING.");
    }

    if (mongoURI) {
        console.log("   ✅ MongoDB URI found.");
    } else {
        console.log("   ❌ MongoDB URI MISSING.");
        return;
    }

    // 2. Check Users JSON
    console.log("\n2️⃣  Checking Local User Storage (data/users.json):");
    const usersFile = path.join(process.cwd(), 'data', 'users.json');
    let users = [];
    if (fs.existsSync(usersFile)) {
        const data = fs.readFileSync(usersFile, 'utf8');
        try {
            users = JSON.parse(data);
            console.log(`   ✅ Found ${users.length} users in users.json`);
            users.forEach(u => console.log(`      - ${u.email} (${u.provider})`));
        } catch (e) {
            console.log("   ❌ Error parsing users.json");
        }
    } else {
        console.log("   ❌ data/users.json NOT FOUND.");
    }

    // 3. Check MongoDB Profiles
    console.log("\n3️⃣  Checking MongoDB UserProfiles:");
    try {
        console.log(`   ℹ️  Connecting to MongoDB... (${mongoURI.substring(0, 15)}...)`);

        await mongoose.connect(mongoURI);
        console.log("   ✅ Connected to MongoDB.");

        const profileSchema = new mongoose.Schema({}, { strict: false });
        // Check if model already exists to avoid OverwriteModelError
        const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', profileSchema);

        const profiles = await UserProfile.find({});
        console.log(`   ✅ Found ${profiles.length} profiles in MongoDB`);

        profiles.forEach(p => {
            console.log(`      - Profile for: ${p.email} (ID: ${p._id})`);
        });

        // 4. Verify Linking
        console.log("\n4️⃣  Verifying Data Linking:");
        users.forEach(user => {
            const expectedObjectId = toUserObjectId(user);
            const profile = profiles.find(p => p.userId && p.userId.toString() === expectedObjectId.toString());

            if (profile) {
                console.log(`   ✅ User ${user.email} LINKED to Profile ${profile._id}`);
            } else {
                console.log(`   ⚠️ User ${user.email} has NO Profile in MongoDB (Expected ID: ${expectedObjectId})`);
            }
        });

    } catch (error) {
        console.error("   ❌ MongoDB Error Details:");
        console.error("      Message:", error.message);
        console.error("      Name:", error.name);
        if (error.cause) console.error("      Cause:", error.cause);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
}

verify();
