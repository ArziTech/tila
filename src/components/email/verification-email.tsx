import * as React from 'react';

interface VerificationEmailProps {
  verifyUrl: string;
}

export function VerificationEmail({ verifyUrl }: VerificationEmailProps) {
  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        lineHeight: '1.6',
        color: '#333',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9fafb',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#6366f1',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          TILA
        </div>

        <h1
          style={{
            color: '#111827',
            fontSize: '24px',
            marginBottom: '16px',
            marginTop: '0',
          }}
        >
          Verify your email address
        </h1>

        <p
          style={{
            color: '#4b5563',
            marginBottom: '16px',
          }}
        >
          Thanks for signing up for TILA (Today I've Learned About)!
        </p>

        <p
          style={{
            color: '#4b5563',
            marginBottom: '16px',
          }}
        >
          Please click the button below to verify your email address and activate
          your account.
        </p>

        <div style={{ textAlign: 'center' }}>
          <a
            href={verifyUrl}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '12px 32px',
              borderRadius: '8px',
              fontWeight: '600',
              margin: '24px 0',
              textAlign: 'center',
            }}
          >
            Verify Email Address
          </a>
        </div>

        <p
          style={{
            color: '#4b5563',
            marginBottom: '8px',
          }}
        >
          Or copy and paste this link into your browser:
        </p>

        <p
          style={{
            wordBreak: 'break-all',
            color: '#6366f1',
            fontSize: '14px',
            marginBottom: '16px',
          }}
        >
          {verifyUrl}
        </p>

        <div
          style={{
            backgroundColor: '#fef3c7',
            borderLeft: '4px solid #f59e0b',
            padding: '12px 16px',
            margin: '20px 0',
            borderRadius: '4px',
          }}
        >
          <strong style={{ color: '#92400e' }}>
            This link expires in 24 hours.
          </strong>
          <br />
          <span style={{ color: '#78350f', fontSize: '14px' }}>
            If you didn't create an account with TILA, you can safely ignore this
            email.
          </span>
        </div>

        <div
          style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb',
            textAlign: 'center',
            fontSize: '14px',
            color: '#9ca3af',
          }}
        >
          <p style={{ margin: '4px 0' }}>TILA - Today I've Learned About</p>
          <p style={{ margin: '4px 0' }}>
            Learning Management & Gamification Platform
          </p>
        </div>
      </div>
    </div>
  );
}
