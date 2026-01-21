# Email Verification Feature

## Overview

The email verification feature ensures users own their registered email addresses before they can create learning items and todos in TILA.

## Features

- ✅ Automatic verification email sent on registration
- ✅ Secure verification tokens with 24-hour expiration
- ✅ Resend verification email functionality
- ✅ Verification status checked before creating items/todos
- ✅ Warning banner for unverified users
- ✅ Development mode with console logging (no real emails)
- ✅ Existing users automatically marked as verified

## Architecture

### Database Schema

```prisma
model User {
  // ... existing fields
  emailVerified            DateTime?
  verificationToken        String?  @unique
  verificationTokenExpires DateTime?
}
```

### Files Created

1. **`/home/wawan/Projects/Nextjs/tila/src/lib/email.ts`**
   - Email sending utility using Resend API
   - HTML email template with TILA branding
   - Development mode console logging

2. **`/home/wawan/Projects/Nextjs/tila/src/actions/verify-email.ts`**
   - `resendVerificationEmail()` - Send new verification email
   - `verifyEmailToken()` - Validate token and verify email
   - Uses ActionResponse<T> wrapper pattern

3. **`/home/wawan/Projects/Nextjs/tila/src/app/api/auth/verify-email/route.ts`**
   - GET endpoint for verification link clicks
   - Validates token and updates user
   - Redirects to dashboard with success/error messages

4. **`/home/wawan/Projects/Nextjs/tila/src/components/auth/EmailVerificationBanner.tsx`**
   - Warning banner for unverified users
   - "Resend email" button with loading state
   - Uses Radix UI Alert component

### Files Modified

1. **`/home/wawan/Projects/Nextjs/tila/prisma/schema.prisma`**
   - Added email verification fields to User model

2. **`/home/wawan/Projects/Nextjs/tila/src/actions/auth/index.ts`**
   - Updated `registerAction` to generate and send verification email
   - Imports sendVerificationEmail function

3. **`/home/wawan/Projects/Nextjs/tila/src/actions/items.ts`**
   - Added email verification check in `addItem()`

4. **`/home/wawan/Projects/Nextjs/tila/src/actions/todos.ts`**
   - Added email verification check in `addTodo()`

5. **`/home/wawan/Projects/Nextjs/tila/src/app/dashboard/layout.tsx`**
   - Displays EmailVerificationBanner for unverified users

6. **`/home/wawan/Projects/Nextjs/tila/.env`** and **`.env.example`**
   - Added RESEND_API_KEY
   - Added NEXTAUTH_URL
   - Added NEXTAUTH_SECRET

## Setup Instructions

### 1. Install Dependencies

```bash
bun add resend
```

### 2. Configure Environment Variables

Add to your `.env` file:

```bash
# Email Configuration (Resend)
# Get your API key from https://resend.com/api-keys
RESEND_API_KEY=re_xxxxx

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
```

### 3. Database Migration

The migration has been applied and existing users have been marked as verified:

```bash
# Generate Prisma client
bunx prisma generate

# Push schema to database
bunx prisma db push --accept-data-loss

# Mark existing users as verified (already done)
bun run scripts/verify-existing-users.ts
```

### 4. Configure Resend (Optional for Production)

1. Sign up at https://resend.com
2. Get your API key from https://resend.com/api-keys
3. Add your API key to `.env`: `RESEND_API_KEY=re_xxxxx`
4. Verify your domain in Resend dashboard

## Development Mode

In development mode, emails are logged to the console instead of being sent:

```
=== DEVELOPMENT MODE: Email Verification ===
To: user@example.com
Verification URL: http://localhost:3000/api/auth/verify-email?token=abc123...
===========================================
```

## Testing

### Test Registration Flow

1. Register a new account
2. Check console for verification URL (development) or email (production)
3. Click verification link
4. User should be verified and banner should disappear

### Test Verification Check

1. Register a new account (but don't verify)
2. Try to create an item or todo
3. Should see error: "Please verify your email address before creating items"

### Test Resend Email

1. As an unverified user, click "Resend email" button
2. Should see loading state then success message
3. Check console/email for new verification link

### Test Token Expiration

1. Register a new account
2. Wait 24 hours (or modify token expiration in code)
3. Try to use expired verification link
4. Should see error: "Verification link expired"

## API Endpoints

### GET `/api/auth/verify-email?token={token}`

Verifies email using token from URL query parameter.

**Response:**
- Success: Redirects to `/dashboard?success=Email verified successfully!`
- Invalid token: Redirects to `/login?error=Invalid verification link`
- Expired token: Redirects to `/dashboard?error=Verification link expired`

## Server Actions

### `resendVerificationEmail()`

Resends verification email to current user.

**Returns:** `ActionResponse<null>`

### `verifyEmailToken(token: string)`

Verifies email using provided token.

**Returns:** `ActionResponse<{ userId: string }>`

## Security Considerations

1. **Token Generation**: Uses `crypto.randomBytes(32)` for secure tokens
2. **Token Expiration**: 24-hour expiration by default
3. **Unique Tokens**: Database constraint prevents duplicate tokens
4. **One-Time Use**: Tokens are cleared after verification
5. **Development Mode**: Plain text passwords bypass bcrypt (existing behavior)

## Troubleshooting

### Emails Not Sending

1. Check RESEND_API_KEY is set correctly
2. Verify your domain in Resend dashboard
3. Check console for error messages

### Verification Fails

1. Check if token is expired (24 hours)
2. Ensure user exists in database
3. Check if email is already verified

### Banner Not Showing

1. Verify `session.user.emailVerified` is null
2. Check dashboard layout is using EmailVerificationBanner
3. Ensure session is being fetched correctly

## Future Enhancements

- [ ] Add rate limiting for resend verification email
- [ ] Support multiple email providers (SendGrid, Mailgun)
- [ ] Add email verification to settings page
- [ ] Send reminder emails for unverified accounts
- [ ] Add email change verification flow
- [ ] Implement email templates system
